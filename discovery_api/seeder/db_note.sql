CREATE TABLE parties (
    id SERIAL PRIMARY KEY,
    type VARCHAR(10) CHECK (type IN ('supplier', 'customer')) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    opening_balance NUMERIC(12, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sku VARCHAR(50) UNIQUE,
    description TEXT,
    unit VARCHAR(20), -- e.g. pcs, kg, liter
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stock (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    warehouse_id INT REFERENCES warehouses(id) ON DELETE CASCADE,
    quantity NUMERIC(12, 2) NOT NULL DEFAULT 0,
    UNIQUE (product_id, warehouse_id)
);

CREATE TABLE stock_movements (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    warehouse_id INT REFERENCES warehouses(id),
    quantity NUMERIC(12, 2) NOT NULL,
    movement_type VARCHAR(10) CHECK (movement_type IN ('in', 'out', 'adjustment')) NOT NULL,
    reference_type VARCHAR(20), -- e.g. 'purchase', 'sale'
    reference_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

#Stock Movement Logic
    When a purchase is created:
        Add quantity to stock.
        Insert into stock_transactions with type purchase.
    When a sale is made:
        Subtract quantity from stock.
        Insert into stock_transactions with type sale.

#Get Product Stock per Warehouse:
SELECT 
  p.name AS product_name,
  w.name AS warehouse_name,
  s.quantity
FROM stock s
JOIN products p ON s.product_id = p.id
JOIN warehouses w ON s.warehouse_id = w.id;



CREATE TABLE purchases (
    id SERIAL PRIMARY KEY,
    party_id INT REFERENCES parties(id),
    warehouse_id INT REFERENCES warehouses(id),
    purchase_date DATE DEFAULT CURRENT_DATE,
    total_amount NUMERIC(12, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE purchase_items (
    id SERIAL PRIMARY KEY,
    purchase_id INT REFERENCES purchases(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    quantity NUMERIC(12, 2) NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    subtotal NUMERIC(12, 2) GENERATED ALWAYS AS (quantity * price) STORED
);

CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    party_id INT REFERENCES parties(id),
    warehouse_id INT REFERENCES warehouses(id),
    sale_date DATE DEFAULT CURRENT_DATE,
    total_amount NUMERIC(12, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INT REFERENCES sales(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    quantity NUMERIC(12, 2) NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    subtotal NUMERIC(12, 2) GENERATED ALWAYS AS (quantity * price) STORED
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    payment_date DATE DEFAULT CURRENT_DATE,
    amount_paid NUMERIC(12, 2) NOT NULL,
    payment_method VARCHAR(50),
    notes TEXT,
    type VARCHAR(10) CHECK (type IN ('purchase', 'sale')) NOT NULL,
    purchase_id INT,
    sale_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (
      (type = 'purchase' AND purchase_id IS NOT NULL AND sale_id IS NULL) OR
      (type = 'sale' AND sale_id IS NOT NULL AND purchase_id IS NULL)
    )
);

#Total Paid and Remaining for a Purchase:
SELECT 
  p.id AS purchase_id,
  p.total_amount,
  COALESCE(SUM(pp.amount_paid), 0) AS total_paid,
  (p.total_amount - COALESCE(SUM(pp.amount_paid), 0)) AS balance_due
FROM purchases p
LEFT JOIN purchase_payments pp ON p.id = pp.purchase_id
WHERE p.id = 1
GROUP BY p.id;

#Total Paid and Balance for a Sale
SELECT 
  s.id AS sale_id,
  s.total_amount,
  COALESCE(SUM(sp.amount_paid), 0) AS total_paid,
  (s.total_amount - COALESCE(SUM(sp.amount_paid), 0)) AS balance_due
FROM sales s
LEFT JOIN sale_payments sp ON s.id = sp.sale_id
WHERE s.id = 1
GROUP BY s.id;


CREATE TABLE ledgers (
    id SERIAL PRIMARY KEY,
    party_id INT NOT NULL, -- supplier or customer ID
    party_type VARCHAR(10) CHECK (party_type IN ('supplier', 'customer')),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    transaction_type VARCHAR(50) NOT NULL, -- 'purchase', 'sale', 'payment_in', 'payment_out', 'opening_balance', 'return'
    reference_id INT, -- links to purchase/sale/payment/etc
    description TEXT,
    debit NUMERIC(12, 2) DEFAULT 0,  -- Amount owed by party (e.g., a purchase)
    credit NUMERIC(12, 2) DEFAULT 0, -- Amount paid by party (e.g., a payment)
    balance NUMERIC(12, 2),          -- Running balance (optional but useful)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

#After a Purchase (from supplier):
    INSERT INTO ledgers (party_id, party_type, date, transaction_type, reference_id, description, debit)
    VALUES (10, 'supplier', CURRENT_DATE, 'purchase', 123, 'Invoice #123', 3000);

#After a Sale (to customer):
    INSERT INTO ledgers (party_id, party_type, date, transaction_type, reference_id, description, credit)
    VALUES (12, 'customer', CURRENT_DATE, 'sale', 456, 'Sale Invoice #456', 5000);

#After a Payment Received from Customer:
    INSERT INTO ledgers (party_id, party_type, date, transaction_type, reference_id, description, debit)
    VALUES (12, 'customer', CURRENT_DATE, 'payment_in', 789, 'Payment for #456', 0, 5000);

#After a Payment Made to Supplier:
    INSERT INTO ledgers (party_id, party_type, date, transaction_type, reference_id, description, credit)
    VALUES (10, 'supplier', CURRENT_DATE, 'payment_out', 321, 'Payment to supplier', 0, 3000);

#Query Statement (Supplier Ledger)
    SELECT
        date,
        transaction_type,
        description,
        debit,
        credit,
    SUM(debit - credit) OVER (PARTITION BY party_id ORDER BY date, id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_balance
    FROM ledgers
    WHERE party_id = 10 AND party_type = 'supplier'
    ORDER BY date, id;


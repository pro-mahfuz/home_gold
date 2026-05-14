
import app from "./app.js";
import { sequelize } from "./models/model.js";


const PORT = process.env.PORT || 3000;
const shouldSyncSchema = process.env.DB_SYNC === "true";

(async () => {
  try {
    if (shouldSyncSchema) {
      await sequelize.sync({ alter: true });
      console.log("Database synced successfully");
    } else {
      await sequelize.authenticate();
      console.log("Database connected successfully");
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || "unknown"}]`);
    });
  } catch (err) {
    console.error("DB connection error:", err);
  }
})();

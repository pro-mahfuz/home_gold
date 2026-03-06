const store = new Map();

export const setResetToken = (userId, token) => {
  store.set(token, { userId, expires: Date.now() + 3600000 }); // 1 hr
};

export const getResetToken = (token) => {
  const record = store.get(token);
  if (!record || Date.now() > record.expires) return null;
  return record.userId;
};

export const deleteResetToken = (token) => store.delete(token);

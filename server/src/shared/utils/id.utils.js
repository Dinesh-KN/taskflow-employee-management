export const getId = (value) => {
  return value?._id?.toString?.() || value?.toString();
};

export const isSameId = (firstId, secondId) => {
  return getId(firstId) === getId(secondId);
};

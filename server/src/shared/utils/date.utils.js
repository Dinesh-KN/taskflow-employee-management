const toDateTime = (value) => {
  if (!value) return null;

  const date = new Date(value);
  const time = date.getTime();

  return Number.isNaN(time) ? null : time;
};

export const areDatesEqual = (currentValue, nextValue) => {
  return toDateTime(currentValue) === toDateTime(nextValue);
};

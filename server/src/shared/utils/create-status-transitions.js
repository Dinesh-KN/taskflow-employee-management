export const createStatusTransitions = (transitions) =>
  Object.freeze(
    Object.fromEntries(
      Object.entries(transitions).map(([status, allowedStatuses]) => [
        status,
        Object.freeze([...allowedStatuses]),
      ]),
    ),
  );

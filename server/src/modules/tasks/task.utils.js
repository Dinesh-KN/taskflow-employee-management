export const getTaskSortOption = (sort) => {
  const sortOptions = {
    createdAt: { createdAt: 1 },
    '-createdAt': { createdAt: -1 },
    dueDate: { dueDate: 1 },
    '-dueDate': { dueDate: -1 },
    title: { title: 1 },
    '-title': { title: -1 },
  };

  return sortOptions[sort] || { createdAt: -1 };
};

export const taskPopulateOptions = [
  {
    path: 'project',
    select: 'name status priority startDate dueDate',
  },
  {
    path: 'assignedTo',
    select: 'firstName lastName email role status avatarImage',
  },
  {
    path: 'createdBy',
    select: 'firstName lastName email role status avatarImage',
  },
];

export const projectPopulateOptions = [
  {
    path: 'createdBy',
    select: 'firstName lastName email role status avatarImage',
  },
  {
    path: 'projectLead',
    select: 'firstName lastName email role status avatarImage',
  },
  {
    path: 'members',
    select: 'firstName lastName email role status avatarImage',
  },
];

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

export const toCountMap = (rows = []) => {
  return rows.reduce((countMap, row) => {
    if (row._id !== null && row._id !== undefined) {
      countMap[row._id] = row.count;
    }

    return countMap;
  }, {});
};

export const createStatusCountMap = (rows = [], supportedStatuses = []) => {
  const countMap = toCountMap(rows);

  return supportedStatuses.reduce((statusCounts, status) => {
    statusCounts[status] = countMap[status] ?? 0;

    return statusCounts;
  }, {});
};

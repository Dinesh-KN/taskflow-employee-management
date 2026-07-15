import {
  initializeTask,
  findTasks,
  findProjectTasks,
  getTaskDetails,
  updateTaskDetails,
  changeTaskStatus,
  reassignTask,
} from './task.service.js';

export const createTask = async (req, res) => {
  const { projectId } = req.validated.params;

  const { task } = await initializeTask({
    currentUser: req.user,
    projectId,
    ...req.validated.body,
  });

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: {
      task,
    },
  });
};

export const listTasks = async (req, res) => {
  const { tasks, pagination } = await findTasks({
    currentUser: req.user,
    ...req.validated.query,
  });

  res.status(200).json({
    success: true,
    message: 'Tasks fetched successfully',
    data: {
      tasks,
      pagination,
    },
  });
};

export const listProjectTasks = async (req, res) => {
  const { projectId } = req.validated.params;

  const { tasks, pagination } = await findProjectTasks({
    currentUser: req.user,
    projectId,
    ...req.validated.query,
  });

  res.status(200).json({
    success: true,
    message: 'Project tasks fetched successfully',
    data: {
      tasks,
      pagination,
    },
  });
};

export const getTask = async (req, res) => {
  const { taskId } = req.validated.params;

  const { task } = await getTaskDetails({
    taskId,
    currentUser: req.user,
  });

  res.status(200).json({
    success: true,
    message: 'Task fetched successfully',
    data: {
      task,
    },
  });
};

export const updateTask = async (req, res) => {
  const { taskId } = req.validated.params;

  const { task, changed } = await updateTaskDetails({
    taskId,
    currentUser: req.user,
    updateData: req.validated.body,
  });

  res.status(200).json({
    success: true,
    message: changed ? 'Task updated successfully' : 'No changes detected',
    data: {
      task,
      changed,
    },
  });
};

export const updateTaskStatus = async (req, res) => {
  const { taskId } = req.validated.params;
  const { status } = req.validated.body;

  const { task, changed } = await changeTaskStatus({
    taskId,
    currentUser: req.user,
    status,
  });

  res.status(200).json({
    success: true,
    message: changed
      ? 'Task status updated successfully'
      : 'No status change detected',
    data: {
      task,
      changed,
    },
  });
};

export const updateTaskAssignee = async (req, res) => {
  const { taskId } = req.validated.params;
  const { assignedTo } = req.validated.body;

  const { task, changed } = await reassignTask({
    taskId,
    currentUser: req.user,
    assignedTo,
  });

  res.status(200).json({
    success: true,
    message: changed
      ? 'Task assignee updated successfully'
      : 'No assignee change detected',
    data: {
      task,
      changed,
    },
  });
};

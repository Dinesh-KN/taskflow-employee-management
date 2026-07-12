import {
  initializeProject,
  findProjects,
  getProjectDetails,
  updateProjectDetails,
  changeProjectStatus,
  changeProjectLead,
  assignProjectMembers,
} from './project.service.js';

export const createProject = async (req, res) => {
  const { project } = await initializeProject({
    currentUser: req.user,
    ...req.validated.body,
  });

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: {
      project,
    },
  });
};

export const listProjects = async (req, res) => {
  const { projects, pagination } = await findProjects({
    currentUser: req.user,
    ...req.validated.query,
  });

  res.status(200).json({
    success: true,
    message: 'Projects fetched successfully',
    data: {
      projects,
      pagination,
    },
  });
};

export const getProject = async (req, res) => {
  const { projectId } = req.validated.params;

  const { project } = await getProjectDetails({
    projectId,
    currentUser: req.user,
  });

  res.status(200).json({
    success: true,
    message: 'Project fetched successfully',
    data: {
      project,
    },
  });
};

export const updateProject = async (req, res) => {
  const { projectId } = req.validated.params;

  const { project, changed } = await updateProjectDetails({
    projectId,
    currentUser: req.user,
    updateData: req.validated.body,
  });

  res.status(200).json({
    success: true,
    message: changed ? 'Project updated successfully' : 'No changes detected',
    data: {
      project,
      changed,
    },
  });
};

export const updateProjectStatus = async (req, res) => {
  const { projectId } = req.validated.params;
  const { status } = req.validated.body;

  const { project, changed } = await changeProjectStatus({
    projectId,
    currentUser: req.user,
    status,
  });

  res.status(200).json({
    success: true,
    message: changed
      ? 'Project status updated successfully'
      : 'No status changes detected',
    data: {
      project,
      changed,
    },
  });
};

export const updateProjectLead = async (req, res) => {
  const { projectId } = req.validated.params;
  const { projectLead } = req.validated.body;

  const result = await changeProjectLead({
    projectId,
    projectLeadId: projectLead,
    currentUser: req.user,
  });

  res.status(200).json({
    success: true,
    message: result.changed
      ? 'Project lead updated successfully'
      : 'Project lead is already assigned',
    data: {
      project: result.project,
      changed: result.changed,
    },
  });
};

export const updateProjectMembers = async (req, res) => {
  const { projectId } = req.validated.params;
  const { members } = req.validated.body;

  const { project, changed } = await assignProjectMembers({
    projectId,
    currentUser: req.user,
    members,
  });

  res.status(200).json({
    success: true,
    message: changed
      ? 'Project members updated successfully'
      : 'No member changes detected',
    data: {
      project,
      changed,
    },
  });
};

import {
  getAdminDashboard,
  getEmployeeDashboard,
  getManagerDashboard,
} from './dashboard.service.js';

export const getAdminDashboardController = async (req, res) => {
  const dashboard = await getAdminDashboard({
    ...req.validated.query,
  });

  res.status(200).json({
    success: true,
    message: 'Admin dashboard fetched successfully',
    data: {
      dashboard,
    },
  });
};

export const getManagerDashboardController = async (req, res) => {
  const dashboard = await getManagerDashboard({
    currentUser: req.user,
    ...req.validated.query,
  });

  res.status(200).json({
    success: true,
    message: 'Manager dashboard fetched successfully',
    data: {
      dashboard,
    },
  });
};

export const getEmployeeDashboardController = async (req, res) => {
  const dashboard = await getEmployeeDashboard({
    currentUser: req.user,
    ...req.validated.query,
  });

  res.status(200).json({
    success: true,
    message: 'Employee dashboard fetched successfully',
    data: {
      dashboard,
    },
  });
};

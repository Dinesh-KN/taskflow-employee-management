import {
  buildAdminDashboard,
  buildManagerDashboard,
  buildEmployeeDashboard,
} from './dashboard.service.js';

const getValidatedQuery = (req) => {
  return req.validated?.query ?? req.query ?? {};
};

export const getAdminDashboard = async (req, res) => {
  const query = getValidatedQuery(req);

  const dashboard = await buildAdminDashboard(query);

  return res.status(200).json({
    success: true,
    message: 'Admin dashboard fetched successfully',
    data: {
      dashboard,
    },
  });
};

export const getManagerDashboard = async (req, res) => {
  const query = getValidatedQuery(req);

  const dashboard = await buildManagerDashboard(req.user, query);

  return res.status(200).json({
    success: true,
    message: 'Manager dashboard fetched successfully',
    data: {
      dashboard,
    },
  });
};

export const getEmployeeDashboard = async (req, res) => {
  const query = getValidatedQuery(req);

  const dashboard = await buildEmployeeDashboard(req.user, query);

  return res.status(200).json({
    success: true,
    message: 'Employee dashboard fetched successfully',
    data: {
      dashboard,
    },
  });
};

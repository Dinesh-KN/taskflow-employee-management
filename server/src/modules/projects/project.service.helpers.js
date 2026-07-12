import { AppError } from '../../shared/errors/app-error.js';
import { Project } from './project.model.js';
import { cleanProjectName, normalizeProjectName } from './project.utils.js';

export const ensureProjectNameIsAvailable = async ({
  name,
  excludeProjectId = null,
}) => {
  const normalizedName = normalizeProjectName(name);

  const query = {
    normalizedName,
  };

  if (excludeProjectId) {
    query._id = { $ne: excludeProjectId };
  }

  const existingProject = await Project.exists(query);

  if (existingProject) {
    throw new AppError('Project with this name already exists', 409);
  }

  return normalizedName;
};

export const hasField = (object, field) => {
  return Object.prototype.hasOwnProperty.call(object, field);
};

const toDateTime = (value) => {
  if (!value) return null;

  const date = new Date(value);
  const time = date.getTime();

  return Number.isNaN(time) ? null : time;
};

export const areDatesEqual = (currentValue, nextValue) => {
  return toDateTime(currentValue) === toDateTime(nextValue);
};

export const getChangedProjectFields = async ({ project, updateData }) => {
  const changes = {};

  if (hasField(updateData, 'name')) {
    const cleanedName = cleanProjectName(updateData.name);

    const currentNormalizedName = normalizeProjectName(project.name);
    const nextNormalizedName = normalizeProjectName(cleanedName);

    if (currentNormalizedName !== nextNormalizedName) {
      await ensureProjectNameIsAvailable({
        name: cleanedName,
        excludeProjectId: project._id,
      });

      changes.name = cleanedName;
    }
  }

  if (hasField(updateData, 'description')) {
    const nextDescription = updateData.description?.trim() ?? '';

    if ((project.description ?? '') !== nextDescription) {
      changes.description = nextDescription;
    }
  }

  if (hasField(updateData, 'priority')) {
    if (project.priority !== updateData.priority) {
      changes.priority = updateData.priority;
    }
  }

  if (hasField(updateData, 'startDate')) {
    if (!areDatesEqual(project.startDate, updateData.startDate)) {
      changes.startDate = updateData.startDate;
    }
  }

  if (hasField(updateData, 'dueDate')) {
    if (!areDatesEqual(project.dueDate, updateData.dueDate)) {
      changes.dueDate = updateData.dueDate;
    }
  }

  return changes;
};

export const haveSameProjectMembers = (
  currentMembers = [],
  nextMembers = [],
) => {
  const currentMemberIds = currentMembers.map(String).sort();
  const nextMemberIds = nextMembers.map(String).sort();

  if (currentMemberIds.length !== nextMemberIds.length) {
    return false;
  }

  return currentMemberIds.every((memberId, index) => {
    return memberId === nextMemberIds[index];
  });
};

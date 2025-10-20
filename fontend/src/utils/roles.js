// Role and Permission constants
export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student'
}

export const PERMISSIONS = {
  // User Management
  MANAGE_USERS: 'manage_users',
  VIEW_USERS: 'view_users',
  DELETE_USERS: 'delete_users',
  
  // Content Management
  MANAGE_CONTENT: 'manage_content',
  CREATE_CONTENT: 'create_content',
  EDIT_CONTENT: 'edit_content',
  DELETE_CONTENT: 'delete_content',
  
  // Analytics & Reports
  VIEW_ANALYTICS: 'view_analytics',
  VIEW_REPORTS: 'view_reports',
  EXPORT_DATA: 'export_data',
  
  // Quiz Management
  MANAGE_QUIZZES: 'manage_quizzes',
  CREATE_QUIZZES: 'create_quizzes',
  EDIT_QUIZZES: 'edit_quizzes',
  DELETE_QUIZZES: 'delete_quizzes',
  
  // System Settings
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_LOGS: 'view_logs',
  
  // Learning Content
  VIEW_SUBJECTS: 'view_subjects',
  VIEW_TOPICS: 'view_topics',
  VIEW_PROGRESS: 'view_progress'
}

// Role-based permissions mapping
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.DELETE_USERS,
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_CONTENT,
    PERMISSIONS.DELETE_CONTENT,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.MANAGE_QUIZZES,
    PERMISSIONS.CREATE_QUIZZES,
    PERMISSIONS.EDIT_QUIZZES,
    PERMISSIONS.DELETE_QUIZZES,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.VIEW_LOGS,
    PERMISSIONS.VIEW_SUBJECTS,
    PERMISSIONS.VIEW_TOPICS,
    PERMISSIONS.VIEW_PROGRESS
  ],
  [ROLES.TEACHER]: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_CONTENT,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_QUIZZES,
    PERMISSIONS.CREATE_QUIZZES,
    PERMISSIONS.EDIT_QUIZZES,
    PERMISSIONS.VIEW_SUBJECTS,
    PERMISSIONS.VIEW_TOPICS,
    PERMISSIONS.VIEW_PROGRESS
  ],
  [ROLES.STUDENT]: [
    PERMISSIONS.VIEW_SUBJECTS,
    PERMISSIONS.VIEW_TOPICS,
    PERMISSIONS.VIEW_PROGRESS
  ]
}

// Helper functions
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false
}

export const hasAnyPermission = (userRole, permissions) => {
  if (!userRole || !permissions || !Array.isArray(permissions)) return false
  return permissions.some(permission => hasPermission(userRole, permission))
}

export const hasAllPermissions = (userRole, permissions) => {
  if (!userRole || !permissions || !Array.isArray(permissions)) return false
  return permissions.every(permission => hasPermission(userRole, permission))
}

export const isAdmin = (userRole) => userRole === ROLES.ADMIN
export const isTeacher = (userRole) => userRole === ROLES.TEACHER
export const isStudent = (userRole) => userRole === ROLES.STUDENT

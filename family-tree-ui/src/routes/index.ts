// Main Routes Configuration
import { authRoutes, validateAuthRoute } from './auth';
import { dashboardRoutes, validateDashboardRoute, getDashboardNavItems } from './dashboard';
import { adminRoutes, validateAdminRoute, getAdminNavItems } from './admin';
import { publicRoutes, validatePublicRoute, getPublicNavItems } from './public';

// Combined routes
export const allRoutes = {
  ...authRoutes,
  ...dashboardRoutes,
  ...adminRoutes,
  ...publicRoutes
};

// Route types
export interface RouteConfig {
  path: string;
  component: string;
  title: string;
  description: string;
  requiresAuth: boolean;
  requiresAdmin?: boolean;
  icon?: string;
  parent?: string;
  dynamic?: boolean;
  redirectIfAuthenticated?: string;
}

// Navigation helpers
export const getNavigationItems = (isAuthenticated: boolean, isAdmin: boolean) => {
  const items = [];
  
  // Always show public routes
  items.push(...getPublicNavItems());
  
  // Show auth routes only if not authenticated
  if (!isAuthenticated) {
    items.push(
      { label: 'ورود', href: '/login', icon: '🔑' },
      { label: 'ثبت‌نام', href: '/register', icon: '📝' }
    );
  }
  
  // Show dashboard routes if authenticated
  if (isAuthenticated) {
    items.push(...getDashboardNavItems());
  }
  
  // Show admin routes if admin
  if (isAdmin) {
    items.push(...getAdminNavItems());
  }
  
  return items;
};

// Route validation
export const validateRoute = (path: string, isAuthenticated: boolean, isAdmin: boolean = false) => {
  // Check auth routes
  const authValidation = validateAuthRoute(path, isAuthenticated);
  if (authValidation.valid) return authValidation;
  
  // Check dashboard routes
  const dashboardValidation = validateDashboardRoute(path, isAuthenticated);
  if (dashboardValidation.valid) return dashboardValidation;
  
  // Check admin routes
  const adminValidation = validateAdminRoute(path, isAuthenticated, isAdmin);
  if (adminValidation.valid) return adminValidation;
  
  // Check public routes
  const publicValidation = validatePublicRoute(path, isAuthenticated);
  if (publicValidation.valid) return publicValidation;
  
  // Default redirect
  return { valid: false, redirect: '/' };
};

// Route debugging helper
export const debugRoute = (path: string, isAuthenticated: boolean, isAdmin: boolean = false) => {
  const route = Object.values(allRoutes).find(r => 
    r.path === path || (r.dynamic && path.startsWith(r.path.split('[')[0]))
  );
  
  const validation = validateRoute(path, isAuthenticated, isAdmin);
  
  return {
    path,
    route,
    validation,
    isAuthenticated,
    isAdmin,
    timestamp: new Date().toISOString()
  };
};

// Export individual route groups for specific use cases
export { authRoutes, dashboardRoutes, adminRoutes, publicRoutes };
export { getDashboardNavItems, getAdminNavItems, getPublicNavItems };

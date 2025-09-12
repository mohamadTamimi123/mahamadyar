// Public Routes
export const publicRoutes = {
  home: {
    path: '/',
    component: 'HomePage',
    title: 'صفحه اصلی',
    description: 'صفحه اصلی سیستم',
    requiresAuth: false,
    icon: '🏠'
  },

};

// Public navigation helper
export const getPublicNavItems = () => {
  return Object.values(publicRoutes).map(route => ({
    label: route.title,
    href: route.path,
    icon: route.icon,
    requiresAuth: route.requiresAuth
  }));
};

// Route validation for public routes
export const validatePublicRoute = (path: string, isAuthenticated: boolean) => {
  const route = Object.values(publicRoutes).find(r => 
    r.path === path || (r.dynamic && path.startsWith(r.path.split('[')[0]))
  );
  
  if (!route) return { valid: false, redirect: '/' };
  
  if (route.requiresAuth && !isAuthenticated) {
    return { valid: false, redirect: '/login' };
  }
  
  return { valid: true, redirect: null };
};

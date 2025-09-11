// Dashboard Routes
export const dashboardRoutes = {
  main: {
    path: '/dashboard',
    component: 'DashboardPage',
    title: 'داشبورد',
    description: 'صفحه اصلی کاربر',
    requiresAuth: true,
    icon: '🏠'
  },
  profile: {
    path: '/dashboard/profile',
    component: 'ProfilePage',
    title: 'تکمیل حساب کاربری',
    description: 'مدیریت پروفایل و اطلاعات شخصی',
    requiresAuth: true,
    icon: '👤',
    parent: '/dashboard'
  },
  tree: {
    path: '/dashboard/tree',
    component: 'TreePage',
    title: 'نمودار درختی',
    description: 'نمایش نمودار درختی خانواده',
    requiresAuth: true,
    icon: '🌳',
    parent: '/dashboard'
  }
};

// Dashboard navigation helper
export const getDashboardNavItems = () => {
  return Object.values(dashboardRoutes).map(route => ({
    label: route.title,
    href: route.path,
    icon: route.icon,
    requiresAuth: route.requiresAuth
  }));
};

// Route validation for dashboard
export const validateDashboardRoute = (path: string, isAuthenticated: boolean) => {
  const route = Object.values(dashboardRoutes).find(r => r.path === path);
  
  if (!route) return { valid: false, redirect: '/dashboard' };
  
  if (route.requiresAuth && !isAuthenticated) {
    return { valid: false, redirect: '/login' };
  }
  
  return { valid: true, redirect: null };
};

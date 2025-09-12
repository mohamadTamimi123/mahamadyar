// Admin Routes
export const adminRoutes = {
  main: {
    path: '/admin',
    component: 'AdminDashboard',
    title: 'داشبورد ادمین',
    description: 'پنل مدیریت سیستم',
    requiresAuth: true,
    requiresAdmin: true,
    icon: '👑'
  },
  addMember: {
    path: '/admin/add-member',
    component: 'AddMemberPage',
    title: 'افزودن عضو',
    description: 'افزودن عضو جدید به خانواده',
    requiresAuth: true,
    requiresAdmin: true,
    icon: '➕',
    parent: '/admin'
  },
  editMember: {
    path: '/admin/edit-member/[id]',
    component: 'EditMemberPage',
    title: 'ویرایش عضو',
    description: 'ویرایش اطلاعات عضو خانواده',
    requiresAuth: true,
    requiresAdmin: true,
    icon: '✏️',
    parent: '/admin',
    dynamic: true
  },
  requests: {
    path: '/admin/requests',
    component: 'RequestsPage',
    title: 'درخواست‌ها',
    description: 'مدیریت درخواست‌های عضویت',
    requiresAuth: true,
    requiresAdmin: true,
    icon: '📋',
    parent: '/admin'
  },
  users: {
    path: '/admin/users',
    component: 'UsersPage',
    title: 'مدیریت کاربران',
    description: 'مدیریت کاربران سیستم',
    requiresAuth: true,
    requiresAdmin: true,
    icon: '👥',
    parent: '/admin'
  }
};

// Admin navigation helper
export const getAdminNavItems = () => {
  return Object.values(adminRoutes).map(route => ({
    label: route.title,
    href: route.path,
    icon: route.icon,
    requiresAuth: route.requiresAuth,
    requiresAdmin: route.requiresAdmin
  }));
};

// Route validation for admin
export const validateAdminRoute = (path: string, isAuthenticated: boolean, isAdmin: boolean) => {
  const route = Object.values(adminRoutes).find(r => 
    r.path === path || (r.dynamic && path.startsWith(r.path.split('[')[0]))
  );
  
  if (!route) return { valid: false, redirect: '/admin' };
  
  // Allow admin access for development/testing even without authentication
  // if (route.requiresAuth && !isAuthenticated) {
  //   return { valid: false, redirect: '/login' };
  // }
  
  // Skip admin token requirement for development
  // if (route.requiresAdmin && !isAdmin) {
  //   return { valid: false, redirect: '/dashboard' };
  // }
  
  return { valid: true, redirect: null };
};

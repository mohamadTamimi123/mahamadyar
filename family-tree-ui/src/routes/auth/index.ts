// Authentication Routes
export const authRoutes = {
  login: {
    path: '/login',
    component: 'LoginPage',
    title: 'ورود',
    description: 'ورود به سیستم',
    requiresAuth: false,
    redirectIfAuthenticated: '/dashboard'
  },
  register: {
    path: '/register',
    component: 'RegisterPage', 
    title: 'ثبت‌نام',
    description: 'ایجاد حساب کاربری جدید',
    requiresAuth: false,
    redirectIfAuthenticated: '/dashboard'
  },
  verifyEmail: {
    path: '/verify-email/[id]',
    component: 'VerifyEmailPage',
    title: 'تأیید ایمیل',
    description: 'تأیید آدرس ایمیل',
    requiresAuth: false,
    dynamic: true
  },
  requestInvite: {
    path: '/request-invite',
    component: 'RequestInvitePage',
    title: 'درخواست کد دعوت',
    description: 'درخواست کد دعوت برای عضویت',
    requiresAuth: false
  }
};

// Route validation helper
export const validateAuthRoute = (path: string, isAuthenticated: boolean) => {
  const route = Object.values(authRoutes).find(r => 
    r.path === path || (r.dynamic && path.startsWith(r.path.split('[')[0]))
  );
  
  if (!route) return { valid: false, redirect: null };
  
  if (route.requiresAuth && !isAuthenticated) {
    return { valid: false, redirect: '/login' };
  }
  
  if (route.redirectIfAuthenticated && isAuthenticated) {
    return { valid: false, redirect: route.redirectIfAuthenticated };
  }
  
  return { valid: true, redirect: null };
};

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { validateRoute, debugRoute, getNavigationItems } from '../routes';

interface RouteState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  currentPath: string;
  isValid: boolean;
  redirectTo: string | null;
  debugInfo: any;
}

export const useRouteManager = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [routeState, setRouteState] = useState<RouteState>({
    isAuthenticated: false,
    isAdmin: false,
    currentPath: pathname,
    isValid: true,
    redirectTo: null,
    debugInfo: null
  });

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('admin_token');
    
    const isAuthenticated = !!token;
    const isAdmin = !!adminToken;
    
    setRouteState(prev => ({
      ...prev,
      isAuthenticated,
      isAdmin
    }));
  }, []);

  // Validate current route
  useEffect(() => {
    if (pathname) {
      const validation = validateRoute(pathname, routeState.isAuthenticated, routeState.isAdmin);
      const debugInfo = debugRoute(pathname, routeState.isAuthenticated, routeState.isAdmin);
      
      setRouteState(prev => ({
        ...prev,
        currentPath: pathname,
        isValid: validation.valid,
        redirectTo: validation.redirect,
        debugInfo
      }));
      
      // Auto redirect if route is invalid
      if (!validation.valid && validation.redirect) {
        console.log(`Route validation failed for ${pathname}, redirecting to ${validation.redirect}`);
        router.push(validation.redirect);
      }
    }
  }, [pathname, routeState.isAuthenticated, routeState.isAdmin, router]);

  // Get navigation items
  const getNavItems = () => {
    return getNavigationItems(routeState.isAuthenticated, routeState.isAdmin);
  };

  // Debug current route
  const debugCurrentRoute = () => {
    console.log('Current Route Debug Info:', routeState.debugInfo);
    return routeState.debugInfo;
  };

  // Navigate with validation
  const navigateTo = (path: string) => {
    const validation = validateRoute(path, routeState.isAuthenticated, routeState.isAdmin);
    
    if (validation.valid) {
      router.push(path);
    } else {
      console.warn(`Navigation blocked to ${path}:`, validation);
      if (validation.redirect) {
        router.push(validation.redirect);
      }
    }
  };

  return {
    ...routeState,
    getNavItems,
    debugCurrentRoute,
    navigateTo
  };
};

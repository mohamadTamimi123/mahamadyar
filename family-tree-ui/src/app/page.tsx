'use client';

import React from 'react';
import IndexPage from './index/page';

export default function Home() {
  // نمایش مستقیم محتوای صفحه index به جای redirect
  return <IndexPage />;
}
'use client'
import {NextUIProvider} from '@heroui/react'
import React from 'react'
export default function Providers({children}:{children:React.ReactNode}){
  return <NextUIProvider>{children}</NextUIProvider>
}

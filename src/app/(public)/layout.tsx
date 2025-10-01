import PublicNavigation from '@/components/navigation/public-navigation'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Exquisite Photography",
  description: "Showcasing the finest photography services",
};


const layout = ({children}:{children: React.ReactNode}) => {
  return (
    <>
    <PublicNavigation />
    {children}</>
  )
}

export default layout
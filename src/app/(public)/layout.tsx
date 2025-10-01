import PublicNavigation from '@/components/navigation/public-navigation'
import React from 'react'



const layout = ({children}:{children: React.ReactNode}) => {
  return (
    <>
    <PublicNavigation />
    {children}</>
  )
}

export default layout
import Link from 'next/link'
import React from 'react'
import MobileSheet from './mobile-sheet'
import PortfolioLinks from './portfolio-links'

const PublicNavigation = () => {
  return (
    <nav className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16'>
           <Link href="/" className='flex items-center'>
              <span className='font-bold text-xl text-gray-900'>Exquisite Photography</span>
           </Link>
           
           {/* Desktop Navigation */}
           <div className='hidden md:flex items-center space-x-8'>
              <Link href="/" className='text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200'>
                Home
              </Link>
                <PortfolioLinks />
              <Link href="/about" className='text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200'>
                About
              </Link>
           
              <Link href="/orders" className='text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200'>
                Orders
              </Link>
              <Link href="/contact" className='text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200'>
                Contact Us
              </Link>
           </div>

           {/* Mobile Navigation */}
           <MobileSheet />
        </div>
    </nav>
  )
}

export default PublicNavigation
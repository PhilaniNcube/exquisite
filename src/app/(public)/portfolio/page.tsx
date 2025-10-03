import { getCategories } from '@/lib/queries/categories';
import { Metadata } from 'next';
import React from 'react'
import PortfolioGrid from '@/components/portfolio/protfolio-grid';

export const metadata: Metadata = {
  title: "Portfolio | Exquisite Photography",
  description: "Showcasing the finest photography services",
};

const PortfolioPage = async () => {

  const {docs:categories} = await getCategories();

  return (
    <div className="min-h-screen">
      <div className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Portfolio
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our diverse collection of photography services, each crafted with passion and expertise.
            </p>
          </div>
        </div>
      </div>
      
      <PortfolioGrid categories={categories} />
    </div>
  )
}

export default PortfolioPage
import { CreateProductForm } from '@/components/dashboard/products/create-product-form'
import React from 'react'

const AddNewProduct = async () => {
  return (
    <div className='max-w-3xl'>
        <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
        <CreateProductForm />
    </div>
  )
}

export default AddNewProduct
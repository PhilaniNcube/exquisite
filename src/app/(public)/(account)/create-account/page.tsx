import React from 'react'
import { CreateCustomerForm } from './components/create-customer-form'

const page = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-muted-foreground">Sign up for a new account</p>
      </div>
      <CreateCustomerForm />
    </div>
  )
}

export default page
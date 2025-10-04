import React from 'react'
import { CustomerLoginForm } from './components/customer-login-form'

const LoginPage = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-muted-foreground">Sign in to your account</p>
      </div>
      <CustomerLoginForm />
    </div>
  )
}

export default LoginPage
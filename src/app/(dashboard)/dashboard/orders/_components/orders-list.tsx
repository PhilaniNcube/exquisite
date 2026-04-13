import React from 'react'
import { isAdminUser } from '@/lib/auth'
import { getOrders } from '@/lib/queries/orders'
import { OrdersTable } from './orders-table'

interface OrdersListProps {
  searchParams: Promise<{ page?: string }>
}

const OrdersList = async ({ searchParams }: OrdersListProps) => {
  const params = await searchParams
  const page = params.page ? parseInt(params.page) : 1
  const canDeleteOrders = await isAdminUser()
  const ordersData = await getOrders(page)
  
  return (
    <>
      <OrdersTable 
        orders={ordersData.docs} 
        totalPages={ordersData.totalPages} 
        canDeleteOrders={canDeleteOrders}
      />
    </>
  )
}

export default OrdersList

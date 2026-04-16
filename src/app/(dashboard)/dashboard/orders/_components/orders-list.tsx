import React from 'react'
import { isAdminUser } from '@/lib/auth'
import { getOrders } from '@/lib/queries/orders'
import { getSchools } from '@/lib/queries/schools'
import { getClasses } from '@/lib/queries/classes'
import { OrdersTable } from './orders-table'

interface OrdersListProps {
  searchParams: Promise<{ page?: string }>
}

const OrdersList = async ({ searchParams }: OrdersListProps) => {
  const params = await searchParams
  const page = params.page ? parseInt(params.page) : 1
  const [canDeleteOrders, ordersData, schoolsData, classesData] = await Promise.all([
    isAdminUser(),
    getOrders(page),
    getSchools({ limit: 200 }),
    getClasses({ limit: 500 }),
  ])
  
  return (
    <>
      <OrdersTable 
        orders={ordersData.docs} 
        totalPages={ordersData.totalPages} 
        canDeleteOrders={canDeleteOrders}
        schools={schoolsData.docs}
        classes={classesData.docs}
      />
    </>
  )
}

export default OrdersList

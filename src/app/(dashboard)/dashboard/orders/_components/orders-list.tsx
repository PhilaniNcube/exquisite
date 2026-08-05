import React from 'react'
import { isAdminUser } from '@/lib/auth'
import { getOrders } from '@/lib/queries/orders'
import { getSchools } from '@/lib/queries/schools'
import { getClasses } from '@/lib/queries/classes'
import { OrdersTable } from './orders-table'

interface OrdersListProps {
  searchParams: Promise<{ page?: string; school?: string; class?: string; paidOnly?: string; fromDate?: string; toDate?: string }>
}

const OrdersList = async ({ searchParams }: OrdersListProps) => {
  const params = await searchParams
  const page = params.page ? parseInt(params.page) : 1
  const schoolId = params.school
  const classId = params.class
  const paidOnly = params.paidOnly === "true"
  const fromDate = params.fromDate
  const toDate = params.toDate
  const [canDeleteOrders, ordersData, schoolsData, classesData] = await Promise.all([
    isAdminUser(),
    getOrders(page, 10, schoolId, classId, paidOnly, fromDate, toDate),
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

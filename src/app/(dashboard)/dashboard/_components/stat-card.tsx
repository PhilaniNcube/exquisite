import type { ReactNode } from 'react'
import Link from 'next/link'
import { Route } from 'next'
import { ShoppingCart, type LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  getCollectionCount,
  getOrdersRevenue,
  type StatCollection,
} from '@/lib/queries/stats'

const currency = new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' })

interface StatCardProps {
  title: string
  value: ReactNode
  description: string
  icon: LucideIcon
  href: Route
}

export function StatCard({ title, value, description, icon: Icon, href }: StatCardProps) {
  return (
    <Link href={href} className="transition-transform hover:scale-[1.02]">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

export function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="size-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-2 h-3 w-40" />
      </CardContent>
    </Card>
  )
}

export async function OrdersValueCard() {
  const { paidRevenue, pendingRevenue } = await getOrdersRevenue()

  return (
    <StatCard
      title="Orders Value"
      value={`${currency.format(paidRevenue)} paid`}
      description={`${currency.format(pendingRevenue)} pending/cancelled`}
      icon={ShoppingCart}
      href="/dashboard/orders"
    />
  )
}

interface CollectionCountCardProps {
  title: string
  collection: StatCollection
  description: string
  icon: LucideIcon
  href: Route
}

export async function CollectionCountCard({
  title,
  collection,
  description,
  icon,
  href,
}: CollectionCountCardProps) {
  const count = await getCollectionCount(collection)

  return (
    <StatCard
      title={title}
      value={count}
      description={description}
      icon={icon}
      href={href}
    />
  )
}

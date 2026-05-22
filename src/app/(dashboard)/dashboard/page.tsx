import React from 'react'
import Link from 'next/link'
import { getDashboardStats } from '@/lib/queries/stats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ShoppingCart, Package, School, Image as ImageIcon, UserCheck, Camera, Images } from 'lucide-react'
import { Route } from 'next'

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  const statCards = [
    {
      title: 'Orders Value',
      value: `${new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(stats.paidRevenue)} paid`,
      icon: ShoppingCart,
      description: `${new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(stats.pendingRevenue)} pending/cancelled`,
      href: '/dashboard/orders' as Route,
    },
    {
      title: 'Products',
      value: stats.products,
      icon: Package,
      description: 'Active products',
      href: '/dashboard/products' as Route,
    },
    {
      title: 'Customers',
      value: stats.customers,
      icon: Users,
      description: 'Registered customers',
      href: '/dashboard/customers' as Route,
    },
    {
      title: 'Schools',
      value: stats.schools,
      icon: School,
      description: 'Partner schools',
      href: '/dashboard/schools' as Route,
    },
    {
      title: 'School Photos',
      value: stats.schoolPhotos,
      icon: Camera,
      description: 'School photos uploaded',
      href: '/dashboard/school-photos' as Route,
    },
    {
      title: 'Client Galleries',
      value: stats.clientGalleries,
      icon: Images,
      description: 'Client photo galleries',
      href: '/dashboard/client-galleries' as Route,
    },
    {
      title: 'Photos',
      value: stats.photos,
      icon: ImageIcon,
      description: 'Total photos uploaded',
      href: '/dashboard/photos' as Route,
    },
    {
      title: 'System Users',
      value: stats.users,
      icon: UserCheck,
      description: 'System users',
      href: '/dashboard/users' as Route,
    },
  ]

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href} className="transition-transform hover:scale-[1.02]">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

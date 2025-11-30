import React from 'react'
import { getDashboardStats } from '@/lib/queries/stats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ShoppingCart, Package, School, Image as ImageIcon, UserCheck, Camera, Images } from 'lucide-react'

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  const statCards = [
    {
      title: 'Total Orders',
      value: `${stats.orders} - ${new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(stats.revenue)}`,
      icon: ShoppingCart,
      description: 'All time orders & revenue',
    },
    {
      title: 'Products',
      value: stats.products,
      icon: Package,
      description: 'Active products',
    },
    {
      title: 'Customers',
      value: stats.customers,
      icon: Users,
      description: 'Registered customers',
    },
    {
      title: 'Schools',
      value: stats.schools,
      icon: School,
      description: 'Partner schools',
    },
    {
      title: 'School Photos',
      value: stats.schoolPhotos,
      icon: Camera,
      description: 'School photos uploaded',
    },
    {
      title: 'Client Galleries',
      value: stats.clientGalleries,
      icon: Images,
      description: 'Client photo galleries',
    },
    {
      title: 'Photos',
      value: stats.photos,
      icon: ImageIcon,
      description: 'Total photos uploaded',
    },
    {
      title: 'System Users',
      value: stats.users,
      icon: UserCheck,
      description: 'System users',
    },
  ]

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title}>
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
        ))}
      </div>
    </div>
  )
}

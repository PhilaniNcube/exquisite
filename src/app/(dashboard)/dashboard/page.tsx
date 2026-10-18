import React, { Suspense } from 'react'
import { Users, Package, School, Image as ImageIcon, UserCheck, Camera, Images } from 'lucide-react'
import {
  CollectionCountCard,
  OrdersValueCard,
  StatCardSkeleton,
} from './_components/stat-card'

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<StatCardSkeleton />}>
          <OrdersValueCard />
        </Suspense>
        <Suspense fallback={<StatCardSkeleton />}>
          <CollectionCountCard
            title="Products"
            collection="products"
            description="Active products"
            icon={Package}
            href="/dashboard/products"
          />
        </Suspense>
        <Suspense fallback={<StatCardSkeleton />}>
          <CollectionCountCard
            title="Customers"
            collection="customers"
            description="Registered customers"
            icon={Users}
            href="/dashboard/customers"
          />
        </Suspense>
        <Suspense fallback={<StatCardSkeleton />}>
          <CollectionCountCard
            title="Schools"
            collection="schools"
            description="Partner schools"
            icon={School}
            href="/dashboard/schools"
          />
        </Suspense>
        <Suspense fallback={<StatCardSkeleton />}>
          <CollectionCountCard
            title="School Photos"
            collection="schoolPhotos"
            description="School photos uploaded"
            icon={Camera}
            href="/dashboard/school-photos"
          />
        </Suspense>
        <Suspense fallback={<StatCardSkeleton />}>
          <CollectionCountCard
            title="Client Galleries"
            collection="client-galleries"
            description="Client photo galleries"
            icon={Images}
            href="/dashboard/client-galleries"
          />
        </Suspense>
        <Suspense fallback={<StatCardSkeleton />}>
          <CollectionCountCard
            title="Photos"
            collection="photos"
            description="Total photos uploaded"
            icon={ImageIcon}
            href="/dashboard/photos"
          />
        </Suspense>
        <Suspense fallback={<StatCardSkeleton />}>
          <CollectionCountCard
            title="System Users"
            collection="users"
            description="System users"
            icon={UserCheck}
            href="/dashboard/users"
          />
        </Suspense>
      </div>
    </div>
  )
}

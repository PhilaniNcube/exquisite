import { CreateSchoolForm } from '@/components/dashboard/schools/create-school-form'

export default function AddSchoolPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold">Add New School</h1>
      <CreateSchoolForm />
    </div>
  )
}

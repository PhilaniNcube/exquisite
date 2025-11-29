import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getPayload } from "payload"
import config from "@payload-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateClassDialog } from "./create-class-dialog"
import { DeleteClassButton } from "./delete-class-button"

export default async function SchoolClasses({
  params,
}: {
  params: Promise<{ schoolId: string }>
}) {
  const { schoolId } = await params
  const id = parseInt(schoolId, 10)
  if (isNaN(id)) return null

  const payload = await getPayload({ config })
  
  const classes = await payload.find({
    collection: "classes",
    where: {
      school: {
        equals: id,
      },
    },
    limit: 100,
    sort: "name",
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Classes</CardTitle>
        <CreateClassDialog schoolId={id} />
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>ID</TableHead>
                <TableHead className="text-right">Created At</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.docs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No classes found for this school.
                  </TableCell>
                </TableRow>
              ) : (
                classes.docs.map((cls) => (
                  <TableRow key={cls.id}>
                    <TableCell className="font-medium">{cls.name}</TableCell>
                    <TableCell>{cls.id}</TableCell>
                    <TableCell className="text-right">
                      {new Date(cls.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DeleteClassButton classId={cls.id} schoolId={id} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

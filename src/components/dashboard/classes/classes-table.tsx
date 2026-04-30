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
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ClassesTable() {
  const payload = await getPayload({ config })
  const classes = await payload.find({
    collection: "classes",
    limit: 100,
    sort: "name",
    depth: 1,
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>School</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.docs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center h-24">
                No classes found.
              </TableCell>
            </TableRow>
          ) : (
            classes.docs.map((cls) => (
              <TableRow key={cls.id}>
                <TableCell className="font-medium">{cls.name}</TableCell>
                <TableCell>
                  {cls.school && typeof cls.school === "object" && 'name' in cls.school ? cls.school.name : String(cls.school || '')}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/dashboard/classes/${cls.id}`} prefetch={false}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

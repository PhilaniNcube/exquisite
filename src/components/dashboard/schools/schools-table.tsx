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
import { Route } from "next"

export default async function SchoolsTable() {
  const payload = await getPayload({ config })
  const schools = await payload.find({
    collection: "schools",
    limit: 100,
    sort: "name",
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Pass Code</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schools.docs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24">
                No schools found.
              </TableCell>
            </TableRow>
          ) : (
            schools.docs.map((school) => (
              <TableRow key={school.id}>
                <TableCell className="font-medium">{school.name}</TableCell>
                <TableCell className="capitalize">{school.type}</TableCell>
                <TableCell>{school.pass_code || "-"}</TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/dashboard/schools/${school.id}` as Route}>View</Link>
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

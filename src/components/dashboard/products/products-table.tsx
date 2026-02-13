import { getProducts } from "@/lib/queries/products";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Route } from "next";
import { formatPrice } from "@/lib/utils";

export default async function ProductsTable({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page as string) : 1;
  const { docs: products } = await getProducts({ page });

  return (
    <div className="rounded-md border max-w-4xl">
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead className="w-25">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {typeof product.image !== "number" && product.image.url && (
                  <div className="relative h-10 w-10 overflow-hidden rounded-md">
                    <Image
                      src={product.image.url.replace(/^https?:\/\/[^\/]+/, '')}
                      alt={product.image.alt || product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{product.title}</TableCell>
              <TableCell>{formatPrice(product.price)}</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/dashboard/products/${product.id}` as Route}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

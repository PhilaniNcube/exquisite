import { getCategoryById } from "@/lib/queries/categories";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const CategoryDetails = async ({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) => {

  const { categoryId } = await params;
  const categoryIdNum = parseInt(categoryId, 10);
  const category = await getCategoryById(categoryIdNum);

  if (!category) {
    return (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <h2 className="text-2xl font-bold">Category not found</h2>
            <Button asChild>
                <Link href="/dashboard/categories">Back to Categories</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="space-y-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/categories">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Category Details</h1>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
            </Button>
             <Button variant="destructive" size="sm">
                <Trash className="mr-2 h-4 w-4" />
                Delete
            </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{category.name}</CardTitle>
          <CardDescription>ID: {category.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">Slug</h3>
                    <p className="text-sm font-medium">{category.slug}</p>
                </div>
                 <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
                    <p className="text-sm font-medium">{new Date(category.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
            
            <Separator />

            <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="text-sm leading-relaxed">
                    {category.description || "No description provided."}
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryDetails;

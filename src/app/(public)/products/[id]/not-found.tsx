import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="font-serif text-4xl md:text-5xl text-foreground">
          Product Not Found
        </h1>
        <p className="text-lg text-muted-foreground">
          The product you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link href="/products">
          <Button size="lg">Return to Products</Button>
        </Link>
      </div>
    </div>
  );
}

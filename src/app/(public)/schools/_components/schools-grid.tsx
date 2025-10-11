import { School } from "@/payload-types";
import React from "react";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const SchoolsGrid = ({ schools }: { schools: School[] }) => {
  if (schools.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">No schools found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 container mx-auto px-4 py-8">
      {schools.map((school) => (
        <Link key={school.id} href={`/schools/${school.id}`}>
          <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardContent>
              <CardTitle className="text-center uppercase">
                {school.name}
              </CardTitle>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default SchoolsGrid;

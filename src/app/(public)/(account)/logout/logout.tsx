import { Button } from "@/components/ui/button";
import React from "react";
import { logoutAction } from "./logoutAction";
import { UserX2 } from "lucide-react";

const Logout = () => {
  return (
    <form action={logoutAction}>
      <Button variant="outline">
            <UserX2 className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
    </form>
  );
};

export default Logout;

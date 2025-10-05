import { getUser } from "@/lib/auth";
import Link from "next/link";
import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";
import Logout from "@/app/(public)/(account)/logout/logout";

const AuthLinks = async () => {
  const user = await getUser();

  console.log("User in AuthLinks:", user);

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <Logout />
      </div>
    );
  } else {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/login"
          className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          <Button variant="outline">
            <UserPlus className="mr-2 h-4 w-4" />
            Login
          </Button>
        </Link>
      </div>
    );
  }

  return null;
};

export default AuthLinks;

import { getUser } from "@/lib/auth";
import Link from "next/link";
import { Button } from "../ui/button";
import { User, UserPlus } from "lucide-react";
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
      <div className="flex flex-col md:flex-row px-4 md:items-center space-x-4 space-y-2 md:space-y-0 md:mt-0">
        <Link
          href="/login"
          className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          <Button className="w-full " variant="outline">
            <User className="mr-2 h-4 w-4" />
            Login
          </Button>
        </Link>
        <Link
          href="/create-account"
          className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          <Button variant="outline" className="w-full ">
            <UserPlus className="mr-2 h-4 w-4" />
            Sign Up
          </Button>
        </Link>
      </div>
    );
  }

  return null;
};

export default AuthLinks;

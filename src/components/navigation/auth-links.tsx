import { getAuthState } from "@/lib/auth-state";
import { getUser } from "@/lib/auth";
import Link from "next/link";
import { Button } from "../ui/button";
import { User, UserPlus, ReceiptText } from "lucide-react";
import Logout from "@/app/(public)/(account)/logout/logout";

const AuthLinks = async () => {
  const [{ isLoggedIn }, user] = await Promise.all([
    getAuthState(),
    getUser(),
  ]);

  if (isLoggedIn) {
    const displayName = user?.firstName || user?.email?.split("@")[0] || "Parent";

    return (
      <div className="flex flex-col md:flex-row px-4 md:px-0 md:items-center gap-2 sm:gap-3">
        <Link href="/orders" className="w-full md:w-auto">
          <Button variant="outline" size="sm" className="w-full gap-2 font-medium">
            <ReceiptText className="h-4 w-4 text-primary" />
            My Orders
          </Button>
        </Link>
        <div className="hidden xl:flex items-center text-xs text-muted-foreground font-medium px-1">
          {displayName}
        </div>
        <Logout />
      </div>
    );
  } else {
    return (
      <div className="flex flex-col md:flex-row px-4 md:px-0 md:items-center gap-2 sm:gap-3">
        <Link
          href="/login"
          className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors w-full md:w-auto"
        >
          <Button className="w-full gap-2" variant="outline" size="sm">
            <User className="h-4 w-4" />
            Sign In
          </Button>
        </Link>
        <Link
          href="/create-account"
          className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors w-full md:w-auto"
        >
          <Button variant="outline" className="w-full gap-2" size="sm">
            <UserPlus className="h-4 w-4" />
            Sign Up
          </Button>
        </Link>
      </div>
    );
  }
};

export default AuthLinks;

import { getUsers } from "@/lib/queries/users";
import { UsersTable } from "./users-table";

const UsersList = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  // get the page and limit from searchParams if they are present
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  const limit = params.limit ? Number(params.limit) : 20;

  const usersData = await getUsers({ page, limit });

  return <UsersTable data={usersData.docs} />;
};

export default UsersList;

import { getCustomers } from "@/lib/queries/customers";
import { CustomersTable } from "./customers-table";

const CustomersList = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {

    // get the page and limit from searchParams if they are present
    const params = await searchParams;
    const page = params.page ? Number(params.page) : 1;
    const limit = params.limit ? Number(params.limit) : 20;

  const customersData = await getCustomers({ page, limit });

  return (
    <CustomersTable data={customersData.docs} />
  );
};

export default CustomersList;

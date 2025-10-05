import React from "react";
import { CreateCustomerForm } from "./components/create-customer-form";

const page = () => {
  return (
    <div className="bg-slate-800 mx-auto flex flex-col justify-center py-8 min-h-screen px-4 sm:px-6 lg:px-8">
      <CreateCustomerForm />
    </div>
  );
};

export default page;

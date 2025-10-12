import { School } from "@/payload-types";


interface SchoolHeaderProps {
  school: School;
}

const SchoolHeader = ({ school }: SchoolHeaderProps) => {
  return (
    <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {school.name}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default SchoolHeader;

import { cacheLife } from "next/cache";


const PrivacyPolicy = async () => {
  "use cache";
  cacheLife("hours");
  return (
    <div className="min-h-screen flex justify-center items-center">PrivacyPolicy</div>
  )
}

export default PrivacyPolicy
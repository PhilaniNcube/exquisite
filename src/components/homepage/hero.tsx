import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <section className="relative max-h-[80vh] h-[80vh] w-full overflow-hidden">
      <Image
        src={`/api/media/file/IMG_0874.JPG`}
        alt="Hero Image"
        fill
        priority
        quality={80}
        className="w-full object-top object-cover"
      />
      <div className="relative h-full flex flex-col bg-slate-600/30 items-center justify-center z-10 p-8 text-center text-white">
        <h1 className="text-4xl font-bold">Photography</h1>
        <p className="mt-4 text-sm md:text-md lg:text-lg">
            Weddings | Matric Farewells | School | Creches | Family &amp; Couples | Portraits
        </p>
      </div>
    </section>
  );
};

export default Hero;

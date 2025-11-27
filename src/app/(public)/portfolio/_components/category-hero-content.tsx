"use cache";
import CategoryHero from "@/components/portfolio/category-hero";
import { getCategoryBySlug } from "@/lib/queries/categories";

const CategoryHeroContent = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {

  const { slug } = await params;
  const { docs } = await getCategoryBySlug(slug);
  const category = docs?.[0];
  if (!category) return null;
  return <CategoryHero category={category} />;
};

export default CategoryHeroContent;

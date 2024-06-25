import Product from "@/models/products";

export async function categoryCounts({
  categories,
  ProductsCount,
}: {
  categories: string[];
  ProductsCount: number;
}) {
  const categoriesCountPromise = categories.map((category) =>
    Product.countDocuments({ category })
  );

  const categoriesCount = await Promise.all(categoriesCountPromise);

  const categoryCount: Record<string, number>[] = [];

  categories.forEach((category, i) => {
    categoryCount.push({
      [category]: Math.round((categoriesCount[i] / ProductsCount) * 100),
    });
  });
  return categoryCount;
}

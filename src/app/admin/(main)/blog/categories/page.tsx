import { getCategories } from "./_actions/category-actions";
import { CategoriesTable } from "./categories-table";

export default async function BlogCategoriesPage() {
  const categories = await getCategories();

  return <CategoriesTable initialData={categories} />;
}

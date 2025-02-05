import React, { useEffect, useCallback } from "react";
import { useCategory } from "../../hooks";
import { ListCategories } from "../../components/Client";

export function Categories() {
  const { loading, categories, getCategories } = useCategory();

  const fetchCategories = useCallback(() => {
    getCategories();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div>
      <h3>Categorias</h3>
      {loading ? <p>Cargando</p> : <ListCategories categories={categories} />}
    </div>
  );
}

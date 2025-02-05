import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useProduct } from "../../hooks";
import { ListProducts } from "../../components/Client";

export function Products() {
  const { tableNumber, idCategory } = useParams();
  const { loading, products, getProductsByCategory } = useProduct();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await getProductsByCategory(idCategory);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchProducts();
  }, [idCategory]);

  return (
    <div>
      <Link to={`/client/${tableNumber}`}>Volver a categorías</Link>

      {loading ? <p>Cargando...</p> : <ListProducts products={products} />}
    </div>
  );
}

import React from "react";
import { Image, Button, Icon } from "semantic-ui-react";
import { map } from "lodash";
import { useParams, useNavigate } from "react-router-dom";
import { useOrder, useTable } from "../../../hooks";
import { removeProductCartApi, cleanProductCartApi } from "../../../api/cart";
import "./ListProductCart.scss";

export function ListProductCart(props) {
  const { products, onReloadCart } = props;
  const { addOrderToTable } = useOrder();
  const { getTableByNumber } = useTable();
  const { tableNumber } = useParams();
  const navigate = useNavigate(); // ✅ Reemplazamos useHistory()

  // ✅ Eliminamos useEffect y calculamos el total directamente
  const total = products
    .reduce((acc, product) => acc + Number(product.price), 0)
    .toFixed(2);

  const removeProduct = (index) => {
    removeProductCartApi(index);
    onReloadCart();
  };

  const createOrder = async () => {
    try {
      const tableData = await getTableByNumber(tableNumber);
      if (!tableData || tableData.length === 0) {
        console.error("No se encontró la mesa");
        return;
      }

      const idTable = tableData[0].id;

      for (const product of products) {
        await addOrderToTable(idTable, product.id);
      }

      cleanProductCartApi();
      navigate(`/client/${tableNumber}/orders`); // ✅ Corrección
    } catch (error) {
      console.error("Error al crear el pedido:", error);
    }
  };

  return (
    <div className="list-product-cart">
      {map(products, (product, index) => (
        <div key={index} className="list-product-cart__product">
          <div>
            <Image src={product.image} avatar />
            <span>{product.title}</span>
          </div>
          <span>{product.price} $</span>
          <Icon name="close" onClick={() => removeProduct(index)} />
        </div>
      ))}

      <Button primary fluid onClick={createOrder}>
        Realizar pedido ({total} $)
      </Button>
    </div>
  );
}

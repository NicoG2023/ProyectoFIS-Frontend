import React, { useState, useEffect } from "react";
import { Button } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { map, size } from "lodash";
import { OrderHistoryItem } from "../../components/Client";
import { ModalConfirm } from "../../components/Common";
import { useOrder, useTable, usePayment } from "../../hooks";

export function OrdersHistory() {
  const [idTable, setIdTable] = useState(null);
  const [showTypePayment, setShowTypePayment] = useState(false);
  const [isRequestAccount, setIsRequestAccount] = useState(false);
  const { loading, orders, getOrdersByTable, addPaymentToOrder } = useOrder();
  const { getTableByNumber } = useTable();
  const { tableNumber } = useParams();
  const { createPayment, getPaymentByTable } = usePayment();

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const table = await getTableByNumber(tableNumber);
        if (table && table.length > 0) {
          const idTableTemp = table[0].id;
          setIdTable(idTableTemp);
          getOrdersByTable(idTableTemp, "", "ordering=-status,-created_at");
        }
      } catch (error) {
        console.error("Error al obtener la mesa:", error);
      }
    };

    fetchTableData();
  }, [tableNumber]);

  useEffect(() => {
    if (!idTable) return;

    const fetchPaymentData = async () => {
      try {
        const response = await getPaymentByTable(idTable);
        setIsRequestAccount(response);
      } catch (error) {
        console.error("Error al obtener el pago:", error);
      }
    };

    fetchPaymentData();
  }, [idTable]); // ✅ Dependencia correcta

  const onCreatePayment = async (paymentType) => {
    setShowTypePayment(false);

    try {
      let totalPayment = orders.reduce(
        (sum, order) => sum + Number(order.product_data.price),
        0
      );

      const paymentData = {
        table: idTable,
        totalPayment: totalPayment.toFixed(2),
        paymentType,
        statusPayment: "PENDING",
      };

      const payment = await createPayment(paymentData);
      for (const order of orders) {
        await addPaymentToOrder(order.id, payment.id);
      }

      window.location.reload();
    } catch (error) {
      console.error("Error al crear el pago:", error);
    }
  };

  return (
    <div>
      <h1>Historial de pedidos</h1>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          {size(orders) > 0 && (
            <Button
              primary
              fluid
              onClick={() =>
                size(isRequestAccount) === 0 && setShowTypePayment(true)
              }
            >
              {size(isRequestAccount) > 0
                ? "La cuenta ya está pedida"
                : "Pedir la cuenta"}
            </Button>
          )}

          {map(orders, (order) => (
            <OrderHistoryItem key={order.id} order={order} />
          ))}
        </>
      )}

      <ModalConfirm
        title="Pagar con tarjeta o efectivo"
        show={showTypePayment}
        onCloseText="Efectivo"
        onClose={() => onCreatePayment("CASH")}
        onConfirmText="Tarjeta"
        onConfirm={() => onCreatePayment("CARD")}
      />
    </div>
  );
}

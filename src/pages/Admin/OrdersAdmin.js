import React, { useEffect, useCallback } from "react";
import { Loader } from "semantic-ui-react";
import { HeaderPage, TablesListAdmin } from "../../components/Admin";
import { useTable } from "../../hooks";

export function OrdersAdmin() {
  const { loading, tables, getTables } = useTable();

  const fetchOrders = useCallback(() => {
    getTables();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <>
      <HeaderPage title="Restaurante" />
      {loading ? (
        <Loader active inline="centered">
          Cargando...
        </Loader>
      ) : (
        <TablesListAdmin tables={tables} />
      )}
    </>
  );
}

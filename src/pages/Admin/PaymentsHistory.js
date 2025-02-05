import React, { useEffect, useCallback } from "react";
import { Loader } from "semantic-ui-react";
import { HeaderPage, TablePayments } from "../../components/Admin";
import { usePayment } from "../../hooks";

export function PaymentsHistory() {
  const { loading, payments, getPayments } = usePayment();

  const fetchPayments = useCallback(() => {
    getPayments();
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return (
    <>
      <HeaderPage title="Historial de pagos" />
      {loading ? (
        <Loader active inline="centered">
          Cargando...
        </Loader>
      ) : (
        <TablePayments payments={payments} />
      )}
    </>
  );
}

import React, { useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Toolbar } from 'primereact/toolbar';
import { useDispatch, useSelector } from 'react-redux';
import { getInventoryMovement } from '../../slices/thunk';
import Loader from '../../common/Loader';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import dayjs from 'dayjs';

const InventoryMovement = () => {
  const dispatch: any = useDispatch();
  const inventoryMovements = useSelector(
    (state: any) => state.Inventories.inventoryMovement,
  );

  const loading = useSelector((state: any) => state.Inventories.loading);


  useEffect(() => {
    dispatch(getInventoryMovement());
  }, []);
  return (
    <React.Fragment>
      <Breadcrumb pageName="Movimientos del inventario" />
      <Toolbar className="mb-4" center={() => <div>Movimientos</div>} />

      {loading ? (
        <Loader />
      ) : (
        <DataTable
          emptyMessage="No hay registros disponibles"
          className="text-sm"
          size="normal"
          value={inventoryMovements}
          rows={10}
          paginator
          rowsPerPageOptions={[5, 10, 25, 50]}
        >
          <Column
            className=""
            field="createdAt"
            header="Fecha"
            body={(rowData) =>
              dayjs(rowData.createdAt).format('DD/MM/YYYY HH:mm')
            }
          />
          <Column field="product.name" header="Producto" />
          <Column field="note" header="Razón" />
          <Column field="quantity" header="Cantidad" />
          <Column
            field="type"
            body={(rowData) => {
              const typeMap: any = {
                entry: 'Entrada',
                exit: 'Salida',
                adjustment: 'Ajuste',
              };
              return <div>{typeMap[rowData.type] || rowData.type}</div>;
            }}
            header="Tipo"
          />
        </DataTable>
      )}
    </React.Fragment>
  );
};

export default InventoryMovement;

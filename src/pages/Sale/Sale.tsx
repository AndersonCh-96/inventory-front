import React, { useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailSale, getSales } from '../../slices/thunk';
import Loader from '../../common/Loader';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { number } from 'yup';

const Sale = () => {
  const navigate: any = useNavigate();
  const dispatch: any = useDispatch();
  const [saleDetailModal, setSaleDetailModal] = useState(false);
  const dt = useRef<DataTable<any[]>>(null);
  const sales = useSelector((state: any) => state.Sales.salesList);
  const loading = useSelector((state: any) => state.Sales.loading);
  const detailSale = useSelector((state: any) => state.Sales.detailSale);

  useEffect(() => {
    dispatch(getSales());
  }, []);

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          className="px-4 py-3 bg-blue-800 text-white"
          label="Agregar venta"
          icon="pi pi-plus"
          severity="success"
          onClick={() => navigate('/sales/create')}
        />
      </div>
    );
  };

  const openModalDetail = (sale: any) => {
    setSaleDetailModal(true);
    const { id } = sale;
    if (id) {
      dispatch(getDetailSale(id));
    }
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-eye"
          className=""
          onClick={() => openModalDetail(rowData)}
        />
        {/* <Button
          className="text-red"
          icon="pi pi-trash"
          severity="danger"
          onClick={() => {}}
        /> */}
      </React.Fragment>
    );
  };

  const totalAmount = detailSale.payments?.reduce(
    (acc: number, item: any) => acc + Number(item.amount),
    0,
  );
  return (
    <React.Fragment>
      <Breadcrumb pageName="Ventas" />
      <Toolbar className="mb-4" end={leftToolbarTemplate} />

      {loading ? (
        <Loader />
      ) : (
        <>
          <DataTable ref={dt} value={sales} paginator rows={10}>
            <Column
              field="date"
              header="Fecha"
              sortable
              style={{ minWidth: '7rem' }}
            ></Column>
            <Column
              field="notes"
              header="Nota"
              style={{ minWidth: '12rem' }}
            ></Column>

            <Column
              field="subtotal"
              header="Subtotal"
              body={(rowData) => `$${rowData.subtotal}`}
              sortable
              style={{ minWidth: '5rem' }}
            ></Column>

            <Column
              field="tax"
              header="Impuesto"
              sortable
              style={{ minWidth: '5rem' }}
            ></Column>

            <Column
              field="total"
              header="Total"
              body={(rowData) => `$${rowData.total}`}
              sortable
              style={{ minWidth: '5rem' }}
            ></Column>

            <Column
              header="Acciones"
              body={actionBodyTemplate}
              exportable={false}
              style={{ minWidth: '12rem' }}
            ></Column>
          </DataTable>
        </>
      )}

      <Dialog
        visible={saleDetailModal}
        headerClassName="bg-black text-white text-center"
        style={{ width: '55vw' }}
        header="Detalle de venta"
        modal
        onHide={() => setSaleDetailModal(false)}
      >
        <div className="flex flex-col mt-2">
          <div>
            <strong>Fecha: </strong>
            {detailSale.date}
          </div>
          <div className=" flex flex-col ">
            <div className="bg-black text-white px-2 font-bold">
              <label> Datos del cliente</label>
            </div>
            <div className="flex gap-2 text-sm">
              <strong>Nombre:</strong>
              {detailSale.customer?.name} {detailSale.customer?.lastName}
            </div>

            <div className="flex gap-2 text-sm">
              <strong>Email:</strong>
              {detailSale.customer?.email}
            </div>

            <div className="flex gap-2 text-sm">
              <strong>Telefono</strong>
              {detailSale.customer?.phone}
            </div>
          </div>

          {/* <div className="felx flex-col mt-2">
            {detailSale?.credits?.length > 0 ? (
              <div className="">
                <div className="bg-black text-white px-2  py-1 font-bold">
                  {' '}
                  <label>Crédito</label>
                </div>
                {detailSale?.credits.map((item: any, index: number) => {
                  return (
                    <div key={index} className="py-2">
                      <div className="text-sm">
                        <strong>Total: </strong>${item.totalAmount}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              ''
            )}
          </div> */}

          {/* <div>
            <div className="">
              <div className="bg-black text-white px-2 font-bold py-1">
                <label> Pago al contado</label>
              </div>

              <div className="mt-4 text-sm font-bold">
                Total: ${totalAmount?.toFixed(2)}
              </div> */}

          {/* {detailSale.payments?.map((item: any, index: number) => {
                return (
                  <div key={index} className="py-2">
                    <div className="text-sm">
                      <strong>Total: </strong>${item?.amount}
                    </div>
                  </div>
                );
              })} */}
          {/* </div>
          </div> */}
          <div>
            <div className="bg-black px-2 text-white font-bold text-center">
              <label htmlFor="">Productos</label>
            </div>

            <DataTable size="small" value={detailSale?.saleDetails}>
              <Column field="product.name" header="Producto"></Column>
              <Column
                header="Imagen"
                body={(rowData: any) => (
                  <img
                    className="w-10 h-10"
                    src={
                      rowData.product?.image
                        ? rowData.product?.image
                        : 'img/no-image.png'
                    }
                  ></img>
                )}
              ></Column>
              <Column field="quantity" header="Cantidad"></Column>
              <Column
                body={(rowData) => `$${rowData?.unitCost.toFixed(2)}`}
                header="Precio unitario"
              ></Column>
              <Column
                field="subtotal"
                header="Total"
                body={(rowData) => `$${rowData?.subtotal.toFixed(2)}`}
              ></Column>
            </DataTable>
          </div>

          <div>
            <div className="bg-black text-white font-bold px-2">
              <label>Observacion</label>
            </div>
            <div className="border-2 p-2 break-words whitespace-pre-wrap overflow-hidden">
              {detailSale?.notes}
            </div>
          </div>

          <div className="mt-4 w-full flex justify-end">
            <div className="flex flex-col bg-black w-full p-2 text-white text-sm">
              <div className="flex flex-row justify-end gap-2">
                <span>${detailSale?.subtotal}</span>
                <strong>SUBTOTAL</strong>
              </div>
              <div className="flex flex-row justify-end gap-2">
                <span>%{detailSale?.tax}</span>
                <strong>IVA</strong>
              </div>
              <div className="flex flex-row justify-end gap-2">
                <span>${detailSale?.total}</span>
                <strong>TOTAL</strong>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default Sale;

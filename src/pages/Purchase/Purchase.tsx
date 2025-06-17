import React, { useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import { getPurchase, getPurchaseDetails } from '../../slices/thunk';
import Loader from '../../common/Loader';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaFile, FaFileExcel, FaFilePdf, FaSearch } from 'react-icons/fa';
import autoTable from 'jspdf-autotable';
import { InputText } from 'primereact/inputtext';

const Purchase = () => {
  const dispatch: any = useDispatch();

  const purchases = useSelector((state: any) => state.Purchases?.purchaseList);
  const loading = useSelector((state: any) => state.Purchases.loading);
  const purchaseDetail = useSelector(
    (state: any) => state.Purchases?.purchaseDetails,
  );

  const [globalFilter, setGlobalFilter] = useState('');
  const dt = useRef<DataTable<any[]>>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const navigate: any = useNavigate();

  useEffect(() => {
    dispatch(getPurchase());
  }, []);

  const openModalDetail = (data: any) => {
    setOpenModal(true);
    const { id } = data;
    if (id) {
      dispatch(getPurchaseDetails(id));
    }
  };

  const exportExcel = () => {
    const flatData = purchases.map((item: any) => ({
      ...item,
      provider: item.provider.name,
    }));
    const worksheet = XLSX.utils.json_to_sheet(flatData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Compras');
    XLSX.writeFile(workbook, 'compras.xlsx');
  };

  const exportPdf = () => {
    const doc = new jsPDF();
    const tableColumn = [
      'ID',
      'Fecha',
      'Proveedor',
      'Subtotal',
      'Impuesto',
      'Total',
    ];
    const tableRows = purchases.map((item: any) => [
      item.id,
      item.date,
      item.provider.name,
      item.subtotal,
      item.tax,
      item.total,
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });

    doc.save('compras.pdf');
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-eye"
          className=""
          onClick={() => openModalDetail(rowData)}
        />
        <Button
          className="text-red"
          icon="pi pi-trash"
          severity="danger"
          onClick={() => {}}
        />
      </React.Fragment>
    );
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          className="py-3 px-4 bg-blue-800 text-white"
          label="Agregar compra"
          icon="pi pi-plus"
          severity="success"
          onClick={() => navigate('/purchases/create')}
        />
      </div>
    );
  };

  return (
    <React.Fragment>
      <Breadcrumb pageName="Compras" />
      <Toolbar className="mb-4" end={leftToolbarTemplate} />

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="bg-white p-2 mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <span className="p-input-icon-left p-4 ">
                <div className="flex gap-1 justify-center items-center">
                  <InputText
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Buscar..."
                    className="p-3 border-2 w-96"
                  />
                </div>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportExcel}
                className="bg-green-800 rounded-full p-2"
              >
                <FaFileExcel color="white" size="25" />
              </button>
              <button
                onClick={exportPdf}
                className="bg-red-800 rounded-full p-2"
              >
                <FaFilePdf color="white" size="25" />
              </button>
            </div>
          </div>

          <DataTable
            size="normal"
            ref={dt}
            value={purchases}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            globalFilter={globalFilter}
            emptyMessage="No se encontraron resultados"
          >
            <Column
              field="date"
              header="Fecha"
              sortable
              style={{ minWidth: '6rem' }}
            ></Column>
            <Column
              field="provider.name"
              header="Proveedor"
              sortable
              style={{ minWidth: '8rem' }}
            ></Column>
            {/* 
          <Column
            field="notes"
            header="Notas"
            sortable
            style={{ minWidth: '12rem' }}
          ></Column> */}
            <Column
              field="subtotal"
              header="Subtotal"
              sortable
              body={(rowData) => `$${rowData.subtotal}`}
              style={{ minWidth: '6' }}
            ></Column>

            <Column
              field="tax"
              header="Impuesto"
              sortable
              style={{ minWidth: '6' }}
            ></Column>
            <Column
              field="total"
              header="Total"
              body={(rowData) => `$${rowData.total}`}
              sortable
              style={{ minWidth: '6rem' }}
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
        headerClassName="bg-black text-white text-center"
        visible={openModal}
        header="DETALLE DE COMPRA"
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        style={{ width: '45rem' }}
        modal
        className="bg-black"
        onHide={() => setOpenModal(false)}
      >
        <div className="mt-2">
          <strong>Fecha:</strong> <span>{purchaseDetail?.date}</span>
        </div>
        <div className="flex flex-col mb-4 mt-1 border-2 ">
          <div className="bg-black text-white font-bold px-2">
            <label htmlFor="">Datos del proveedor</label>
          </div>
          <div className="px-2">
            <div className="flex flex-row text-sm">
              <strong>Nombre: </strong>
              {purchaseDetail.provider?.name}{' '}
              {purchaseDetail.provider?.lastName}
            </div>
            <div className="flex flex-row text-sm">
              <strong className="">Correo electrónico: </strong>
              {purchaseDetail.provider?.email}
            </div>
            <div className="flex flex-row text-sm">
              <strong className="">Telefono: </strong>
              {purchaseDetail.provider?.phone}
            </div>
          </div>
        </div>
        <div className="border-2">
          <div className="bg-black px-2 text-white font-bold">
            <label>Detalle de productos</label>
          </div>
          <DataTable value={purchaseDetail.purchaseDetails} size="small">
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
            <Column field="product.brand" header="Marca"></Column>
            <Column field="quantity" header="Cantidad"></Column>

            <Column
              field="price"
              header="Precio Unitario"
              body={(rowData) => `$${rowData.price.toFixed(2)}`}
            ></Column>
            <Column
              field="total"
              header="Total"
              body={(rowData) => `$${rowData.total.toFixed(2)}`}
            ></Column>
          </DataTable>
        </div>
        <div className="py-2">
          <div className="bg-black text-white px-1 font-bold">
            <label>Observación</label>
          </div>
          <div className="border border-2 py-2">{purchaseDetail.notes}</div>
        </div>

        <div className="mt-4 w-full flex justify-end">
          <div className="flex flex-col bg-black w-full p-2 text-white text-sm">
            <div className="flex flex-row justify-end gap-2">
              <span>${purchaseDetail.subtotal}</span>
              <strong>SUBTOTAL</strong>
            </div>
            <div className="flex flex-row justify-end gap-2">
              <span>%{purchaseDetail.tax}</span>
              <strong>IVA</strong>
            </div>
            <div className="flex flex-row justify-end gap-2">
              <span>${purchaseDetail.total}</span>
              <strong>TOTAL</strong>
            </div>
          </div>
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default Purchase;

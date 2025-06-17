import React, { useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { useDispatch, useSelector } from 'react-redux';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
} from '../../slices/products/thunk';
import Loader from '../../common/Loader';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import InputForm from '../../components/Input/InputForm';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { FaFileExcel, FaFilePdf, FaSearch } from 'react-icons/fa';
import { InputText } from 'primereact/inputtext';
import InputField from '../../InputFile/InputFile';

export const Product = () => {
  const [openModal, setOpenModal] = useState(false);
  const [viewOpenModal, setViewOpenModal] = useState(false);
  const [product, setProduct] = useState<any>({});
  const [isEdit, setIsEdit] = useState(false);
  const [deleteProductModal, setDeleteProductModal] = useState(false);
  const products = useSelector((state: any) => state.Products.productList);
  const loading = useSelector((state: any) => state.Products.loading);
  const productOne = useSelector((state: any) => state.Products?.product);
  const dispatch: any = useDispatch();
  const dt = useRef<DataTable<any[]>>(null);
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    dispatch(getAllProducts());
  }, []);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      code: (product && product.code) || '',
      name: (product && product.name) || '',
      price: (product && product.price) || '',
      tax: (product && product.tax) || '0',
      brand: (product && product.brand) || '',
      image: (product && product.image) || null,
    },
    validationSchema: Yup.object({
      code: Yup.string().required('El codigo es requerido'),
      name: Yup.string().required('El nombre es requerido'),
      price: Yup.number().required('El precio es requerido'),
      tax: Yup.number().required('El impuesto es requerido'),
      brand: Yup.string().required('La marca es requerida'),
    }),
    onSubmit: () => {
      if (isEdit) {
        const formData = new FormData();

        formData.append('code', validation.values.code);
        formData.append('brand', validation.values.brand);
        formData.append('image', validation.values.image);
        formData.append('name', validation.values.name);
        formData.append('price', validation.values.price);
        formData.append('tax', validation.values.tax);

        dispatch(
          updateProduct({
            product: formData,
            id: product.id,
            modal: setOpenModal,
          }),
        );
      } else {
        const formData = new FormData();
        formData.append('code', validation.values.code);
        formData.append('brand', validation.values.brand);
        formData.append('image', validation.values.image);
        formData.append('name', validation.values.name);
        formData.append('price', validation.values.price);
        formData.append('tax', validation.values.tax);

        dispatch(createProduct({ product: formData, modal: setOpenModal }));
      }
    },
  });

  const openModalProduct = () => {
    setProduct('');
    setIsEdit(false);
    setOpenModal(true);
  };

  const handleEditProduct = (product: any) => {
    setOpenModal(true);
    setIsEdit(true);
    setProduct(product);
  };

  const handleViewProduct = (product: any) => {
    setViewOpenModal(true);
    dispatch(getOneProduct(product));
  };
  const leftToolbarTemplate = () => {
    return (
      <div>
        <Button
          className="p-3 bg-blue-800 text-white"
          label="Agregar producto"
          icon="pi pi-plus"
          severity="success"
          onClick={openModalProduct}
        />
      </div>
    );
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-eye"
          className=""
          onClick={() => handleViewProduct(rowData)}
        />
        <Button
          icon="pi pi-pencil"
          className=""
          onClick={() => handleEditProduct(rowData)}
        />
        <Button
          className="text-red"
          icon="pi pi-trash"
          severity="danger"
          onClick={() => deleteModal(rowData)}
        />
      </React.Fragment>
    );
  };

  const deleteModal = (product: any) => {
    setProduct(product);
    setDeleteProductModal(true);
  };

  const removeProduct = (product: any) => {
    const { id } = product;
    if (id) {
      dispatch(deleteProduct(id));
    }
    setDeleteProductModal(false);
  };

  const exportExcel = () => {
    // const flatData = products.map((item: any) => ({
    //   ...item,
    //   provider: item.provider.name,
    // }));
    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');
    XLSX.writeFile(workbook, 'productos.xlsx');
  };

  const exportPdf = () => {
    const doc = new jsPDF();
    const tableColumn = ['Código', 'Producto', 'Imagen', 'Precio', 'Impuesto'];
    const tableRows = products.map((item: any) => [
      item.code,
      item.name,
      item.image,
      item.price,
      item.tax,
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });

    doc.save('productos.pdf');
  };

  return (
    <React.Fragment>
      <Breadcrumb pageName="Productos" />

      <div className="card w-full">
        <Toolbar className="mb-4" end={leftToolbarTemplate} />

        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="bg-white p-2 mb-2 flex items-center justify-between w-full">
              <div className="flex items-center w-full">
                <span className="p-input-icon-left p-4 ">
                  <div className="flex gap-1 justify-center items-center w-full">
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
              value={products}
              rows={10}
              paginator
              globalFilter={globalFilter}
              emptyMessage="No se encontraron resultados"
            >
              <Column
                field="code"
                header="Codigo"
                style={{ minWidth: '6rem' }}
              ></Column>

              <Column
                field="name"
                header="Nombre"
                sortable
                style={{ minWidth: '10rem' }}
              ></Column>

              <Column
                field="brand"
                header="Marca"
                style={{ minWidth: '6rem' }}
              ></Column>

              <Column
                header="Imagen"
                style={{ minWidth: '10rem' }}
                body={(rowData) => {
                  return (
                    <img
                      src={rowData.image || '/public/img/no-image.png'} // Aquí pones tu imagen por defecto
                      alt="Imagen"
                      className="w-20 h-16 object-cover rounded-md"
                    />
                  );
                }}
              ></Column>

              <Column
                header="Precio"
                sortable
                style={{ minWidth: '6rem' }}
                body={(rowData) => {
                  return <p>$ {rowData.price}</p>;
                }}
              ></Column>

              <Column
                header="Impuesto"
                style={{ minWidth: '4rem' }}
                body={(rowData) => {
                  return <p>% {rowData.tax}</p>;
                }}
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
      </div>

      <Dialog
        visible={openModal}
        headerClassName="text-center bg-black text-white"
        header={isEdit ? 'Editar Producto' : 'Agregar Producto'}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        modal
        onHide={() => {
          setOpenModal(false);
          validation.resetForm();
        }}
      >
        <form
          onSubmit={(e: any) => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 mt-2">
              <InputForm
                label="Código"
                name="code"
                validation={validation}
                type="text"
                placeholder="001"
                style="w-40"
              />

              <InputForm
                label="Nombre del producto"
                name="name"
                validation={validation}
                type="text"
                placeholder="Nombre del producto"
                style=""
              />
              <InputForm
                label="Precio"
                name="price"
                validation={validation}
                type="number"
                placeholder="0$"
                style="w-20"
              />
            </div>
            <div className="flex gap-2">
              <InputForm
                label="Impuesto"
                name="tax"
                validation={validation}
                type="number"
                placeholder="Ingrese impusto"
                style="w-20"
              />

              <InputForm
                label="Marca"
                name="brand"
                validation={validation}
                type="text"
                placeholder="Ingrese la marca"
                style="w-full"
              />
            </div>

            <InputField
              name="image"
              selectImage="Seleccione una imagen"
              validation={validation}
            />

            <div className="flex justify-end ">
              <Button
                className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                label="Cancelar"
                icon="pi pi-times"
                type="button"
                onClick={() => {
                  setOpenModal(false);
                  validation.resetForm();
                }}
              />
              <Button
                className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                label="Guardar"
                icon="pi pi-check"
                type="submit"
              />
            </div>
          </div>
        </form>
      </Dialog>

      <Dialog
        visible={deleteProductModal}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Confirmar"
        modal
        onHide={() => setDeleteProductModal(false)}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: '2rem' }}
          />
          {product && (
            <span>
              Esta seguro que desea eliminar a <b>{product.name}</b>?
            </span>
          )}
        </div>
        <div className="flex justify-end p-2 gap-5 mt-5">
          <Button
            label="No"
            icon="pi pi-times"
            className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            onClick={() => setDeleteProductModal(false)}
          />
          <Button
            label="Si"
            icon="pi pi-check"
            severity="danger"
            className="text-red-500 hover:text-white border border-red-500 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            onClick={() => removeProduct(product)}
          />
        </div>
      </Dialog>

      <Dialog
        visible={viewOpenModal}
        headerClassName="bg-black text-center text-white"
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Detalle del producto"
        modal
        onHide={() => setViewOpenModal(false)}
      >
        {/* Imagen antes: productOne?.image
                  ? `http://localhost:3010${productOne!.image}`
                  : 'img/no-image.png' */}
        <div>
          <div>
            <img
              className="w-full h-60 object-contains"
              src={productOne?.image ? productOne.image : 'img/no-image.png'}
              alt=""
            />
          </div>
          <div className="bg-black text-white px-2 font-bold">
            <label>Datos generales</label>
          </div>
          {/* FIla 1 */}
          <div className="mt-2 flex justify-around">
            <div className="flex flex-col">
              <label className="font-bold ">Código</label>
              <p>{productOne?.code}</p>
            </div>

            <div className="flex flex-col">
              <label className="font-bold ">Nombre</label>
              <p>{productOne?.name}</p>
            </div>
            <div className="flex flex-col">
              <label className="font-bold ">Precio</label>
              <p>{productOne?.price}$</p>
            </div>
            <div className="flex flex-col">
              <label className="font-bold ">Impuesto</label>
              <p>{productOne?.tax}%</p>
            </div>
          </div>
          <hr className="border-1 border-black" />
          <div className="flex justify-around">
            <div className="flex flex-col">
              <label className="font-bold">Marca</label>
              <p>{productOne?.brand}</p>
            </div>
          </div>
          <div className="mt-2">
            <div className="bg-black text-white font-bold px-2">
              <label>Caracteristicas</label>
            </div>
          </div>
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default Product;

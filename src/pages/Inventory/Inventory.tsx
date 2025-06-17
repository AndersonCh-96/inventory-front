import React, { useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import {
  addAdjustment,
  getAllProducts,
  getInventory,
} from '../../slices/thunk';
import { Toolbar } from 'primereact/toolbar';
import Loader from '../../common/Loader';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

const Inventory = () => {
  const dispatch: any = useDispatch();
  const dt = useRef<DataTable<any[]>>(null);

  const inventories = useSelector(
    (state: any) => state.Inventories.inventoryList,
  );
  const loading = useSelector((state: any) => state.Inventories.loading);
  const productData = useSelector((state: any) => state.Products.productList);

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getInventory());
  }, []);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      product: '',
      newStock: '',
      note: '',
    },
    validationSchema: Yup.object({
      product: Yup.string().required('El producto es requerido'),
      newStock: Yup.number().required('El nuevo stock es requerido'),
      note: Yup.string().required('La nota es requerida'),
    }),
    onSubmit: () => {
      dispatch(addAdjustment({ adjustment: validation.values }));
      setOpenModal(false);
    },
  });

  const handleProduct = (e: any) => {
    validation.setFieldValue('product', e.value.code);
  };

  const statusProduct = (e: any) => {
    return (
      <React.Fragment>
        {e.stock <= 4 ? <p>Bajo stock</p> : <p>Disponible</p>}
      </React.Fragment>
    );
  };
  return (
    <React.Fragment>
      <Breadcrumb pageName="Inventario" />

      <Toolbar
        className="mb-4"
        end={() => (
          <React.Fragment>
            <Button
              onClick={() => {
                setOpenModal(true);
                validation.resetForm();
              }}
              label="Ajustar inventario"
              icon="pi pi-plus"
              className="py-3 px-4 bg-blue-800 text-white"
            />
          </React.Fragment>
        )}
      />

      {loading ? (
        <Loader />
      ) : (
        <DataTable ref={dt} value={inventories} paginator rows={5}>
          <Column
            field="product.name"
            header="Producto"
            sortable
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="product.code"
            header="Codigo"
            sortable
            style={{ minWidth: '12rem' }}
          />

          <Column
            field="product.price"
            header="Precio"
            sortable
            body={(e: any) => e.product.price + ' $'}
            style={{ minWidth: '12rem' }}
          />

          <Column
            field="stock"
            header="Stock"
            sortable
            style={{ minWidth: '12rem' }}
          />

          <Column header="Estado" body={statusProduct} />
        </DataTable>
      )}

      <Dialog
        visible={openModal}
        style={{ width: '40vw' }}
        headerClassName="bg-black text-center text-white"
        header="Ajuste de inventario"
        modal
        onHide={() => setOpenModal(false)}
      >
        <form
          onSubmit={(e: any) => {
            e.preventDefault();
            validation.handleSubmit();
          }}
          className="mt-2 flex flex-col gap-4 w-full"
        >
          <div className="flex flex-col">
            <label className="text-sm font-bold">Producto</label>
            <Dropdown
              name="product"
              editable
              optionLabel="name"
              onBlur={validation.handleBlur}
              onChange={handleProduct}
              value={
                productData.find(
                  (item: any) => item.id === validation.values.product,
                )?.name || ''
              }
              className="p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              options={productData.map((item: any) => {
                return {
                  name: item.name,
                  code: item.id,
                };
              })}
              placeholder="Seleccione un producto"
            />
            {validation.errors.product && validation.touched.product && (
              <p className="text-sm text-red-500 mt-1">
                {validation.errors.product}
              </p>
            )}
          </div>

          <div>
            <div className="flex flex-col">
              <label className="font-bold text-sm"> Nuevo stock</label>
              <InputText
                type="number"
                name="newStock"
                placeholder="0"
                value={validation.values.newStock}
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                className="p-2 border  border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
              {validation.errors.newStock && validation.touched.newStock && (
                <p className="text-sm text-red-500 mt-1">
                  {validation.errors.newStock}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="flex flex-col">
              <label className="font-bold text-sm"> Nota</label>
              <InputTextarea
                name="note"
                placeholder="Ingrese una nota"
                value={validation.values.note}
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                rows={3}
                cols={20}
                className="p-2 border  border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
              {validation.errors.note && validation.touched.note && (
                <p className="text-sm text-red-500">{validation.errors.note}</p>
              )}
            </div>
          </div>

          <div className="bg-white shadow-lg  px-2">
            <Button
              type="submit"
              className="bg-blue-800 text-white p-2 w-full"
              label="Guardar"
            />
          </div>
        </form>
      </Dialog>
    </React.Fragment>
  );
};

export default Inventory;

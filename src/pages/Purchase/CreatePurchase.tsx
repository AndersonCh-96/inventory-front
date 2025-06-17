import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  createPurchase,
  getAllProducts,
  getProviders,
} from '../../slices/thunk';
import { Dropdown } from 'primereact/dropdown';
import * as Yup from 'yup';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Toolbar } from 'primereact/toolbar';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CreatePurchase = () => {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const [selectProduct, setSelectProduct] = useState<any>([]);

  const providers = useSelector((state: any) => state.Providers.providerList);
  const products = useSelector((state: any) => state.Products.productList);

  useEffect(() => {
    dispatch(getProviders());
    dispatch(getAllProducts());
  }, []);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      date: '',
      provider: '',
      notes: '',
      productDetails: [],
    },
    validationSchema: Yup.object({
      date: Yup.date().required('La fecha es requerida'),
      provider: Yup.string().required('El proveedor es requerido'),
      productDetails: Yup.array().of(
        Yup.object().shape({
          unitCost: Yup.number().required('El costo unitario es requerido'),
          quantity: Yup.number().required('la cantidad es requerida'),
        }),
      ),
      notes: Yup.string().required('La nota es requerida'),
    }),
    onSubmit: () => {
      const newPurchase = {
        date: validation.values.date,
        provider: validation.values.provider,
        notes: validation.values.notes,
        purchaseDetails: validation.values.productDetails.map((item: any) => {
          return {
            quantity: item.quantity,
            price: item.unitCost,
            product: item.product,
          };
        }),
      };

      dispatch(createPurchase(newPurchase));
      navigate('/purchases');
    },
  });

  const selectProductsArray = (product: any) => {
    const existProduct = validation.values.productDetails;

    const alreadyProduct = existProduct.some(
      (item: any) => item.product === product.code,
    );

    if (alreadyProduct) {
      toast.error('El producto ya se encuentra seleccionado');
      return;
    }

    const productItems = [
      ...existProduct,
      { product: product.code, name: product.name },
    ];

    validation.setFieldValue('productDetails', productItems);
  };

  const handleUnitCost = (unitCost: any, index: number) => {
    const updateUnitCost = validation.values.productDetails.map(
      (item: any, idx: any) =>
        idx === index ? { ...item, unitCost: unitCost } : item,
    );

    validation.setFieldValue('productDetails', [...updateUnitCost]);
  };

  const handleQuantity = (quantity: any, index: number) => {
    const updateQuantity = validation.values.productDetails.map(
      (item: any, idx: any) =>
        idx === index ? { ...item, quantity: quantity } : item,
    );

    validation.setFieldValue('productDetails', [...updateQuantity]);
  };

  const handleRemove = (index: any) => {
    const newList = validation.values.productDetails.filter(
      (item: any, idx: any) => idx !== index,
    );
    validation.setFieldValue('productDetails', [...newList]);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          className="p-2 bg-blue-800 text-white"
          label="Regresar"
          icon="pi pi-arrow-left"
          severity="success"
          onClick={() => {
            navigate('/purchases');
          }}
        />
      </div>
    );
  };

  const totalProduct = (entry: any) => {
    return entry.reduce((total: any, item: any) => {
      return total + Number(item.quantity) * Number(item.unitCost);
    }, 0);
  };

  const handleProvider = (e: any) => {
    validation.setFieldValue('provider', e.value.code);
  };
  return (
    <React.Fragment>
      <Breadcrumb pageName="Crear una nueva compra" />
      <Toolbar className="mb-4" start={leftToolbarTemplate} />

      <form
        onSubmit={(e: any) => {
          e.preventDefault();
          validation.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-5">
          <div className="gap-5 flex  bg-white rounded-lg shadow-lg items-center justify-start p-8">
            <h1 className="text-md  uppercase font-bold text-gray-800 mb-4">
              Información General
            </h1>
            <div className="flex-col space-y-4 w-full ">
              {/* Campo de Fecha */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-sm text-gray-700">
                  Fecha
                </label>
                <InputText
                  type="date"
                  name="date"
                  value={validation.values.date}
                  onBlur={validation.handleBlur}
                  onChange={validation.handleChange}
                  className="p-2 border  border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="Ingrese fecha"
                />
                {validation.errors.date && validation.touched.date && (
                  <p className="text-sm text-red-500 mt-1">
                    {validation.errors.date}
                  </p>
                )}
              </div>

              {/* Campo de Proveedor */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-sm text-gray-700">
                  Proveedor
                </label>
                <Dropdown
                  name="provider"
                  editable
                  value={
                    providers.find(
                      (item: any) => item.id === validation.values.provider,
                    )?.name || ''
                  }
                  onChange={handleProvider}
                  onBlur={validation.handleBlur}
                  options={providers.map((item: any) => {
                    return {
                      name: item.name,
                      code: item.id,
                    };
                  })}
                  className="p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  optionLabel="name"
                  placeholder="Ingrese un proveedor"
                />
                {validation.errors.provider && validation.touched.provider && (
                  <p className="text-sm text-red-500 mt-1">
                    {validation.errors.provider}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Porductos */}
          <div className="bg-white w-full h-full shadow-lg p-8 items-center space-y-4">
            <div className="flex flex-col justify-center  uppercase font-bold text-lg">
              <h1>Detalle de compra</h1>
              <hr className="border-2 border-gray-400" />
            </div>
            <div className="mt-8 flex gap-2 flex-col items-start">
              <p className="text-md font-bold">Productos</p>
              <Dropdown
                name="product"
                editable
                value={selectProduct}
                onChange={(e) => {
                  const product = e.target.value;
                  setSelectProduct(product);
                  selectProductsArray(product);
                }}
                options={products.map((item: any) => {
                  return {
                    name: item.name,
                    code: item.id,
                  };
                })}
                className="p-2 w-full border-2"
                optionLabel="name"
                placeholder="Seleccione un producto"
              />
            </div>

            <div>
              {validation.values.productDetails.length == 0 ? (
                <Message
                  severity="info"
                  className="w-full"
                  content="No hay productos agregados"
                />
              ) : (
                validation.values.productDetails.map(
                  (item: any, index: number) => (
                    <React.Fragment key={index}>
                      <div className="mt-10 md:flex  justify-evenly ">
                        <div className="flex items-center">{index + 1}</div>
                        <div className="flex flex-col ">
                          <label className="font-bold">Producto</label>
                          <div className="flex items-center h-full">
                            <label>{item.name}</label>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="font-bold">Precio</label>
                          <InputText
                            className="p-2 w-30 border border-blue-700"
                            type="number"
                            name="unitCost"
                            onBlur={validation.handleBlur}
                            placeholder="Ingrese precio"
                            value={
                              validation.values.productDetails[index]
                                .unitCost ?? ''
                            }
                            onChange={(e) => {
                              handleUnitCost(e.target.value, index);
                            }}
                          />

                          {/* {validation.errors.productDetails &&
                          validation.errors.productDetails[index].unitCost &&
                          validation.touched.productDetails &&
                          validation.touched.productDetails[index].unitCost && (
                            <p className="text-sm text-red-500">
                              {validation.errors.productDetails[index].unitCost}
                            </p>
                          )} */}
                        </div>

                        <div className="flex flex-col font-bold gap-2">
                          <label> Cantidad</label>
                          <InputText
                            className="p-2 border w-30 border-blue-700"
                            type="number"
                            name="quantity"
                            onBlur={validation.handleBlur}
                            placeholder="Ingrese cantidad"
                            value={
                              validation.values.productDetails[index]
                                .quantity ?? ''
                            }
                            onChange={(e) => {
                              handleQuantity(e.target.value, index);
                            }}
                          />
                          {validation.errors.quantity &&
                            validation.touched.quantity && (
                              <p className="text-sm text-red-500">
                                {validation.errors.quantity}
                              </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="font-bold">SubTotal</label>
                          <InputText
                            disabled
                            type="number"
                            className="p-2 border md:w-20  border-blue-700"
                            value={(
                              parseFloat(
                                validation.values.productDetails[index]
                                  .unitCost,
                              ) *
                              parseInt(
                                validation.values.productDetails[index]
                                  .quantity,
                              )
                            ).toFixed(2)}
                          />
                        </div>
                        <div className="flex items-center">
                          <Button
                            type="button"
                            icon="pi pi-trash"
                            size="large"
                            className="text-danger font-bold"
                            onClick={() => handleRemove(index)}
                          />
                        </div>
                      </div>
                      {/* <div className="flex mt-4 ">
                        Total: {totalProduct(validation.values.productDetails)}{' '}
                      </div> */}
                    </React.Fragment>
                  ),
                )
              )}
            </div>
            <div>
              Total:{' '}
              {isNaN(totalProduct(validation.values.productDetails))
                ? '0'
                : totalProduct(validation.values.productDetails).toFixed(2)}{' '}
              $
            </div>
          </div>

          <div className="flex flex-col bg-white p-8 shadow-lg ">
            <label className="font-bold text-lg mb-2">Nota</label>
            <InputTextarea
              value={validation.values.notes}
              name="notes"
              onChange={validation.handleChange}
              rows={3}
              cols={20}
              placeholder="Ingrese una nota"
              className="p-3 border-2"
            />
            {validation.errors.notes && validation.touched.notes && (
              <p className="text-sm text-red-500">{validation.errors.notes}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="bg-white shadow-lg py-6 px-2">
            <Button
              type="submit"
              className="bg-success text-white p-2 w-full"
              label="Guardar"
            />
          </div>
        </div>
      </form>
    </React.Fragment>
  );
};

export default CreatePurchase;

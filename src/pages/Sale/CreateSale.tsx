import React, { act, useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { createSale, getAllProducts, getCustomers } from '../../slices/thunk';
import { Dropdown } from 'primereact/dropdown';
import * as Yup from 'yup';
import { Message } from 'primereact/message';
import { InputTextarea } from 'primereact/inputtextarea';
import toast from 'react-hot-toast';

const CreateSale = () => {
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();

  const customers = useSelector((state: any) => state.Customers.customerList);
  const products = useSelector((state: any) => state.Products.productList);
  const error = useSelector((state: any) => state.Sales.error);

  const [selectProduct, setSelectProduct] = useState<any>([]);
  const [selectPayment, setSelectPayment] = useState<any>([]);
  useEffect(() => {
    dispatch(getCustomers());
    dispatch(getAllProducts());
  }, []);

  const paymentType = [
    { name: 'Efectivo', code: 'Cash' },
    { name: 'Credito', code: 'Credit' },
  ];

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      date: '',
      customer: '',
      notes: '',
      saleDetails: [],
      paymentMethods: [],
    },
    validationSchema: Yup.object({
      date: Yup.string().required('La fecha es requerida'),
      customer: Yup.string().required('El cliente es requerido'),
      notes: Yup.string().required('La nota es requerida'),
      saleDetails: Yup.array().of(
        Yup.object().shape({
          product: Yup.string().required('El producto es requerido'),
          quantity: Yup.number().required('La cantidad es requerida'),
          unitCost: Yup.number().required('El precio es requerido'),
        }),
      ),
      paymentMethods: Yup.array().of(
        Yup.object().shape({
          amount: Yup.number().required('El monto es requerido'),
        }),
      ),
    }),
    onSubmit: () => {
      if (validation.values.paymentMethods.length === 0) {
        toast.error('Debe seleccionar al menos un metodo de pago');
        return;
      }

      const newSale = {
        date: validation.values.date,
        customer: validation.values.customer,
        notes: validation.values.notes,
        saleDetails: validation.values.saleDetails.map((item: any) => {
          return {
            quantity: item.quantity,
            unitCost: item.unitCost,
            product: item.product,
            taxPercentage: 0,
          };
        }),
        paymentMethods: validation.values.paymentMethods.map((item: any) => {
          return {
            amount: item.amount,
            type: item.type,
          };
        }),
      };

      dispatch(createSale({ data: newSale, navigate }));
    },
  });

  const handleSelectPayment = (payment: any) => {
    const existingPayments = validation.values.paymentMethods;

    const alreadySelected = existingPayments.some(
      (item: any) => item.type === payment.code,
    );

    if (alreadySelected) {
      toast.error('El método de pago ya se encuentra seleccionado');
      return;
    }

    const updatedPayments = [...existingPayments, { type: payment.code }];

    validation.setFieldValue('paymentMethods', updatedPayments);
  };

  const selectProductsArray = (product: any) => {
    const existProduct = validation.values.saleDetails;

    const alreadyProduct = existProduct.some(
      (item: any) => item.product === product.code,
    );

    if (alreadyProduct) {
      toast.error('El producto ya se encuentra seleccionado');
      return;
    }

    const productItems = [
      ...existProduct,
      {
        product: product.code,
        name: product.name,
        stock: product.stock?.stock,
        price: product.price,
      },
    ];
    validation.setFieldValue('saleDetails', productItems);
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
            navigate('/sales');
          }}
        />
      </div>
    );
  };

  const handleCustomer = (e: any) => {
    validation.setFieldValue('customer', e.value.code);
  };

  const handleUnitCost = (unitCost: any, index: number) => {
    const updateUnitCost = validation.values.saleDetails.map(
      (item: any, idx: any) =>
        idx === index ? { ...item, unitCost: unitCost } : item,
    );

    validation.setFieldValue('saleDetails', [...updateUnitCost]);
  };

  const handleQuantity = (quantity: any, index: number) => {
    if (parseInt(quantity) > validation.values.saleDetails[index].stock) {
      toast('La cantidad ingresada supera el stock');
      return;
    }
    const updateQuantity = validation.values.saleDetails.map(
      (item: any, idx: any) =>
        idx === index ? { ...item, quantity: quantity } : item,
    );

    validation.setFieldValue('saleDetails', [...updateQuantity]);
  };

  const handleRemove = (index: any) => {
    const newList = validation.values.saleDetails.filter(
      (item: any, idx: any) => idx !== index,
    );
    validation.setFieldValue('saleDetails', [...newList]);
  };

  const handleAmount = (amount: any, index: number) => {
    const updateQuantity = validation.values.paymentMethods.map(
      (item: any, idx: any) =>
        idx === index ? { ...item, amount: amount } : item,
    );

    validation.setFieldValue('paymentMethods', [...updateQuantity]);
  };

  const handleRemoveMethodPayment = (index: number) => {
    const newPaymentMethod = validation.values.paymentMethods.filter(
      (item: any, idx: any) => idx !== index,
    );
    validation.setFieldValue('paymentMethods', [...newPaymentMethod]);
  };
  const totalProduct = (entry: any) => {
    return entry.reduce((total: any, item: any) => {
      return total + Number(item.quantity) * Number(item.unitCost);
    }, 0);
  };

  return (
    <React.Fragment>
      <Toolbar className="mb-4" start={leftToolbarTemplate} />

      <Breadcrumb pageName="Crear una nueva venta" />

      <form
        onSubmit={(e: any) => {
          e.preventDefault();
          validation.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-5">
          <div className="gap-5 flex  bg-white rounded-lg shadow-lg items-center justify-start p-8">
            {' '}
            <h1 className="text-md font-bold uppercase text-gray-800 mb-4">
              Información General
            </h1>
            <div className="flex flex-col w-full gap-4">
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
                  <p className="text-sm text-red-500">
                    {validation.errors.date}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-sm text-gray-700">
                  Cliente
                </label>
                <Dropdown
                  name="customer"
                  editable
                  value={
                    customers.find(
                      (item: any) => item.id === validation.values.customer,
                    )?.name || ''
                  }
                  onChange={handleCustomer}
                  onBlur={validation.handleBlur}
                  options={customers.map((item: any) => {
                    return {
                      name: item.name,
                      code: item.id,
                    };
                  })}
                  className="p-2 border-2"
                  optionLabel="name"
                  placeholder="Ingrese cliente"
                />
                {validation.errors.customer && validation.touched.customer && (
                  <p className="text-sm text-red-500">
                    {validation.errors.customer}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="bg-white w-full h-full shadow-lg p-8 items-center space-y-4">
            <div className="flex flex-col justify-center  uppercase font-bold text-lg">
              <h1>Detalle de la venta</h1>
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
                  const { inventory } = item;
                  return {
                    name: item.name,
                    code: item.id,
                    stock: inventory,
                    price: item.price,
                  };
                })}
                className="p-2 w-full border-2"
                optionLabel="name"
                placeholder="Seleccione un producto"
              />
            </div>

            <div>
              {validation.values.saleDetails.length == 0 ? (
                <Message
                  severity="info"
                  className="w-full mt-6"
                  content="No hay productos agregados"
                />
              ) : (
                validation.values.saleDetails.map(
                  (item: any, index: number) => (
                    <React.Fragment key={index}>
                      <div className="mt-10 md:flex justify-evenly ">
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
                            className="p-2 w-30 border border-blue-700 "
                            type="number"
                            name="unitCost"
                            onBlur={validation.handleBlur}
                            placeholder={
                              item.price ? ` ${item.price}$` : 'Ingrese precio'
                            }
                            value={
                              validation.values.saleDetails[index].unitCost ??
                              ``
                            }
                            onChange={(e) => {
                              handleUnitCost(e.target.value, index);
                            }}
                          />
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
                              validation.values.saleDetails[index].quantity ??
                              ''
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
                          <label className="font-bold">Total</label>
                          <InputText
                            disabled
                            type="number"
                            className="p-2 border md:w-20  border-blue-700"
                            value={(
                              parseFloat(
                                validation.values.saleDetails[index].unitCost,
                              ) *
                              parseInt(
                                validation.values.saleDetails[index].quantity,
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

                        <div className="flex flex-col gap-2">
                          <label className="font-bold">Stock</label>
                          <label>{item.stock}</label>
                        </div>
                      </div>
                    </React.Fragment>
                  ),
                )
              )}
            </div>
            <div>
              Total:{' '}
              {isNaN(totalProduct(validation.values.saleDetails))
                ? '0'
                : totalProduct(validation.values.saleDetails).toFixed(2)}{' '}
              $
            </div>
          </div>

          {/* FOrma de pago */}
          <div className="flex flex-col ">
            <div className="md:flex  gap-5  bg-white rounded-lg shadow-lg items-center justify-start p-8">
              <label className="text-md  uppercase font-bold text-gray-800 mb-4">
                Forma de pago
              </label>

              <div className="flex flex-col w-full">
                <Dropdown
                  name="payment"
                  value={selectPayment}
                  placeholder="Seleccione un metodo de pago"
                  optionLabel="name"
                  onChange={(e) => {
                    const payment = e.target.value;
                    setSelectPayment(payment);
                    handleSelectPayment(payment);
                  }}
                  className=" w-full justify-center text-center border-2"
                  options={paymentType.map((item: any) => {
                    return {
                      name: item.name,
                      code: item.code,
                    };
                  })}
                />

                <div className="">
                  {validation.values.paymentMethods.length === 0 ? (
                    <Message
                      severity="info"
                      className="w-full mt-6"
                      content="No tiene seleccionado un metodo de pago"
                    />
                  ) : (
                    validation.values.paymentMethods.map(
                      (item: any, index: number) => {
                        return (
                          <React.Fragment key={index}>
                            <div className="flex items-end ">
                              <div className="flex w-full flex-col gap-2">
                                <label className="font-bold mb-2 mt-2">
                                  {' '}
                                  {item.type === 'Cash'
                                    ? 'Efectivo'
                                    : 'Credito'}
                                </label>
                                <InputText
                                  type="number"
                                  className="p-2 w-full border-2"
                                  name="amount"
                                  id="amount"
                                  onBlur={validation.handleBlur}
                                  value={
                                    validation.values.paymentMethods[index]
                                      .amount ?? ''
                                  }
                                  onChange={(e: any) => {
                                    handleAmount(e.target.value, index);
                                  }}
                                  placeholder="0$"
                                />

                                {validation.touched.paymentMethods &&
                                  validation.touched.paymentMethods[index]
                                    ?.amount &&
                                  validation.errors.paymentMethods &&
                                  validation.errors.paymentMethods[index]
                                    ?.amount && (
                                    <p className="text-black">
                                      {
                                        validation.errors.paymentMethods[index]
                                          .amount
                                      }
                                    </p>
                                  )}
                              </div>
                              <div className="w-20 flex justify-center items-center">
                                <Button
                                  onClick={() => {
                                    handleRemoveMethodPayment(index);
                                  }}
                                  type="button"
                                  severity="danger"
                                  className="pi pi-trash text-lg font-bold text-red"
                                ></Button>
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      },
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notas */}
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

        <Button
          type="submit"
          className=" bg-blue-800 text-white p-4 w-full mt-8"
          label="Guardar"
        />
      </form>
    </React.Fragment>
  );
};

export default CreateSale;

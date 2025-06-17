import { User } from '../pages/User/interface.use';
import { APIClient } from './api.helper';
import * as url from './url';

const api = new APIClient();

//Login

export const postLogin = (data: any) => api.create(url.POST_LOGIN, data);
export const postLogOut = (data: any) => api.create(url.POST_LOGOUT, data);

//Users
export const getUsers = () => api.get(url.GET_USERS);
export const editUser = (user: User) =>
  api.put(`${url.GET_USERS}/${user.id}`, user);
export const createUser = (user: any) => api.create(`${url.GET_USERS}`, user);
export const deleteUser = (id: any) => api.delete(`${url.GET_USERS}/${id}`);

//Products
export const getProducts = () => api.get(url.PRODUCT);
export const getOneProduct = (id: string) => api.get(`${url.PRODUCT}/${id}`);
export const createProduct = (product: any) =>
  api.create(`${url.PRODUCT}/create`, product, 'multipart/form-data');
export const updateProduct = (product: any, id: any) =>
  api.put(`${url.PRODUCT}/${id}`, product, 'multipart/form-data');
export const deleteProduct = (id: any) => api.delete(`${url.PRODUCT}/${id}`);

//Customers
export const getCustomers = () => api.get(url.CUSTOMER);
export const createCustomer = (customer: any) =>
  api.create(`${url.CUSTOMER}/create`, customer);
export const updateCustomer = (customer: any) =>
  api.put(`${url.CUSTOMER}/${customer.id}`, customer);
export const deleteCustomer = (id: any) => api.delete(`${url.CUSTOMER}/${id}`);

//Providers
export const getProviders = () => api.get(url.PROVIDER);
export const createProvider = (provider: any) =>
  api.create(`${url.PROVIDER}/create`, provider);
export const updateProvider = (provider: any) =>
  api.put(`${url.PROVIDER}/${provider.id}`, provider);
export const deleteProvider = (id: any) => api.delete(`${url.PROVIDER}/${id}`);

//Purchase

export const getPurchase = () => api.get(url.PURCHASE);
export const getTotalPurchases = () =>
  api.get(`${url.PURCHASE}/total-purchase`);
export const getPurchaseDetails = (purchaseId: string) =>
  api.get(`${url.PURCHASE}/${purchaseId}`);
export const createPurchase = (purchase: any) =>
  api.create(`${url.PURCHASE}/create`, purchase);

//Inventory

export const getInventory = () => api.get(url.INVENTORY);
export const addAdjustment = (adjustment: any) =>
  api.create(`${url.INVENTORY}/adjustment`, adjustment);

//InventoryMovements

export const getInventoryMovements = () => api.get(url.INVENTORYMOVEMENTS);
//Credits

export const getCredits = () => api.get(url.CREDITS);
export const getTotalCredits = () => api.get(`${url.CREDITS}/total-credits`);
export const getCustomerCredits = (customerId: any) =>
  api.get(`${url.CREDITS}/${customerId}`);

//Create sale
export const getSales = () => api.get(url.SALES);
export const getTotalSales = () => api.get(`${url.SALES}/total-sales`);
export const getDetailSale = (saleId: any) => api.get(`${url.SALES}/${saleId}`);
export const createSale = (sale: any) =>
  api.create(`${url.SALES}/create`, sale);

//Payment

export const createPaymenCredit = (payment: any) =>
  api.create(`${url.PAYMENT}/create`, payment);

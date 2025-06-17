import { Navigate } from 'react-router-dom';
import SignIn from '../pages/Authentication/SignIn';
import SignUp from '../pages/Authentication/SignUp';
import ECommerce from '../pages/Dashboard/ECommerce';
import User from '../pages/User/User';
import Product from '../pages/products/Product';
import Provider from '../pages/Provider/Provider';
import Customer from '../pages/Customer/Custromer';
import Purchase from '../pages/Purchase/Purchase';
import CreatePurchase from '../pages/Purchase/CreatePurchase';
import Inventory from '../pages/Inventory/Inventory';
import Sale from '../pages/Sale/Sale';
import CreateSale from '../pages/Sale/CreateSale';
import SelectPayment from '../pages/Sale/SelectPayment';
import Credit from '../pages/Credit/Credit';
import Profile from '../pages/Profile';
import { icons } from 'react-icons';
import InventoryMovement from '../pages/InventoryMovement/InventoryMovement';

const authRoutes = [
  {
    path: '/',
    title: 'Ecomerce',
    component: <ECommerce />,
  },

  {
    path: '/user',
    title: 'Usuarios',
    component: <User />,
  },
  {
    path: '/products',
    title: 'Productos',
    component: <Product />,
  },
  {
    path: '/providers',
    title: 'Proveedores',
    component: <Provider />,
  },
  {
    path: '/customers',
    title: 'Clientes',
    component: <Customer />,
  },

  {
    path: '/purchases',
    title: 'Compras',
    component: <Purchase />,
  },

  {
    path: '/purchases/create',
    title: 'Crear compra',
    component: <CreatePurchase />,
  },
  {
    path: '/inventories',
    title: 'Inventorio',
    component: <Inventory />,
  },
  {
    path: '/inventory-movement',
    title: 'Movimientos',
    component: <InventoryMovement />,
  },

  {
    path: '/sales',
    title: 'Ventas',
    component: <Sale />,
  },
  {
    path: '/sales/create',
    title: 'Crear venta',
    component: <CreateSale />,
  },

  {
    path: '/sales/create/metodo-pago',
    title: 'Seleccion el pago',
    component: <SelectPayment />,
  },

  {
    path: '/profile',
    title: 'Perfil',
    component: <Profile />,
  },

  {
    path: '/credits',
    title: 'Deudores',
    component: <Credit />,
  },

  {
    path: '/',
    exact: true,
    component: <Navigate to="/" />,
  },
  { path: '*', component: <Navigate to="/" /> },
];

const publicRoutes = [
  {
    path: '/auth/signin',
    component: <SignIn />,
  },
  {
    path: '/auth/signup',
    component: <SignUp />,
  },
];

export { authRoutes, publicRoutes };

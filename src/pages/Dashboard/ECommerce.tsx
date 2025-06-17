import React, { useEffect } from 'react';
import CardDataStats from '../../components/CardDataStats';
import ChartOne from '../../components/Charts/ChartOne';
import ChartThree from '../../components/Charts/ChartThree';
import ChartTwo from '../../components/Charts/ChartTwo';
import ChatCard from '../../components/Chat/ChatCard';
import MapOne from '../../components/Maps/MapOne';
import TableOne from '../../components/Tables/TableOne';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllProducts,
  getCustomers,
  getProviders,
  getTotalCredits,
  getTotalPurchase,
  getTotalSales,
} from '../../slices/thunk';
import {
  FaCarSide,
  FaCartPlus,
  FaCreditCard,
  FaMoneyBillWave,
  FaProductHunt,
  FaShoppingBag,
  FaUser,
  FaUsers,
} from 'react-icons/fa';

const ECommerce: React.FC = () => {
  const dispatch: any = useDispatch();
  const products = useSelector((state: any) => state.Products.productList);
  const clients = useSelector((state: any) => state.Customers.customerList);
  const providers = useSelector((state: any) => state.Providers.providerList);
  const totalCredits = useSelector((state: any) => state.Credits.totalCredits);

  const totalSales = useSelector((state: any) => state.Sales.totalSales);

  const totalPurchase = useSelector(
    (state: any) => state.Purchases.totalPurchase,
  );

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getCustomers());
    dispatch(getProviders());
    dispatch(getTotalCredits({}));
    dispatch(getTotalPurchase());
    dispatch(getTotalSales());
  }, []);

  console.log('Data', totalSales);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Total de créditos"
          total={totalCredits ? `${totalCredits} $` : '0 $'}
          // rate="0.43%"
          levelUp
        >
          <FaCreditCard size={20} color="blue" />
        </CardDataStats>
        <CardDataStats title="Proveedores" total={providers.length} levelUp>
          <FaUsers size={20} color="blue" />
        </CardDataStats>
        <CardDataStats
          title="Productos"
          total={products.length}
          // rate="2.59%"
          levelUp
        >
          <FaCartPlus size={20} color="blue" />
        </CardDataStats>
        <CardDataStats
          title="Clientes"
          total={clients.length}
          // rate="0.95%"
          levelUp
        >
          <FaUsers size={20} color="blue" />
        </CardDataStats>

        <CardDataStats
          title="Compras"
          total={`${totalPurchase.totalCompras} $`}
          // rate="0.95%"
          levelUp
        >
          <FaShoppingBag size={20} color="blue" />
        </CardDataStats>

        <CardDataStats
          title="Ventas"
          total={`${totalSales} $`}
          // rate="0.95%"
          levelUp
        >
          <FaMoneyBillWave size={20} color="blue" />
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/* <ChartOne />
        <ChartTwo />
        <ChartThree />
        <MapOne /> */}
        <div className="col-span-12 xl:col-span-8">{/* <TableOne /> */}</div>
        {/* <ChatCard /> */}
      </div>
    </>
  );
};

export default ECommerce;

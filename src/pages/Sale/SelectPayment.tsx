import React from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const SelectPayment = () => {
  const navigate: any = useNavigate();

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          className="p-2 bg-blue-800 text-white"
          label="Regresar"
          icon="pi pi-arrow-left"
          severity="success"
          onClick={() => {
            navigate('/sales/create');
          }}
        />
      </div>
    );
  };
  return (
    <React.Fragment>
      <Breadcrumb pageName="Mètodo de pago" />
      <Toolbar className="mb-4" start={leftToolbarTemplate} />
    </React.Fragment>
  );
};

export default SelectPayment;

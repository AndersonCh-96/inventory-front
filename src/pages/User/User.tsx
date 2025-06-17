import React, { useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import {
  createUser,
  deleteUserData,
  editUserData,
  getUser,
} from '../../slices/thunk';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InputForm from '../../components/Input/InputForm';
import Loader from '../../common/Loader';
import toast from 'react-hot-toast';
const User = () => {
  const dispatch: any = useDispatch();
  const users = useSelector((state: any) => state.User.userList);
  const loading = useSelector((state: any) => state.User.loading);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [user, setUser] = useState<any>({});
  const [deleteUser, setDeleteUser] = useState(false);
  const dt = useRef<DataTable<any[]>>(null);


  useEffect(() => {
    dispatch(getUser());
  }, []);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: user && user.id,
      name: (user && user.name) || '',
      phone: (user && user.phone) || '',
      email: (user && user.email) || '',
      password: '',
    },

    validationSchema: Yup.object({
      name: Yup.string().required('El nombre es requerido'),
      phone: Yup.string().required('El numero de telefono es requerido'),
      email: Yup.string()
        .email('Debe ser un correo valido')
        .required('El correo es requerido'),
      password: Yup.string().required('la contraseña es requerida'),
    }),
    onSubmit: (values: any) => {
      if (isEdit) {
        const objectUpdate = {
          id: user.id,
          name: validation.values.name,
          phone: validation.values.phone,
          email: validation.values.email,
          password: validation.values.password,
        };
        dispatch(editUserData(objectUpdate));
      } else {
        const newObjet = {
          name: validation.values.name,
          phone: validation.values.phone,
          email: validation.values.email,
          password: validation.values.password,
        };

        dispatch(createUser(newObjet));
      }
      setIsOpenModal(false);
    },
  });

  const openNew = () => {
    setUser('');
    setIsEdit(false);
    setIsOpenModal(true);
  };

  const hidenDialog = () => {
    validation.resetForm();
    setIsEdit(false);
    setIsOpenModal(false);
  };
  const hidenDialogUser = () => {
    setDeleteUser(false);
  };

  const editUser = (user: any) => {
    if (user.name === 'admin') {
      toast.error('No tiene permisos para editar admin');
      return;
    }
    setUser(user);
    setIsEdit(true);
    setIsOpenModal(true);
  };

  const confirmDeleteUser = (user: any) => {
    if (user.name === 'admin') {
      toast.error('No tiene permisos para borrar admin');
      return;
    }
    setUser(user);
    setDeleteUser(true);
  };

  const removeUser = (user: any) => {
    const { id } = user;
    if (id) {
      dispatch(deleteUserData(id));
    }

    setDeleteUser(false);
  };
  const actionBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="disabled"
          onClick={() => editUser(rowData)}
        />
        <Button
          className="text-red"
          icon="pi pi-trash"
          severity="danger"
          onClick={() => confirmDeleteUser(rowData)}
        />
      </React.Fragment>
    );
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          className="p-2 bg-blue-800 text-white"
          label="Crear usuario"
          icon="pi pi-plus"
          severity="success"
          onClick={openNew}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return <div></div>;
  };

  return (
    <React.Fragment>
      <Breadcrumb pageName="Usuarios" />

      <div className="card ">
        <Toolbar
          className="mb-2 p-3"
          end={leftToolbarTemplate}
          // end={rightToolbarTemplate}
        />
        {loading ? (
          <>
            {' '}
            <Loader />
          </>
        ) : (
          <DataTable
            ref={dt}
            value={users}
            paginator
            rows={6}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} de {last} usuarios"
          >
            <Column
              field="name"
              header="Nombre"
              sortable
              style={{ minWidth: '12rem' }}
            ></Column>
            <Column
              field="phone"
              header="Telefono"
              sortable
              style={{ minWidth: '12rem' }}
            ></Column>
            <Column
              field="email"
              header="Email"
              style={{ minWidth: '12rem' }}
            ></Column>
            <Column
              body={actionBodyTemplate}
              exportable={false}
              style={{ minWidth: '12rem' }}
            ></Column>
          </DataTable>
        )}
      </div>

      <Dialog
        visible={isOpenModal}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header={isEdit ? 'Editar usuario' : 'Agregar Usuario'}
        style={{ width: '35rem' }}
        headerClassName="bg-black text-white text-center"
        modal
        className=""
        onHide={hidenDialog}
      >
        <form
          onSubmit={(e): any => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
        >
          <div className="flex flex-col gap-2 mt-2">
            <InputForm
              label="Nombre"
              name="name"
              validation={validation}
              type="text"
              placeholder="Ingrese su nombre"
              style=""
            />

            <InputForm
              label="Telefono"
              name="phone"
              validation={validation}
              type="text"
              placeholder="Ingrese su telefoono"
              style=""
            />

            <InputForm
              label="Email"
              name="email"
              validation={validation}
              type="email"
              placeholder="Ingrese su correo electronico"
              style=""
            />

            <InputForm
              label="Contraseña"
              name="password"
              validation={validation}
              type="password"
              placeholder="Ingrese su contraseña"
              style=""
            />

            <div className="flex justify-end">
              <Button
                className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                label="Cancelar"
                icon="pi pi-times"
                type="button"
                onClick={hidenDialog}
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
        visible={deleteUser}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Confirmar"
        modal
        onHide={hidenDialogUser}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: '2rem' }}
          />
          {user && (
            <span>
              Esta seguro que desea eliminar a <b>{user.name}</b>?
            </span>
          )}
        </div>
        <div className="flex justify-end p-2 gap-5 mt-5">
          <Button
            label="No"
            icon="pi pi-times"
            className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            onClick={hidenDialogUser}
          />
          <Button
            label="Si"
            icon="pi pi-check"
            severity="danger"
            className="text-red-500 hover:text-white border border-red-500 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            onClick={() => removeUser(user)}
          />
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default User;

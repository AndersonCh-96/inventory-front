import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import DefaultLayout from '../layout/DefaultLayout';
import AuthProtected from './auth.routes';
import { authRoutes ,publicRoutes} from './all.routes';

const Index = () => {

  
  return (
    <React.Fragment>
      <Routes>
      <Route>
          {publicRoutes.map((item, idx) => (
            <Route key={idx} path={item.path} element={item.component}  />
          ))}
        </Route>
        <Route>
         
            {authRoutes.map((item, idx) => (
              <Route
            
                path={item.path}
                element={
                  <AuthProtected>
                     <DefaultLayout>
                     {item.component}
                     </DefaultLayout>
                  
                  </AuthProtected>
                }
                key={idx}
              />
            ))}
          
        </Route>

        


      </Routes>
    </React.Fragment>
  );
};

export default Index;

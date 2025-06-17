import toast from 'react-hot-toast';
import { postLogin } from '../../helpers/api_backend';
import { apiError, loginSuccess } from './reducer';

export const loginUser =
  ({ user, navigate }: any) =>
  async (dispatch: any) => {
    try {
      const response = postLogin({
        email: user.email,
        password: user.password,
      });

      const login = await response;

      if (login.data.user) {
        sessionStorage.setItem('authUser', JSON.stringify(login.data.user));
        let finalLogin = JSON.stringify(login.data);
        const data = JSON.parse(finalLogin);
        if (data.status == 1) {
          dispatch(loginSuccess(user));
          navigate('/');
        }
      }
    } catch (error: any) {
      toast.error(error.response.data);
      return error;
    }
  };

export const logOutUser = () => async (dispatch: any) => {
  try {
    sessionStorage.removeItem('authUser');
  } catch (error) {
    dispatch(apiError(error));
  }
};

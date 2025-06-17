import { useEffect, useState } from 'react';
import { getUserLogged } from '../helpers/api.helper';

//Obtener el usuario del localStorage
const useProfile = () => {
  const userSession = getUserLogged();



  const [userProfile, setUserProfile] = useState(
    userSession ? userSession : null,
  );

  useEffect(() => {
    const userSession = getUserLogged();
    setUserProfile(userSession ? userSession : null);
  }, []);

  return { userProfile };
};
export default useProfile;

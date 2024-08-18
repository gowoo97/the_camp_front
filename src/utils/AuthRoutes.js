import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { roleAtom, rolePathAtom } from '../recoil/atom/UserAtom';
import { Outlet } from 'react-router-dom';
import apiFetch from './api';

const AuthRoutes = () => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useRecoilState(roleAtom);
  const rolePath = useRecoilValue(rolePathAtom);
  
  
  useEffect(() => {
    setLoading(false);
    const authorization = localStorage.getItem('Authorization');
    
    if (!authorization) {
      setLoading(true);
      return;
    }
    
    (async () => {
      try {        
          const response =  await apiFetch('/user/role', {

          method : 'GET',
          headers : {
            "Content-Type": "application/json",
            "Authorization" : authorization
          }
        });
      
        if (response.ok) {
          const json = await response.json();
          setRole(json.role);
          setLoading(true);
          return;          
        } else if (response.status === 401) {
          //acess 토큰 재발급
          setRole("ROLE_GUEST");
          setLoading(true);
          return;
        } else {
          setRole("ROLE_GUEST");
          setLoading(true);
          return;
        }
      } catch(error) {
        console.error(error);
      }
    })()
  }, [rolePath, setRole])
  
  return (
    (!loading) ? <></> : 
    (role === "ROLE_GUEST") ? 
    <>
      <Outlet />
    </> :
    (role === "ROLE_USER") ? 
        <>
          <Outlet />
        </> :
    (role === "ROLE_ADMIN") ? 
      <>
        <Outlet />
      </>
    : <></>
  )
}

export default AuthRoutes;
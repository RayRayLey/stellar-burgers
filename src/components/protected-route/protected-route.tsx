import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { getUserSelector } from '../../services/slices/userSlice';
import { useSelector } from 'react-redux';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const userData = useSelector(getUserSelector);
  const isAuthChecked = userData.isAuthChecked;
  const user = userData.user;

  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};

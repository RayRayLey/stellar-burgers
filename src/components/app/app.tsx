import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { Preloader } from '@ui';

import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import {
  getIngredientsSelector,
  loadingIngredientsSelector,
  errorSelector,
  getIngredients
} from '../../services/slices/ingredientsSlice';

import { useDispatch, useSelector } from '../../services/store';
import { ProtectedRoute } from '../protected-route';
import { checkUserAuth } from '../../services/slices/userSlice';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ingredients = useSelector(getIngredientsSelector);
  const isIngredientsLoading = useSelector(loadingIngredientsSelector);
  const error = useSelector(errorSelector);

  const location = useLocation();
  const backgroundLocation = location.state?.background;
  const orderNumber = location.pathname.split('/').pop();

  useEffect(() => {
    dispatch(getIngredients());
  }, [dispatch]);

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  function closeModal() {
    navigate(backgroundLocation);
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route
          path='/'
          element={
            isIngredientsLoading ? (
              <Preloader data-testid='loading' />
            ) : error ? (
              <div
                className={`${styles.error} text text_type_main-medium pt-4`}
              >
                {error}
              </div>
            ) : ingredients.length > 0 ? (
              <ConstructorPage />
            ) : (
              <div
                className={`${styles.title} text text_type_main-medium pt-4`}
              >
                Нет игредиентов
              </div>
            )
          }
        />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path='/feed/:number'
          element={
            <div className={styles.detailPageWrap}>
              <OrderInfo />
            </div>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <div className={styles.detailPageWrap}>
              <p className={`text text_type_main-large ${styles.detailHeader}`}>
                Детали ингредиента
              </p>
              <IngredientDetails />
            </div>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <div className={styles.detailPageWrap}>
                <OrderInfo />
              </div>
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={`#${orderNumber}`} onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали игредиента' onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title={`#${orderNumber}`} onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;

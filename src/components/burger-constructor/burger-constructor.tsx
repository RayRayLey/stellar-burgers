import { FC, useEffect, useMemo, useReducer, useState } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useDispatch, useSelector } from '../../services/store';

import {
  getItemsSelector,
  clear
} from '../../services/slices/constructorSlice';
import {
  currentOrderSelector,
  loadingOrderSelector,
  clearCurrent,
  orderBurger
} from '../../services/slices/ordersSlice';
import { isAuthenticatedSelector } from '../../services/slices/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const backgroundLocation = location.state?.background;

  const constructorItems = useSelector(getItemsSelector);
  const isAuthenticated = useSelector(isAuthenticatedSelector);

  const orderIngredients = constructorItems.ingredients.map(
    (ingredient) => ingredient.id
  );

  const orderRequest = useSelector(loadingOrderSelector);
  const orderModalData = useSelector(currentOrderSelector);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    dispatch(orderBurger(orderIngredients));
  };

  const closeOrderModal = () => {
    dispatch(clear());
    dispatch(clearCurrent());
    navigate(backgroundLocation);
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

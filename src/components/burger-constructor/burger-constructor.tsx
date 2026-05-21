import { FC, useEffect, useMemo, useReducer, useState } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useDispatch, useSelector } from '../../services/store';

import { getItemsSelector } from '../../services/slices/constructorSlice';
import {
  currentOrderSelector,
  loadingOrderSelector,
  modalLoadingSelector,
  orderBurger,
  clearCurrent
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

  const orderRequest = useSelector(modalLoadingSelector);
  const orderModalData = useSelector(currentOrderSelector);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const orderIngredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id
    ];

    dispatch(orderBurger(orderIngredients));
  };

  const closeOrderModal = () => {
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

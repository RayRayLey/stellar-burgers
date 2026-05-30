import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

import { addBun, addIngredient } from '../../services/slices/constructorSlice';
import { useDispatch } from '../../services/store';

import { v4 as uuidv4 } from 'uuid';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const constructorIngredient = {
      ...ingredient,
      id: `${uuidv4()}`
    };

    const handleAdd = () => {
      if (constructorIngredient.type === 'bun') {
        dispatch(addBun(constructorIngredient));
      } else {
        dispatch(addIngredient(constructorIngredient));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);

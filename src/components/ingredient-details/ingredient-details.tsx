import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

import { getIngredientsSelector } from '../../services/slices/ingredientsSlice';
import { useSelector } from '../../services/store';

import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const ingredients = useSelector(getIngredientsSelector);
  const ingredientData = useMemo(
    () => ingredients.find((ingredient) => ingredient._id === id!),
    [id, ingredients]
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};

// тесты, проверяющие работу редьюсера конструктора бургера
// при обработке экшенов добавления и удаления ингредиента.
import { beforeEach, describe, expect, test } from '@jest/globals';
import {
  constructorReducer,
  addIngredient,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient
} from '../src/services/slices/constructorSlice';

import ingredients from './ingredients.json';

describe('[constructorSlice] Проверка работы редьюсера конструктора бургера', () => {
  const mockIngredients = ingredients;

  let initialState = {
    bun: null,
    ingredients: mockIngredients
  };

  beforeEach(() => {
    initialState = {
      bun: null,
      ingredients: [...mockIngredients]
    };
  });

  test('Добавление ингредиента', () => {
    const currentState = {
      bun: null,
      ingredients: mockIngredients.slice(0, -1)
    };
    const newIngredients = constructorReducer(
      currentState,
      addIngredient(ingredients[ingredients.length - 1])
    );
    expect(newIngredients).toEqual({
      bun: null,
      ingredients: ingredients
    });
  });

  test('Удаление ингредиента', () => {
    const newIngredients = constructorReducer(
      initialState,
      removeIngredient(1)
    );
    expect(newIngredients).toEqual({
      bun: null,
      ingredients: [mockIngredients[0], mockIngredients[2]]
    });
  });

  describe('Изменение порядка ингредиентов', () => {
    test('Передвинуть ингредиент выше', () => {
      const newIngredients = constructorReducer(
        initialState,
        moveIngredientUp(1)
      );
      expect(newIngredients).toEqual({
        bun: null,
        ingredients: [
          mockIngredients[1],
          mockIngredients[0],
          mockIngredients[2]
        ]
      });
    });
    test('Передвинуть ингредиент ниже', () => {
      const newIngredients = constructorReducer(
        initialState,
        moveIngredientDown(1)
      );
      expect(newIngredients).toEqual({
        bun: null,
        ingredients: [
          mockIngredients[0],
          mockIngredients[2],
          mockIngredients[1]
        ]
      });
    });
  });
});

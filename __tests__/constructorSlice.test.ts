// тесты, проверяющие работу редьюсера конструктора бургера
// при обработке экшенов добавления и удаления ингредиента.
import { beforeEach, describe, expect, test } from '@jest/globals';
import {
  constructorReducer,
  addIngredient,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient,
  addBun,
  clear
} from '../src/services/slices/constructorSlice';

import ingredients from './ingredients.json';
import buns from './buns.json';

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

  describe('Добавление ингредиентов в конструктор бургера', () => {
    test('Добавление начинки', () => {
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

    test('Добавление булки', () => {
      const fisrtBun = constructorReducer(initialState, addBun(buns[0])); //добавляем один вид булочки
      const secondBun = constructorReducer(fisrtBun, addBun(buns[1])); // заменяем на другую булку

      expect(secondBun).toEqual({
        // должна рендериться только вторая булочка
        bun: buns[1],
        ingredients: mockIngredients
      });
    });
  });

  describe('Удаление ингредиентов из конструктора', () => {
    test('Удаление одного ингредиента', () => {
      const newIngredients = constructorReducer(
        initialState,
        removeIngredient(1)
      );
      expect(newIngredients).toEqual({
        bun: null,
        ingredients: [mockIngredients[0], mockIngredients[2]]
      });
    });

    test('Очистка конструктора', () => {
      const currentState = constructorReducer(initialState, addBun(buns[0]));
      const clearedState = constructorReducer(currentState, clear());

      expect(clearedState).toEqual({
        bun: null,
        ingredients: []
      });
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

// тесты, проверяющие обработку редьюсером экшенов,
// генерируемых при выполнении асинхронного запроса:
// экшены начала запроса,
// успешного выполнения запроса и ошибки запроса.
import { beforeEach, describe, expect, test } from '@jest/globals';
import {
  ingredientsReducer,
  getIngredients
} from '../src/services/slices/ingredientsSlice';
import ingredients from './ingredients.json';

describe('[ingredientsReducer] Обработка рудьюсером экшенов', () => {
  let initialState = {
    ingredients: [],
    isIngredientsLoading: false,
    error: null
  };
  beforeEach(() => {
    initialState = {
      ingredients: [],
      isIngredientsLoading: false,
      error: null
    };
  });
  test('Должен поменять статус загрузки на true', () => {
    const action = getIngredients.pending('request-id', undefined);
    expect(ingredientsReducer(initialState, action)).toEqual({
      ...initialState,
      isIngredientsLoading: true
    });
  });
  test('Должен записать данные в стор и поменять статус загрузки на false', () => {
    const action = getIngredients.fulfilled(ingredients, 'request-id');
    expect(ingredientsReducer(initialState, action)).toEqual({
      ingredients: ingredients,
      isIngredientsLoading: false,
      error: null
    });
  });
  test('Должен записать ошибку и поменять статус загрузки на false', () => {
    const action = getIngredients.rejected(
      new Error('Ингридиенты не загрузились'),
      'request-id',
      undefined
    );
    expect(ingredientsReducer(initialState, action)).toEqual({
      ...initialState,
      isIngredientsLoading: false,
      error: 'Ингридиенты не загрузились'
    });
  });
});

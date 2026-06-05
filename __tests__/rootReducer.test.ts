// тест, проверяющий правильную настройку и работу rootReducer:
// вызов rootReducer с undefined состоянием и экшеном,
// который не обрабатывается ни одним редьюсером
// (например, { type: 'UNKNOWN_ACTION' }),
// возвращает корректное начальное состояние хранилища.
import { describe, expect, test } from '@jest/globals';
import { rootReducer } from '../src/services/store';

import { ingredientsReducer } from '../src/services/slices/ingredientsSlice';
import { userReducer } from '../src/services/slices/userSlice';
import { ordersReducer } from '../src/services/slices/ordersSlice';
import { feedsReducer } from '../src/services/slices/feedsSlice';
import { constructorReducer } from '../src/services/slices/constructorSlice';

describe('[rootReducer] Правильная настройка и работа rootReducer', () => {
  test('Должен вернуть корректное начальное состояние хранилища', () => {
    const controlState = {
      burgerConstructor: constructorReducer(undefined, {
        type: 'UNKNOWN_ACTION'
      }),
      feeds: feedsReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      ingredients: ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      orders: ordersReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      user: userReducer(undefined, { type: 'UNKNOWN_ACTION' })
    };

    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initialState).toEqual(controlState);
  });
});

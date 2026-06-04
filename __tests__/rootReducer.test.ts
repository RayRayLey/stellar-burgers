// тест, проверяющий правильную настройку и работу rootReducer:
// вызов rootReducer с undefined состоянием и экшеном,
// который не обрабатывается ни одним редьюсером
// (например, { type: 'UNKNOWN_ACTION' }),
// возвращает корректное начальное состояние хранилища.
import { describe, expect, test } from '@jest/globals';
import { rootReducer } from '../src/services/store';

describe('[rootReducer] Правильная настройка и работа rootReducer', () => {
  test('Должен вернуть корректное начальное состояние хранилища', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(initialState).toHaveProperty('constructor');
    expect(initialState).toHaveProperty('feeds');
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('orders');
    expect(initialState).toHaveProperty('user');
  });
});

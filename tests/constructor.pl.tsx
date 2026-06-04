import { test, expect, Page } from '@playwright/test';

test.describe('Загрузка списка ингредиентов с HAR', () => {
  test('Должен загрузить ингредиенты в HAR-файл', async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await page.goto('/');

    await expect(page.getByTestId('loading')).not.toBeVisible();

    const ingredients = page.getByTestId('ingredients');
    await expect(ingredients).toBeVisible();
  });

  test('Список должен работать без реального сервера', async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients'
    });

    await page.goto('/');
    await expect(page.getByTestId('ingredients')).toBeVisible();
  });
});

test.describe('Тест добавления ингредиента из списка в конструктор', () => {
  test('Добавление булки', async ({ page }) => {
    await page.goto('/');
    const testBun = 'Флюоресцентная булка R2-D3';
    const bun = page.getByTestId('ingredient-643d69a5c3f7b9001cfa093d');

    await bun.getByText('Добавить').click();

    await expect(page.getByTestId('constructor')).toContainText(testBun);
    await expect(page.getByTestId('c-bun')).toBeVisible();
  });

  test('Добавление начинки', async ({ page }) => {
    await page.goto('/');
    const testSauce = 'Соус традиционный галактический';
    const sauce = page.getByTestId('ingredient-643d69a5c3f7b9001cfa0944');

    await sauce.getByText('Добавить').click();

    await expect(page.getByTestId('constructor')).toContainText(testSauce);
    await expect(page.getByTestId('c-ingredient')).toBeVisible();
  });
});

test.describe('Тест модального окна ингредиента', () => {
  const testIngredient = 'Кристаллы марсианских альфа-сахаридов';

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Открытие и отображение нужных данных', async ({ page }) => {
    await page.getByText(testIngredient).click();

    await expect(page.getByTestId('ingredient-modal')).toBeVisible();
    await expect(
      page
        .getByTestId('ingredient-modal')
        .getByRole('heading', { name: testIngredient })
    ).toBeVisible();
  });

  test('Закрытие по кнопке крестику', async ({ page }) => {
    await page.getByText(testIngredient).click();
    await expect(page.getByTestId('ingredient-modal')).toBeVisible();

    await page.getByTestId('close-button').click();
    await expect(page.getByTestId('ingredient-modal')).toBeHidden();
  });
});

test.describe('Тест процесса создания заказа', () => {
  const number = '106128';

  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'super-secret-auth-token',
        domain: 'localhost',
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'Lax'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'super-secret-refresh-token');
    });

    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: {
            id: '643d69a5c3f7b9001cfa0950',
            email: 'test@example.com',
            name: 'Test User'
          }
        })
      });
    });

    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          order: {
            _id: '643d69a5c3f7b9001cfa0950',
            status: 'created',
            number: parseInt(number, 10)
          },
          name: 'Краторная булка N-200i'
        })
      });
    });

    await page.routeFromHAR('./tests/hars/order.har', {
      url: '**/api/(ingredients|orders/all)**'
    });

    await page.goto('/');
    await expect(page.getByTestId('ingredients')).toBeVisible({
      timeout: 10000
    });
  });

  test.afterEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('Отображается модальное окно с верным номером заказа', async ({
    page
  }) => {
    const bun = page.getByTestId('ingredient-643d69a5c3f7b9001cfa093d');
    await expect(bun).toBeVisible();
    await bun.getByText('Добавить').click();

    const sauce = page.getByTestId('ingredient-643d69a5c3f7b9001cfa0944');
    await expect(sauce).toBeVisible();
    await sauce.getByText('Добавить').click();

    await expect(page.getByTestId('c-bun')).toBeVisible();
    await expect(page.getByTestId('c-ingredient')).toBeVisible();

    const orderButton = page.getByRole('button', { name: /Оформить заказ/i });
    await expect(orderButton).toBeEnabled();
    await orderButton.click();

    await expect(page.getByTestId('order-modal')).toContainText(number);
    await page.getByTestId('close-button').click();
  });

  test('Конструктор очищается после оформления заказа', async ({ page }) => {
    const bun = page.getByTestId('ingredient-643d69a5c3f7b9001cfa093d');
    await expect(bun).toBeVisible();
    await bun.getByText('Добавить').click();

    const sauce = page.getByTestId('ingredient-643d69a5c3f7b9001cfa0944');
    await expect(sauce).toBeVisible();
    await sauce.getByText('Добавить').click();

    await expect(page.getByTestId('c-bun')).toBeVisible();
    await expect(page.getByTestId('c-ingredient')).toBeVisible();

    const orderButton = page.getByRole('button', { name: /Оформить заказ/i });
    await expect(orderButton).toBeEnabled();
    await orderButton.click();

    await expect(page.getByTestId('order-modal')).toBeVisible();
    await page.getByTestId('close-button').click();

    await expect(page.getByTestId('constructor')).toContainText(
      'Выберите булки'
    );
    await expect(page.getByTestId('constructor')).toContainText(
      'Выберите начинку'
    );
  });
});

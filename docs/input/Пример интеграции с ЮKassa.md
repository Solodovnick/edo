# Общее описание 

Интеграционный метод «Умный платеж» в системе ЮKassa предназначен для перенаправления пользователя на страницу ЮKassa, где он выберет подходящий способ, введет данные для оплаты и подтвердит ее.

Метод будет использован в приложении … для оплаты …

# API-документация Внешней системы

​​https://yookassa.ru/developers/payment-acceptance/integration-scenarios/smart-payment

# Ограничения Внешней системы

* Максимальная сумма платежа: 250 000 ₽ (или эквивалент в другой валюте).  
* Минимальная сумма платежа: 1 ₽.  
* Лимит запросов: 180 запросов в минуту на один магазин.  
* Поддерживаемые валюты: RUB, USD, EUR (другие — по запросу).  
* Требуется HTTPS для всех запросов.

# Примечания

* Аутентификация HTTP Basic Auth [https://yookassa.ru/developers/using-api/interaction-format](https://yookassa.ru/developers/using-api/interaction-format)  
  * В качестве имени пользователя используется идентификатор магазина  
  * В качестве пароля – секретный ключ  
* Для тестирования использовалась песочница, ссылка по настройке: [https://yookassa.ru/docs/support/merchant/payments/implement/test-store](https://yookassa.ru/docs/support/merchant/payments/implement/test-store)  
* Webhook требует предварительной настройки в личном кабинете ЮKassa.  
* Для SBP-платежей добавьте параметр "payment\_method\_data": {"type": "sbp"}.

# Сценарий работы (Use Case)

**Системы:**

* Клиент (веб или мобильное приложение ShipEasyGA).  
* Backend ShipEasyGA (REST API).  
* API ЮKassa.

**Предусловие:** Клиент подтвердил заказ и перешел к оплате.

**Алгоритм работы:**

1. Формирование платежа:  
   * Backend ShipEasyGA создает запрос к API ЮKassa с параметрами:  
     * Сумма (`amount`);  
     * Валюта (`currency`);  
     * Описание заказа (`description`);  
     * ID заказа в системе (`order_id`);  
     * Данные клиента (email, телефон).  
2. Пример запроса:

`{`

  `"amount": {`

    `"value": "1500.00",`

    `"currency": "RUB"`

  `},`

  `"confirmation": {`

    `"type": "redirect",`

    `"return_url": "https://shipeasyga.com/order/12345/success"`

  `},`

  `"description": "Оплата заказа №12345",`

  `"metadata": {`

    `"order_id": "12345"`

  `}`

3. Ответ от ЮKassa:  
   * В ответ приходит URL для перенаправления клиента на страницу оплаты.  
   * Пример ответа:

`{`

  `"id": "22d6d597-000f-5000-9000-145f6df21d6f",`

  `"status": "pending",`

  `"confirmation_url": "https://yoomoney.ru/api-pages/v2/payment-confirm/epl?orderId=22d6d597..."`

`}`

4. Перенаправление клиента:  
   * Клиент переходит по `confirmation_url` и завершает оплату.  
5. Обработка уведомления:  
   * ЮKassa отправляет webhook на `https://shipeasyga.com/api/v1/payment/webhook` с результатом платежа.  
   * Backend ShipEasyGA обновляет статус заказа в БД.

**Альтернативные сценарии:**

* Ошибка оплаты:  
  * Клиент возвращается на страницу заказа с сообщением об ошибке.  
* Истекло время сессии:  
  * Платеж отменяется, клиент может повторить попытку.

# Техническая реализация метода

**Запрос:**

* Тип метода: POST  
* URL: **`https://api.yookassa.ru/v3/payments`**  
* Headers:  
  * **`Content-Type: application/json`**  
  * **`Authorization: Basic <Base64(shopId:apiKey)>`**  
* Тело запроса:

**`{`**  
  **`"amount": {`**  
    **`"value": "1500.00",`**  
    **`"currency": "RUB"`**  
  **`},`**  
  **`"confirmation": {`**  
    **`"type": "redirect",`**  
    **`"return_url": "https://shipeasyga.com/order/12345/success"`**  
  **`},`**  
  **`"description": "Оплата заказа №12345"`**  
**`}`**

**Ответ:**

* Успешный ответ:

**`{`**  
  **`"id": "22d6d597-000f-5000-9000-145f6df21d6f",`**  
  **`"status": "pending",`**  
  **`"confirmation_url": "https://yoomoney.ru/api-pages/v2/payment-confirm/epl?orderId=22d6d597..."`**

**`}`**

* Ошибка (например, неверные данные):

**`{`**  
  **`"code": "invalid_request",`**  
  **`"description": "Amount must be a positive number"`**  
**`}`**

# Требования к обработке ошибок

* HTTP-401: Неверные авторизационные данные.  
* HTTP-402: Недостаточно средств.  
* HTTP-429: Превышен лимит запросов.  
* Webhook: Всегда отвечать **`HTTP-200` на уведомления, даже если обработка временно невозможна.**

# Маппинг данных

| Параметр | В API ShipEasyGA | Обязателен | В API ЮKassa | Комментарий |
| :---- | :---- | :---- | :---- | :---- |
| Сумма | `amount.value` | Да | `amount.value` | Формат: "1500.00". |
| Валюта | `amount.currency` | Да | `amount.currency` | RUB, USD, EUR. |
| Описание платежа | `description` | Да | `description` | Макс. 128 символов. |
| ID заказа | `metadata.order_id` | Да | `metadata.order_id` | Уникальный ID в системе. |
| URL возврата | `confirmation.return_url` | Да | `confirmation.return_url` | HTTPS обязателен. |


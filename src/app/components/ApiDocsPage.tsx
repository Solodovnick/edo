import { useMemo } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import openApiSpec from '../../openapi/edo-backend.openapi.json';

/**
 * Интерактивная документация OpenAPI 3 + Try it out (мок: Vite `edoApiMockPlugin`).
 */
export function ApiDocsPage() {
  const spec = useMemo(() => openApiSpec as Record<string, unknown>, []);

  return (
    <div className="edo-swagger-ui min-h-[calc(100vh-60px)] bg-white text-left">
      <div className="border-b border-gray-200 bg-violet-50 px-4 py-2 text-sm text-gray-700">
        Базовый URL мока: <code className="rounded bg-white px-1.5 py-0.5">/api/v1</code>
        {' · '}
        Маппинг кабинетов (Регистрация / Процесс / Руководитель / Аудит) → UC и словарь данных:{' '}
        <code className="rounded bg-white px-1.5 py-0.5">docs/api-cabinets.md</code>
        {' · '}
        Симуляция ошибок: заголовок <code className="rounded bg-white px-1.5 py-0.5">X-Debug-Status</code> ={' '}
        <code>400</code> … <code>500</code>
        {' · '}
        JWT для <code>/me</code>: <code className="rounded bg-white px-1.5 py-0.5">Authorization: Bearer test</code>
      </div>
      <SwaggerUI
        spec={spec}
        docExpansion="list"
        defaultModelExpandDepth={2}
        defaultModelsExpandDepth={2}
        displayRequestDuration
        tryItOutEnabled
        persistAuthorization
        filter
        showExtensions
        showCommonExtensions
      />
    </div>
  );
}

import { ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';
import { useState } from 'react';

export function ArticleDetail() {
  const [wasHelpful, setWasHelpful] = useState<boolean | null>(null);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        <span className="hover:text-[#0051BA] cursor-pointer">Справка</span>
        <span className="mx-2">&gt;</span>
        <span className="hover:text-[#0051BA] cursor-pointer">База знаний</span>
        <span className="mx-2">&gt;</span>
        <span className="hover:text-[#0051BA] cursor-pointer">Работа с обращениями</span>
        <span className="mx-2">&gt;</span>
        <span className="text-gray-800">Как создать новое обращение</span>
      </div>

      {/* Заголовок */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Как создать новое обращение</h2>
        <div className="text-sm text-gray-500">
          Опубликовано 15.01.2023 | Обновлено 10.01.2026 | Автор: Вика П. (системный аналитик)
        </div>
      </div>

      {/* Содержимое статьи */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="prose max-w-none">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Способ 1: Через web-интерфейс</h3>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-6">
            <li>Перейдите на вкладку "Обращения"</li>
            <li>Нажмите кнопку "✚ Новое обращение"</li>
            <li>
              Заполните форму:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Клиент:</strong> выберите из списка dropdown</li>
                <li><strong>Тип:</strong> выберите категорию dropdown</li>
                <li><strong>Канал:</strong> письмо/звонок/личное посещение dropdown</li>
                <li><strong>Тема:</strong> опишите кратко text input</li>
                <li><strong>Описание:</strong> полное описание проблемы textarea</li>
              </ul>
            </li>
            <li>Нажмите "Создать обращение"</li>
          </ol>

          <div className="bg-blue-50 border-l-4 border-[#0051BA] p-4 mb-6">
            <div className="flex items-start gap-2">
              <span className="text-lg">💡</span>
              <div>
                <div className="font-medium text-gray-800">Совет:</div>
                <div className="text-sm text-gray-700">
                  Используйте готовые категории для быстрого создания обращения.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-[#FFAA00] p-4 mb-6">
            <div className="flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <div>
                <div className="font-medium text-gray-800">Важно:</div>
                <div className="text-sm text-gray-700">
                  Обращение от регулятора должно быть создано в течение 30 минут после получения.
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-800 mb-3">Способ 2: Через email</h3>
          <p className="text-gray-700 mb-6">
            Переправьте письмо на адрес <code className="bg-gray-100 px-2 py-1 rounded text-sm">edobank@bank.ru</code> и система автоматически создаст обращение.
          </p>

          <h3 className="text-lg font-bold text-gray-800 mb-3">Способ 3: Через API</h3>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-xs text-gray-500 mb-2">Пример кода</div>
            <pre className="text-sm font-mono text-gray-800">
{`POST /api/v1/complaints/create
{
  "customer_id": "12345",
  "type": "written",
  "subject": "Задержка платежа"
}`}
            </pre>
          </div>
        </div>

        {/* Была ли статья полезна */}
        <div className="border-t border-gray-200 pt-6 mt-8">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-800 mb-3">
              Была ли эта статья полезна?
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setWasHelpful(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  wasHelpful === true
                    ? 'bg-[#00AA44] text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                Да
              </button>
              <button
                onClick={() => setWasHelpful(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  wasHelpful === false
                    ? 'bg-[#DD0000] text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                Нет
              </button>
            </div>
            {wasHelpful === false && (
              <div className="mt-4">
                <textarea
                  placeholder="Чего не хватает в этой статье?"
                  rows={3}
                  className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
                />
                <button className="mt-2 px-4 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003d8f] transition-colors text-sm">
                  Отправить отзыв
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Статьи по теме */}
        <div className="border-t border-gray-200 pt-6 mt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Статьи по теме:</h3>
          <div className="space-y-2">
            <a href="#" className="block text-[#0051BA] hover:underline text-sm">
              → Как проверить статус обращения
            </a>
            <a href="#" className="block text-[#0051BA] hover:underline text-sm">
              → Как добавить заметку к обращению
            </a>
            <a href="#" className="block text-[#0051BA] hover:underline text-sm">
              → Как эскалировать обращение
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

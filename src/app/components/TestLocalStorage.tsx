import { useState, useEffect } from 'react';
import { appealStorage } from '../../services/appealStorage';
import { Trash2, RefreshCw } from 'lucide-react';

export function TestLocalStorage() {
  const [appeals, setAppeals] = useState(appealStorage.getAllAppeals());

  const loadAppeals = () => {
    setAppeals(appealStorage.getAllAppeals());
  };

  const clearAll = () => {
    if (window.confirm('Удалить все обращения из LocalStorage?')) {
      appealStorage.clearAll();
      loadAppeals();
    }
  };

  useEffect(() => {
    loadAppeals();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Обращения в LocalStorage ({appeals.length})
            </h1>
            <div className="flex gap-2">
              <button
                onClick={loadAppeals}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Обновить
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Очистить всё
              </button>
            </div>
          </div>

          {appeals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Нет сохранённых обращений</p>
              <p className="text-sm text-gray-400 mt-2">
                Создайте обращение в кабинете регистратора
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {appeals.map((appeal) => (
                <div
                  key={appeal.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-purple-700">
                        №{appeal.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {appeal.regDate} | {appeal.type} | {appeal.category}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                      {appeal.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Заявитель:</span>{' '}
                      {appeal.applicantName !== 'N/A'
                        ? appeal.applicantName
                        : appeal.organizationName}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Ответственный:</span>{' '}
                      {appeal.responsible}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Дедлайн:</span>{' '}
                      {appeal.deadline}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Содержание:</span>
                      <p className="mt-1 text-gray-600">{appeal.content}</p>
                    </div>
                    {appeal.solution && (
                      <div>
                        <span className="font-medium text-gray-700">Решение:</span>
                        <p className="mt-1 text-gray-600">{appeal.solution}</p>
                      </div>
                    )}
                    {appeal.response && (
                      <div>
                        <span className="font-medium text-gray-700">Ответ:</span>
                        <p className="mt-1 text-gray-600">{appeal.response}</p>
                      </div>
                    )}
                    {appeal.updatedAt && (
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        Обновлено: {new Date(appeal.updatedAt).toLocaleString('ru-RU')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

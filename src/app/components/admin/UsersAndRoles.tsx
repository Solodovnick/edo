import { Plus, Edit, Trash2, Key, Activity, MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  role: string;
  department: string;
  activationDate: string;
}

export function UsersAndRoles() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');

  const users: User[] = [
    {
      id: '1',
      name: 'Иванов Алексей Иванович',
      email: 'ivanov@bank.ru',
      status: 'active',
      role: 'Обработчик',
      department: 'Жалобы',
      activationDate: '15.01.2024',
    },
    {
      id: '2',
      name: 'Петров Сергей Петрович',
      email: 'petrov@bank.ru',
      status: 'active',
      role: 'Администратор',
      department: 'Все',
      activationDate: '10.12.2023',
    },
    {
      id: '3',
      name: 'Сидорова Мария Александровна',
      email: 'sidorova@bank.ru',
      status: 'inactive',
      role: 'Аналитик',
      department: 'Аналитика',
      activationDate: '20.03.2024',
    },
  ];

  const roles = [
    { name: 'Администратор', description: 'Полный доступ ко всем функциям', users: 3, permissions: 15 },
    { name: 'Аналитик', description: 'Доступ к отчётам и аналитике', users: 5, permissions: 8 },
    { name: 'Обработчик', description: 'Обработка обращений', users: 12, permissions: 6 },
    { name: 'Диспетчер', description: 'Распределение очереди', users: 4, permissions: 7 },
    { name: 'Менеджер', description: 'Надзор за командой', users: 6, permissions: 10 },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Управление пользователями и ролями</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#00AA44] text-white rounded-lg hover:bg-[#008833] transition-colors">
            <Plus className="w-4 h-4" />
            Пригласить пользователя
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003d8f] transition-colors">
            <Plus className="w-4 h-4" />
            Создать роль
          </button>
        </div>
      </div>

      {/* Вкладки */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-2 text-sm font-medium transition-colors ${
            activeTab === 'users'
              ? 'text-[#0051BA] border-b-2 border-[#0051BA]'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Пользователи
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`pb-3 px-2 text-sm font-medium transition-colors ${
            activeTab === 'roles'
              ? 'text-[#0051BA] border-b-2 border-[#0051BA]'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Роли
        </button>
      </div>

      {/* Таблица пользователей */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#0051BA] border-gray-300 rounded focus:ring-[#0051BA]"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Имя
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Роль
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Подразделение
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Дата активации
                </th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#0051BA] border-gray-300 rounded focus:ring-[#0051BA]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#0051BA] rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-[#00AA44]' : 'bg-[#DD0000]'}`} />
                      <span className="text-sm text-gray-700">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{user.role}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{user.department}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.activationDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-200 rounded transition-colors" title="Edit">
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded transition-colors" title="Reset Password">
                        <Key className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded transition-colors" title="View Activity">
                        <Activity className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Таблица ролей */}
      {activeTab === 'roles' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Имя роли
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Описание
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Кол-во пользователей
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Разрешения
                </th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {roles.map((role) => (
                <tr key={role.name} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{role.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{role.description}</td>
                  <td className="px-4 py-3 text-center text-sm font-bold text-gray-800">{role.users}</td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">{role.permissions} разрешений</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-200 rounded transition-colors" title="Edit">
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { Mail, Phone, MessageSquare } from 'lucide-react';

export function ContactsSupport() {
  const contacts = [
    {
      title: 'ОСНОВНАЯ ПОДДЕРЖКА',
      icon: Phone,
      email: 'support@edobank.ru',
      phone: '+7 (495) 123-45-67',
      hours: 'Пн-Пт 9:00-18:00 МСК',
      responseTime: 'Ответ в течение 2 часов',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      title: 'СРОЧНАЯ ПОДДЕРЖКА',
      subtitle: '(для регуляторных запросов)',
      icon: Mail,
      email: 'urgent@edobank.ru',
      phone: '+7 (495) 765-43-21',
      hours: 'Пн-Вс 24/7',
      responseTime: 'Ответ в течение 30 минут',
      color: 'bg-red-50 border-red-200',
      urgent: true,
    },
    {
      title: 'ТЕХНИЧЕСКАЯ ПОДДЕРЖКА',
      subtitle: '(интеграции, API, настройки)',
      icon: MessageSquare,
      email: 'tech@edobank.ru',
      slack: '#support-engineering',
      hours: 'Вт-Чт 10:00-16:00',
      responseTime: 'Ответ в течение 4 часов',
      color: 'bg-green-50 border-green-200',
    },
  ];

  const departments = [
    { name: 'Карточные услуги', contact: 'cards@edobank.ru', hours: 'Пн-Пт 9:00-18:00', response: '2 часа' },
    { name: 'Кредиты', contact: 'credits@edobank.ru', hours: 'Пн-Пт 9:00-18:00', response: '4 часа' },
    { name: 'Операции', contact: 'operations@edobank.ru', hours: 'Пн-Пт 8:00-20:00', response: '1 час' },
    { name: 'Жалобы', contact: 'complaints@edobank.ru', hours: 'Пн-Сб 9:00-21:00', response: '30 мин' },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        <span className="hover:text-[#0051BA] cursor-pointer">Справка</span>
        <span className="mx-2">&gt;</span>
        <span className="text-gray-800">Контакты поддержки</span>
      </div>

      {/* Заголовок */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#0051BA] mb-2">Контакты поддержки</h2>
      </div>

      {/* Карточки подразделений */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {contacts.map((contact, index) => {
          const Icon = contact.icon;
          return (
            <div
              key={index}
              className={`border-2 rounded-lg p-6 ${contact.color} ${
                contact.urgent ? 'shadow-lg' : 'shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon className="w-6 h-6 text-[#0051BA]" />
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">{contact.title}</h3>
                  {contact.subtitle && (
                    <p className="text-xs text-gray-600">{contact.subtitle}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="text-sm">
                  <span className="text-gray-600">Email:</span>{' '}
                  <a href={`mailto:${contact.email}`} className="text-[#0051BA] hover:underline">
                    {contact.email}
                  </a>
                </div>
                {contact.phone && (
                  <div className="text-sm">
                    <span className="text-gray-600">Телефон:</span>{' '}
                    <a href={`tel:${contact.phone}`} className="text-[#0051BA] hover:underline">
                      {contact.phone}
                    </a>
                  </div>
                )}
                {contact.slack && (
                  <div className="text-sm">
                    <span className="text-gray-600">Slack:</span>{' '}
                    <span className="text-[#0051BA]">{contact.slack}</span>
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  Доступно: {contact.hours}
                </div>
              </div>

              <div className="text-sm font-medium text-[#00AA44] mb-4">
                {contact.responseTime}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003d8f] transition-colors text-sm">
                  <Mail className="w-4 h-4" />
                  Написать
                </button>
                {contact.phone && (
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[#0051BA] text-[#0051BA] rounded-lg hover:bg-blue-50 transition-colors text-sm">
                    <Phone className="w-4 h-4" />
                    Позвонить
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Таблица расширенных контактов */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-800">Контакты подразделений</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                Подразделение
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                Контакт
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                Рабочие часы
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                Среднее время ответа
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {departments.map((dept, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{dept.name}</td>
                <td className="px-6 py-4 text-sm">
                  <a href={`mailto:${dept.contact}`} className="text-[#0051BA] hover:underline">
                    {dept.contact}
                  </a>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{dept.hours}</td>
                <td className="px-6 py-4 text-sm font-medium text-[#00AA44]">{dept.response}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

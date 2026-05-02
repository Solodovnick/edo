import { useState } from 'react';
import { ApplicationsFilters } from './ApplicationsFilters';
import { ApplicationsTable } from './ApplicationsTable';
import { ApplicationDetail } from './ApplicationDetail';

export function Applications() {
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);

  // Mock данные для обращений
  const applications = [
    {
      id: '1',
      number: '12345',
      icon: 'mail' as const,
      client: 'Иванов Иван Иванович',
      type: 'Жалоба',
      subject: 'Задержка платежа по карте',
      status: 'in-progress' as const,
      sla: 'Осталось 2 дня',
      slaStatus: 'ok' as const,
      assignedTo: 'Петров С.П.',
      department: 'Карточные услуги',
      createdAt: '17.01.2026 14:30',
      description: 'Клиент сообщает о задержке зачисления платежа на карту. Операция была выполнена 15.01.2026, но средства до сих пор не поступили.',
    },
    {
      id: '2',
      number: '12346',
      icon: 'building' as const,
      client: 'ООО "Рога и Копыта"',
      type: 'Регуляторный запрос',
      subject: 'Запрос документов по счёту',
      status: 'new' as const,
      sla: 'Осталось 18 часов',
      slaStatus: 'warning' as const,
      assignedTo: '',
      department: 'Регуляторная работа',
      createdAt: '17.01.2026 10:00',
      description: 'Центральный банк запрашивает документы по счёту клиента за период с 01.01.2026 по 15.01.2026.',
    },
    {
      id: '3',
      number: '12347',
      icon: 'phone' as const,
      client: 'Сидорова Анна Петровна',
      type: 'Запрос',
      subject: 'Вопрос по комиссии',
      status: 'waiting' as const,
      sla: 'Осталось 5 дней',
      slaStatus: 'ok' as const,
      assignedTo: 'Иванов А.И.',
      department: 'Карточные услуги',
      createdAt: '16.01.2026 16:45',
      description: 'Клиент не понимает, почему была списана комиссия за обслуживание карты.',
    },
    {
      id: '4',
      number: '12348',
      icon: 'mail' as const,
      client: 'Петров Петр Петрович',
      type: 'Жалоба',
      subject: 'Отказ в кредите без объяснения причин',
      status: 'in-progress' as const,
      sla: 'Нарушено 3 часа',
      slaStatus: 'violated' as const,
      assignedTo: 'Сидорова М.А.',
      department: 'Кредиты',
      createdAt: '15.01.2026 09:20',
      description: 'Клиент получил отказ в выдаче кредита, но причины не были разъяснены сотрудником банка.',
    },
    {
      id: '5',
      number: '12349',
      icon: 'phone' as const,
      client: 'Козлова Мария Ивановна',
      type: 'Жалоба',
      subject: 'Грубость сотрудника',
      status: 'review' as const,
      sla: 'Осталось 1 день',
      slaStatus: 'warning' as const,
      assignedTo: 'Николаев Д.В.',
      department: 'Жалобы',
      createdAt: '16.01.2026 11:15',
      description: 'Клиент жалуется на грубое обращение сотрудника при посещении отделения банка.',
    },
    {
      id: '6',
      number: '12350',
      icon: 'mail' as const,
      client: 'ИП Смирнов А.В.',
      type: 'Запрос',
      subject: 'Изменение условий по РКО',
      status: 'new' as const,
      sla: 'Осталось 4 дня',
      slaStatus: 'ok' as const,
      assignedTo: '',
      department: 'Операции',
      createdAt: '17.01.2026 13:00',
      description: 'Клиент хочет изменить тариф по расчетно-кассовому обслуживанию.',
    },
    {
      id: '7',
      number: '12351',
      icon: 'building' as const,
      client: 'Федеральная налоговая служба',
      type: 'Регуляторный запрос',
      subject: 'Запрос выписок по счетам',
      status: 'in-progress' as const,
      sla: 'Осталось 12 часов',
      slaStatus: 'warning' as const,
      assignedTo: 'Павлов К.С.',
      department: 'Регуляторная работа',
      createdAt: '16.01.2026 14:30',
      description: 'ФНС запрашивает выписки по счетам организации за последний квартал.',
    },
    {
      id: '8',
      number: '12352',
      icon: 'phone' as const,
      client: 'Волков Сергей Михайлович',
      type: 'Жалоба',
      subject: 'Технический сбой в мобильном приложении',
      status: 'done' as const,
      sla: 'Завершено в срок',
      slaStatus: 'ok' as const,
      assignedTo: 'Федоров И.П.',
      department: 'IT-поддержка',
      createdAt: '15.01.2026 08:00',
      description: 'Клиент не мог войти в мобильное приложение банка из-за технического сбоя.',
    },
    {
      id: '9',
      number: '12353',
      icon: 'mail' as const,
      client: 'Михайлова Елена Сергеевна',
      type: 'Запрос',
      subject: 'Вопрос по ипотечному кредиту',
      status: 'waiting' as const,
      sla: 'Осталось 3 дня',
      slaStatus: 'ok' as const,
      assignedTo: 'Орлова Т.Н.',
      department: 'Кредиты',
      createdAt: '16.01.2026 15:20',
      description: 'Клиент интересуется возможностью досрочного погашения ипотечного кредита.',
    },
    {
      id: '10',
      number: '12354',
      icon: 'phone' as const,
      client: 'Новиков Андрей Владимирович',
      type: 'Жалоба',
      subject: 'Несанкционированное списание средств',
      status: 'in-progress' as const,
      sla: 'Нарушено 1 день',
      slaStatus: 'violated' as const,
      assignedTo: 'Соколов В.А.',
      department: 'Безопасность',
      createdAt: '14.01.2026 17:00',
      description: 'Клиент обнаружил несанкционированное списание средств с карты и требует возврата.',
    },
    {
      id: '11',
      number: '12355',
      icon: 'mail' as const,
      client: 'Борисов Дмитрий Николаевич',
      type: 'Запрос',
      subject: 'Открытие вклада',
      status: 'new' as const,
      sla: 'Осталось 6 дней',
      slaStatus: 'ok' as const,
      assignedTo: '',
      department: 'Вклады и депозиты',
      createdAt: '17.01.2026 12:30',
      description: 'Клиент хочет открыть вклад и интересуется текущими процентными ставками.',
    },
    {
      id: '12',
      number: '12356',
      icon: 'phone' as const,
      client: 'Алексеева Ольга Витальевна',
      type: 'Жалоба',
      subject: 'Долгое ожидание в отделении',
      status: 'review' as const,
      sla: 'Осталось 2 дня',
      slaStatus: 'ok' as const,
      assignedTo: 'Кузнецов Н.Л.',
      department: 'Жалобы',
      createdAt: '16.01.2026 10:45',
      description: 'Клиент жалуется на длительное ожидание в очереди в отделении банка.',
    },
  ];

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Левая панель с фильтрами */}
      <ApplicationsFilters onFilterChange={() => {}} />

      {/* Таблица обращений */}
      <ApplicationsTable
        applications={applications}
        onApplicationClick={setSelectedApplication}
      />

      {/* Детальное окно */}
      {selectedApplication && (
        <ApplicationDetail
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
}
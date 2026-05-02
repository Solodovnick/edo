import { useState, useEffect } from 'react';
import { 
  Phone, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Bell,
  Plus,
  ArrowLeft,
  Paperclip,
  MessageSquare,
  Building2,
  Search,
  User,
  MapPin,
  Mail,
  Calendar,
  Menu,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { appealStorage } from '../../../services/appealStorage';

// Mock data for appeals list
const mockAppeals = [
  {
    id: '123123223',
    regDate: '13/08/26',
    category: 'Письменное',
    status: 'В работе',
    deadline: '26/08/26',
    responsible: 'Расул Рамазанов',
    applicantName: 'N/A',
    organizationName: 'Рога и копыта',
    address: 'Город Кокшино, Улица Кирюхина, д.23, кв. 12',
    cbs: 'N/A',
    type: 'Юр лицо',
    isMine: true,
    content: 'Поступила жалоба на несоответствие условий договора кредитования фактическим условиям, указанным при оформлении. Клиент утверждает, что процентная ставка была изменена без его согласия.',
    solution: 'Проведена проверка документов по договору №12345. Выявлено, что изменение ставки было произведено согласно п.4.2 договора при изменении ключевой ставки ЦБ. Клиенту направлено письменное разъяснение с приложением выписки из договора.',
    response: 'Уважаемый клиент!\n\nПо результатам рассмотрения Вашего обращения сообщаем следующее:\n\nИзменение процентной ставки по кредитному договору №12345 от 15.03.2026 произведено в соответствии с пунктом 4.2 договора, предусматривающим корректировку ставки при изменении ключевой ставки Центрального Банка РФ.\n\nС уважением,\nОтдел по работе с клиентами'
  },
  {
    id: '123123444',
    regDate: '14/08/26',
    category: 'Устное',
    status: 'В работе',
    deadline: '26/08/26',
    responsible: 'Александр Солодовников',
    applicantName: 'Дудченко Л.В.',
    organizationName: 'N/A',
    address: 'N/A',
    cbs: 'N/A',
    type: 'Физ лицо',
    isMine: true,
    content: 'Клиент сообщает о несанкционированном списании средств с карточного счета в размере 5000 рублей. Операция была совершена 13.08.2026 в 23:45. Клиент утверждает, что карта находилась при нём.',
    solution: 'Проведен анализ транзакции. Операция совершена через мобильное приложение с авторизацией по SMS-коду. IP-адрес соответствует обычному местоположению клиента. Проведена беседа с клиентом - выяснилось, что покупку совершил член семьи с ведома клиента. Рекомендовано настроить лимиты в мобильном приложении.',
    response: 'Уважаемая Людмила Владимировна!\n\nВаше обращение рассмотрено. Операция на сумму 5000 рублей была проведена через мобильное приложение банка с подтверждением SMS-кодом. После дополнительного разбирательства установлено, что операция была совершена членом Вашей семьи.\n\nДля предотвращения подобных ситуаций рекомендуем настроить лимиты операций в мобильном приложении.\n\nС уважением,\nСлужба поддержки клиентов'
  },
  {
    id: '123134444',
    regDate: '14/08/26',
    category: 'Письменное',
    status: 'Запрос в БЛ',
    deadline: '26/08/26',
    responsible: 'Александр Солодовников',
    applicantName: 'N/A',
    organizationName: 'N/A',
    address: 'N/A',
    cbs: 'Центробанк',
    type: 'Юрлицо',
    isMine: true,
    content: 'Запрос от ЦБ РФ о предоставлении информации по кредитным операциям юридических лиц за 2 квартал 2026 года. Требуется предоставить детализацию по кредитам свыше 10 млн рублей.',
    solution: 'Подготовлен отчет по запрошенной информации. Данные выгружены из АБС, проведена сверка с бухгалтерией. Отчет согласован с юридическим отделом и главным бухгалтером. Направлен официальный ответ с электронной подписью через систему СЭДО ЦБ.',
    response: 'В Центральный Банк Российской Федерации\n\nОтвет на запрос №ЦБ-2026-0845 от 12.08.2026\n\nНаправляем запрошенную информацию по кредитным операциям юридических лиц за 2 квартал 2026 года согласно приложению.\n\nГенеральный директор\n[Подпись]\n[Печать]'
  },
  {
    id: '123145555',
    regDate: '15/08/26',
    category: 'Устное',
    status: 'В работе',
    deadline: '28/08/26',
    responsible: 'Расул Рамазанов',
    applicantName: 'Петров А.С.',
    organizationName: 'N/A',
    address: 'N/A',
    cbs: 'N/A',
    type: 'Физ лицо',
    isMine: true,
    content: 'Клиент не может получить доступ к мобильному приложению банка. Пароль сброшен несколько раз, но вход не выполняется. Сообщается ошибка "Неверные учетные данные".',
    solution: 'Проверка показала, что учетная запись клиента была заблокирована системой безопасности после 5 неудачных попыток входа. Выполнена разблокировка аккаунта, сброшен пароль, отправлен новый временный пароль на номер телефона клиента. Клиент успешно авторизовался и сменил пароль.',
    response: 'Уважаемый Александр Сергеевич!\n\nПроблема с доступом к мобильному приложению решена. Ваша учетная запись была временно заблокирована системой безопасности.\n\nМы выполнили разблокировку и отправили Вам новый временный пароль. Пожалуйста, смените его при первом входе.\n\nС уважением,\nТехническая поддержка'
  },
  {
    id: '123156666',
    regDate: '16/08/26',
    category: 'Письменное',
    status: 'Ожидает ответа',
    deadline: '29/08/26',
    responsible: 'Иванова М.П.',
    applicantName: 'N/A',
    organizationName: 'ООО Ромашка',
    address: 'Москва, ул. Ленина, д.10',
    cbs: 'N/A',
    type: 'Юр лицо',
    isMine: true,
    content: 'Организация запрашивает изменение условий кредитования: продление срока кредита на 12 месяцев в связи с временными финансовыми трудностями. Предоставлены финансовые документы, подтверждающие стабильность бизнеса.',
    solution: 'Проведен финансовый анализ деятельности организации. Запрошены дополнительные документы: бухгалтерский баланс, отчет о движении денежных средств. Проведено совещание с кредитным комитетом. Принято решение об одобрении реструктуризации с сохранением процентной ставки.',
    response: 'Уважаемые партнеры!\n\nВаше обращение о реструктуризации кредита рассмотрено Кредитным комитетом банка.\n\nСообщаем, что банк готов пойти навстречу и продлить срок кредитования на 12 месяцев с сохранением текущей процентной ставки.\n\nДля оформления дополнительного соглашения просим связаться с Вашим персональным менеджером.\n\nС уважением,\nКредитный отдел'
  },
  {
    id: '123167777',
    regDate: '17/08/26',
    category: 'Устное',
    status: 'Требует уточнения',
    deadline: '30/08/26',
    responsible: 'Смирнова О.А.',
    applicantName: 'Козлова Е.П.',
    organizationName: 'N/A',
    address: 'N/A',
    cbs: 'N/A',
    type: 'Физ лицо',
    isMine: true,
    content: 'Клиент хочет оформить вклад на льготных условиях для пенсионеров, но утверждает, что сотрудник отделения отказал без объяснения причин. Клиент недоволен качеством обслуживания.',
    solution: 'Проведена беседа с сотрудником отделения - выяснилось недопонимание. Клиент не предоставил пенсионное удостоверение, поэтому льготная ставка не могла быть применена автоматически. Клиенту разъяснены условия, назначена повторная встреча в отделении с подготовленными документами.',
    response: 'Уважаемая Елена Петровна!\n\nПриносим извинения за возникшее недопонимание.\n\nДля оформления вклада на льготных условиях для пенсионеров необходимо предоставить пенсионное удостоверение или справку из ПФР.\n\nМы будем рады видеть Вас в нашем отделении с необходимыми документами для оформления вклада на выгодных условиях.\n\nС уважением,\nОтдел вкладов'
  },
  {
    id: '123178888',
    regDate: '18/08/26',
    category: 'Письменное',
    status: 'В работе',
    deadline: '31/08/26',
    responsible: 'Васильев П.Р.',
    applicantName: 'N/A',
    organizationName: 'ИП Сидоров',
    address: 'СПБ, Невский пр., д.45',
    cbs: 'N/A',
    type: 'Юр лицо',
    isMine: true,
    content: 'Индивидуальный предприниматель сообщает о задержке зачисления платежа от контрагента. Платеж был отправлен 3 дня назад, но до сих пор не поступил на расчетный счет.',
    solution: 'Проведена проверка платежа по системе. Обнаружено, что платеж находится в статусе "Требует уточнения" из-за несоответствия ИНН в платежном поручении. Связались с банком отправителя, платеж отозван для корректировки. Клиент уведомлен о необходимости сообщить контрагенту правильный ИНН.',
    response: 'Уважаемый клиент!\n\nПлатеж от Вашего контрагента задержан из-за технической ошибки: в платежном поручении указан неверный ИНН получателя.\n\nПлатеж возвращен в банк отправителя для корректировки. Просим Вас связаться с контрагентом и сообщить корректные реквизиты.\n\nПравильный ИНН: 7701234567\n\nС уважением,\nОтдел расчетов'
  },
  {
    id: '123189999',
    regDate: '19/08/26',
    category: 'Устное',
    status: 'В работе',
    deadline: '01/09/26',
    responsible: 'Николаев С.М.',
    applicantName: 'Фёдорова М.А.',
    organizationName: 'N/A',
    address: 'N/A',
    cbs: 'N/A',
    type: 'Физ лицо',
    isMine: true,
    content: 'Клиент сообщает, что потерял банковскую карту во время поездки в другой город. Просит немедленно заблокировать карту и оформить перевыпуск с доставкой в отделение по месту пребывания.',
    solution: 'Карта заблокирована немедленно после обращения. Оформлен заказ на перевыпуск карты с доставкой в ближайшее отделение банка по указанному клиентом адресу. Срок изготовления - 5 рабочих дней. Клиенту предложена временная виртуальная карта для совершения онлайн-покупок.',
    response: 'Уважаемая Мария Андреевна!\n\nВаша карта заблокирована. Перевыпуск оформлен, новая карта будет готова через 5 рабочих дней.\n\nВы можете получить её в отделении банка по адресу: г. Екатеринбург, ул. Малышева, д. 36.\n\nДо получения новой карты Вы можете использовать виртуальную карту в мобильном приложении.\n\nС уважением,\nКарточный отдел'
  },
  {
    id: '123190000',
    regDate: '20/08/26',
    category: 'Письменное',
    status: 'В работе',
    deadline: '02/09/26',
    responsible: 'Морозова Л.И.',
    applicantName: 'N/A',
    organizationName: 'ООО ТехноПром',
    address: 'Казань, ул. Баумана, д.58',
    cbs: 'N/A',
    type: 'Юр лицо',
    isMine: true,
    content: 'Организация запрашивает информацию об условиях кредитования для приобретения производственного оборудования стоимостью 25 млн рублей. Интересуют сроки рассмотрения заявки и необходимый пакет документов.',
    solution: 'Подготовлено коммерческое предложение с условиями кредитования: ставка 12% годовых, срок до 5 лет, аванс от 20%. Направлен список необходимых документов. Назначена встреча с кредитным менеджером для детального обсуждения. Проведен предварительный анализ финансового состояния организации - положительный.',
    response: 'Уважаемые партнеры!\n\nБлагодарим за интерес к услугам нашего банка.\n\nНаправляем Вам коммерческое предложение по кредитованию покупки оборудования:\n- Сумма: до 25 млн руб.\n- Ставка: 12% годовых\n- Срок: до 5 лет\n- Первоначальный взнос: от 20%\n\nПакет документов и условия рассмотрения заявки направлены на Вашу электронную почту.\n\nС уважением,\nКредитный отдел'
  },
  {
    id: '123200001',
    regDate: '21/08/26',
    category: 'Устное',
    status: 'В работе',
    deadline: '03/09/26',
    responsible: 'Павлов Д.В.',
    applicantName: 'Соколов В.Н.',
    organizationName: 'N/A',
    address: 'N/A',
    cbs: 'N/A',
    type: 'Физ лицо',
    isMine: true,
    content: 'Клиент жалуется на навязывание страховки при оформлении кредита. Утверждает, что менеджер не предоставил возможность отказаться от страхования и не разъяснил условия.',
    solution: 'Проведена проверка процедуры оформления кредита. Прослушана аудиозапись консультации - менеджер действительно недостаточно четко разъяснил добровольность страхования. Проведена беседа с менеджером о соблюдении процедур. Клиенту предложено расторгнуть договор страхования с возвратом уплаченной премии.',
    response: 'Уважаемый Виктор Николаевич!\n\nПриносим извинения за недостаточно полное информирование об условиях страхования.\n\nСообщаем, что страхование при оформлении кредита является добровольным. Вы имеете право расторгнуть договор страхования в течение 14 дней с момента заключения с полным возвратом уплаченной суммы.\n\nДля расторжения договора просим Вас обратиться в отделение банка с паспортом и договором.\n\nС уважением,\nДепартамент качества'
  },
];

// APPEAL CARD COMPONENT WITH MOBILE
function AppealCard({ 
  onBack, 
  appealData 
}: { 
  onBack: () => void, 
  appealData: typeof mockAppeals[0] 
}) {
  const [appealContent, setAppealContent] = useState(appealData.content || '');
  const [solutionDescription, setSolutionDescription] = useState(appealData.solution || '');
  const [responseForm, setResponseForm] = useState(appealData.response || '');
  const [activeTab, setActiveTab] = useState<'home' | 'instead'>('home');
  const [category, setCategory] = useState('Категория 1');
  const [subcategory, setSubcategory] = useState('Прожекторию');
  const [status, setStatus] = useState(appealData.status);
  const [appealType, setAppealType] = useState<'verbal' | 'reject'>('verbal');
  const [comment, setComment] = useState('');
  
  // Mobile navigation state
  const [mobileSection, setMobileSection] = useState<'form' | 'info' | 'actions'>('form');
  const [expandedPanel, setExpanded] = useState<string | null>(null);

  // Save changes to localStorage when content changes
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (appealData.id) {
        appealStorage.updateAppeal(appealData.id, {
          content: appealContent,
          solution: solutionDescription,
          response: responseForm,
          status: status,
        });
      }
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [appealContent, solutionDescription, responseForm, status, appealData.id]);

  // Calculate deadline countdown
  const deadlineDate = new Date(appealData.deadline.split('/').reverse().join('-'));
  const now = new Date();
  const diffMs = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  // Mock data
  const historyAppeals = [
    { number: 'Номер', date: 'Дата закрыт', status: 'Закрыт' },
    { number: 'Номер', date: 'Дата закрыт', status: 'Закрыт' },
    { number: 'Номер', date: '---', status: 'В работе' },
  ];

  const comments = [
    { text: 'Получено 40 ID~93 страница', date: '23.07.26' },
    { text: 'Решена из 02.07 по 12.04.45', date: '12.04.26' },
    { text: 'Комментарий: Обойс уточнена. Проблема с автоматической идентифик...', date: '' },
  ];

  const mockAttachments = [
    { name: 'File 1. 23.07.27 Таблица', icon: '📄' },
    { name: 'File 2. 23.07.27 Скан обращения', icon: '📄' },
    { name: 'File 3. 23.07.27 Сопроводительный документ', icon: '📄' },
    { name: 'File 4. 23.07.27 Аудиозапись', icon: '▶️' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-300 px-2 sm:px-4 py-2 flex items-center gap-1 sm:gap-2">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Обработка обращения"
            className="w-full px-2 sm:px-3 py-1 border border-gray-300 rounded text-xs sm:text-sm"
            defaultValue="Обработка обращения"
          />
        </div>
        <button className="px-2 sm:px-4 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-xs sm:text-sm whitespace-nowrap">
          Сохранить
        </button>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 z-50 flex">
        <button
          onClick={() => setMobileSection('info')}
          className={`flex-1 py-3 text-xs font-medium ${
            mobileSection === 'info' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'
          }`}
        >
          <User className="w-4 h-4 mx-auto mb-1" />
          Инфо
        </button>
        <button
          onClick={() => setMobileSection('form')}
          className={`flex-1 py-3 text-xs font-medium ${
            mobileSection === 'form' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'
          }`}
        >
          <FileText className="w-4 h-4 mx-auto mb-1" />
          Форма
        </button>
        <button
          onClick={() => setMobileSection('actions')}
          className={`flex-1 py-3 text-xs font-medium ${
            mobileSection === 'actions' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'
          }`}
        >
          <MessageSquare className="w-4 h-4 mx-auto mb-1" />
          Действия
        </button>
      </div>

      <div className="flex h-[calc(100vh-52px)]">
        {/* LEFT SIDEBAR - Desktop only */}
        <div className="hidden lg:block w-64 bg-white border-r border-gray-300 overflow-y-auto">
          <div className="flex border-b border-gray-300">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex-1 px-4 py-2 text-sm font-medium border-r border-gray-300 ${
                activeTab === 'home' ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'
              }`}
            >
              Домашняя
            </button>
            <button
              onClick={() => setActiveTab('instead')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === 'instead' ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'
              }`}
            >
              Вместо обращения
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div className="border border-gray-300 rounded p-3">
              <div className="text-sm font-medium mb-2">Виджет с заявителем</div>
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-gray-600">ФИО заявителя</div>
                  <input
                    type="text"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    value={appealData.applicantName !== 'N/A' ? appealData.applicantName : appealData.organizationName}
                    readOnly
                  />
                </div>
                <div>
                  <div className="text-xs text-gray-600">Номер телефона</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                      defaultValue="89842943291"
                    />
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-300 rounded p-3">
              <div className="text-sm font-medium mb-2">История обращений</div>
              <div className="space-y-1">
                {historyAppeals.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <button className="px-2 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">
                      {item.number}
                    </button>
                    <button className="px-2 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">
                      {item.date}
                    </button>
                    <button className="px-2 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">
                      {item.status}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-1">Ответ дедлайн</div>
              <button className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded hover:bg-gray-200">
                Отвечать
              </button>
            </div>

            <div>
              <div className="text-sm font-medium mb-1">Аудиозапись</div>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
                <div className="text-xs text-gray-600">00:00 / 02:34</div>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-1">Дата дедлайна</div>
              <input
                type="text"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                defaultValue="13/04/26"
              />
            </div>

            <button className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50">
              Создать автодозвон
            </button>
          </div>
        </div>

        {/* CENTER CONTENT - Desktop + Mobile */}
        <div className={`flex-1 bg-gray-50 overflow-y-auto p-2 sm:p-6 pb-20 lg:pb-6 ${
          mobileSection !== 'form' ? 'hidden lg:block' : ''
        }`}>
          <div className="mb-4 hidden sm:block">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Поиск"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="bg-white rounded border border-gray-300 p-3 sm:p-6 space-y-4">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setAppealType('verbal')}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm border rounded ${
                  appealType === 'verbal'
                    ? 'bg-gray-200 border-gray-400'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                Устное
              </button>
              <button
                onClick={() => setAppealType('reject')}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm border rounded ${
                  appealType === 'reject'
                    ? 'bg-gray-200 border-gray-400'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                Отказ от обращения
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm mb-1">Тип обращения</label>
                <select className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm">
                  <option>Устное</option>
                  <option>Письменное</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm mb-1">Номер обращения</label>
                <input
                  type="text"
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm bg-gray-100"
                  value={appealData.id}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm mb-1">Категория</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm"
                >
                  <option>Категория 1</option>
                  <option>Категория 2</option>
                  <option>Категория 3</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm mb-1">Выберите подкатегорию</label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm"
                >
                  <option>Прожекторию</option>
                  <option>Подкатегория 2</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm mb-1">Дата регистрации</label>
                <input
                  type="text"
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm bg-gray-100"
                  value={appealData.regDate}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm mb-1">Планован дата</label>
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                  <input
                    type="text"
                    className="flex-1 min-w-[100px] px-2 sm:px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm"
                    defaultValue="13/03/26"
                  />
                  <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                    <Calendar className="w-4 h-4" />
                  </button>
                  <div className="px-2 sm:px-3 py-2 bg-red-100 border border-red-300 rounded text-xs text-red-700 whitespace-nowrap">
                    Дедлайн {diffDays}дн
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm mb-1">Статус обращения</label>
              <input
                type="text"
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">Исходное обращение</label>
              <textarea
                value={appealContent}
                onChange={(e) => setAppealContent(e.target.value)}
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm resize-none"
                rows={6}
                placeholder="Введите содержание обращения..."
              />
            </div>

            <div>
              <div className="flex items-start sm:items-center justify-between mb-2 flex-col sm:flex-row gap-2">
                <label className="block text-xs sm:text-sm font-medium">Текст решения</label>
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                  <select className="px-2 py-1 border border-gray-300 rounded text-xs">
                    <option>Выбрать шаблон</option>
                    <option>Шаблон 1</option>
                    <option>Шаблон 2</option>
                  </select>
                  <button className="px-2 sm:px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50 whitespace-nowrap">
                    Опубликовать
                  </button>
                  <button className="px-2 sm:px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
                    УКЭП
                  </button>
                </div>
              </div>
              <textarea
                value={solutionDescription}
                onChange={(e) => setSolutionDescription(e.target.value)}
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm resize-none"
                rows={5}
                placeholder="Введите описание решения..."
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">Форма ответа клиенту</label>
              <textarea
                value={responseForm}
                onChange={(e) => setResponseForm(e.target.value)}
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm resize-none"
                rows={6}
                placeholder="Введите текст ответа клиенту..."
              />
            </div>

            <div className="flex gap-2 pt-4 flex-col sm:flex-row">
              <button className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded text-xs sm:text-sm hover:bg-gray-50">
                Сохранить черновик
              </button>
              <button className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded text-xs sm:text-sm hover:bg-gray-50">
                Открыть в редакторе
              </button>
            </div>
          </div>
        </div>

        {/* Mobile INFO Panel */}
        {mobileSection === 'info' && (
          <div className="lg:hidden flex-1 bg-gray-50 overflow-y-auto p-3 pb-20">
            <div className="space-y-4">
              {/* Applicant Info */}
              <div className="bg-white rounded border border-gray-300 p-4">
                <div className="text-sm font-medium mb-3">Информация о заявителе</div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">ФИО / Организация</div>
                    <input
                      type="text"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50"
                      value={appealData.applicantName !== 'N/A' ? appealData.applicantName : appealData.organizationName}
                      readOnly
                    />
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Номер телефона</div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded"
                        defaultValue="89842943291"
                      />
                      <button className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* History */}
              <div className="bg-white rounded border border-gray-300 p-4">
                <div className="text-sm font-medium mb-3">История обращений</div>
                <div className="space-y-2">
                  {historyAppeals.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                      <span>{item.number}</span>
                      <span className="text-gray-600">{item.date}</span>
                      <span className="px-2 py-1 bg-gray-200 rounded">{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audio */}
              <div className="bg-white rounded border border-gray-300 p-4">
                <div className="text-sm font-medium mb-3">Аудиозапись</div>
                <div className="flex items-center gap-3">
                  <button className="p-3 bg-purple-100 rounded-full hover:bg-purple-200">
                    <svg className="w-6 h-6 text-purple-700" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full mb-1">
                      <div className="h-2 bg-purple-600 rounded-full" style={{width: '30%'}}></div>
                    </div>
                    <div className="text-xs text-gray-600">00:00 / 02:34</div>
                  </div>
                </div>
              </div>

              {/* Deadline */}
              <div className="bg-white rounded border border-gray-300 p-4">
                <div className="text-sm font-medium mb-3">Дедлайн</div>
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded text-center">
                  <div className="text-lg font-semibold text-red-700">{diffDays} дней {diffHours} часов</div>
                  <div className="text-xs text-red-600 mt-1">до истечения срока</div>
                </div>
                <button className="w-full mt-3 px-4 py-2 bg-gray-100 border border-gray-300 rounded text-sm hover:bg-gray-200">
                  Создать автодозвон
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile ACTIONS Panel */}
        {mobileSection === 'actions' && (
          <div className="lg:hidden flex-1 bg-gray-50 overflow-y-auto p-3 pb-20">
            <div className="space-y-4">
              {/* Actions */}
              <div className="bg-white rounded border border-gray-300 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium">Управление</div>
                  <Bell className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 text-left">
                    Создать частично решение
                  </button>
                  <button className="w-full px-4 py-2.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 text-left">
                    Создать заявку в HelpDesk
                  </button>
                </div>
              </div>

              {/* Comments */}
              <div className="bg-white rounded border border-gray-300 p-4">
                <div className="text-sm font-medium mb-3">Комментарии в CRM</div>
                <div className="space-y-2">
                  {comments.map((cmnt, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-700">{cmnt.text}</div>
                      {cmnt.date && (
                        <div className="text-xs text-gray-500 mt-1">{cmnt.date}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal Dept */}
              <div className="bg-white rounded border border-gray-300 p-4">
                <div className="text-sm font-medium mb-3">Юридический департамент</div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                  <div className="text-gray-700">Запрос от 19:02:44</div>
                </div>
              </div>

              {/* Comment Input */}
              <div className="bg-white rounded border border-gray-300 p-4">
                <div className="text-sm font-medium mb-3">Новый комментарий</div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none mb-3"
                  rows={3}
                  placeholder="Введите комментарий..."
                />
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-purple-600 text-white rounded text-xs hover:bg-purple-700">
                    Отправить
                  </button>
                  <button className="px-3 py-2 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
                    <Paperclip className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Attachments */}
              <div className="bg-white rounded border border-gray-300 p-4">
                <div className="text-sm font-medium mb-3">Вложения</div>
                <div className="space-y-2">
                  {mockAttachments.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded hover:bg-gray-100 active:bg-gray-200"
                    >
                      <span className="text-2xl">{file.icon}</span>
                      <span className="text-xs text-gray-700 flex-1">{file.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT SIDEBAR - Desktop only */}
        <div className="hidden lg:block w-80 bg-white border-l border-gray-300 overflow-y-auto">
          <div className="p-4 space-y-4">
            <div className="flex justify-end">
              <button className="p-2 hover:bg-gray-100 rounded relative">
                <Bell className="w-5 h-5 text-yellow-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>

            <div className="border border-gray-300 rounded p-3">
              <div className="text-sm font-medium mb-2">Управление обращением</div>
              <div className="space-y-2">
                <button className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 text-left">
                  Создать частично решение
                </button>
                <button className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 text-left">
                  Создать заявку в HelpDesk
                </button>
              </div>
            </div>

            <div className="border border-gray-300 rounded p-3">
              <div className="text-sm font-medium mb-2">Комментарий в CRM</div>
              <div className="space-y-3">
                {comments.map((cmnt, idx) => (
                  <div key={idx} className="p-2 bg-gray-50 rounded text-xs">
                    <div className="text-gray-700">{cmnt.text}</div>
                    {cmnt.date && (
                      <div className="text-gray-500 mt-1">{cmnt.date}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-gray-300 rounded p-3">
              <div className="text-sm font-medium mb-2">Юридический департамент</div>
              <div className="p-2 bg-yellow-50 rounded text-xs">
                <div className="text-gray-700">Запрос от 19:02:44</div>
              </div>
            </div>

            <div className="border border-gray-300 rounded p-3">
              <div className="text-sm font-medium mb-2">Отправить комментарий</div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none mb-2"
                rows={3}
                placeholder="Введите комментарий..."
              />
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
                  Отправить комментарий
                </button>
                <button className="px-3 py-2 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
                  Прикрепить вложение
                </button>
              </div>
            </div>

            <div className="border border-gray-300 rounded p-3">
              <div className="text-sm font-medium mb-2">Вложения</div>
              <div className="space-y-2">
                {mockAttachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                  >
                    <span className="text-lg">{file.icon}</span>
                    <span className="text-xs text-gray-700 flex-1">{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// CABINET COMPONENT WITH MOBILE
function ProcessingCabinet({
  onOpenAppeal
}: {
  onOpenAppeal: (appealId: string) => void
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('Мои обращения');
  const [typeFilter, setTypeFilter] = useState<string>('Все обращения');
  const [allAppeals, setAllAppeals] = useState(mockAppeals);

  // Load appeals from localStorage on mount
  useEffect(() => {
    const savedAppeals = appealStorage.getAllAppeals();
    if (savedAppeals.length > 0) {
      const combined = [...mockAppeals, ...savedAppeals];
      setAllAppeals(combined);
    }
  }, []);

  const filteredAppeals = allAppeals.filter(appeal => {
    let ownershipMatch = true;
    if (activeFilter === 'Мои обращения') {
      ownershipMatch = appeal.isMine === true;
    }

    let typeMatch = true;
    if (typeFilter === 'Физлицо') {
      typeMatch = appeal.type === 'Физ лицо' || appeal.type === 'Физлицо';
    } else if (typeFilter === 'Юрлицо') {
      typeMatch = appeal.type === 'Юр лицо' || appeal.type === 'Юрлицо';
    }

    const searchLower = searchQuery.toLowerCase();
    const searchMatch = 
      appeal.id.toLowerCase().includes(searchLower) ||
      appeal.applicantName.toLowerCase().includes(searchLower) ||
      appeal.organizationName.toLowerCase().includes(searchLower) ||
      appeal.category.toLowerCase().includes(searchLower) ||
      appeal.status.toLowerCase().includes(searchLower);

    return ownershipMatch && typeMatch && searchMatch;
  });

  const myAppealsCount = allAppeals.filter(a => a.isMine).length;
  const allAppealsCount = allAppeals.length;

  return (
    <div style={{ background: '#D1C4E9', minHeight: '100vh', paddingBottom: '3rem' }}>
      {/* Header */}
      <div className="shadow-md" style={{ backgroundColor: '#673AB7' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <h1 className="text-xl sm:text-2xl font-medium text-white mb-1">Кабинет ответственного</h1>
          <p className="text-xs sm:text-sm" style={{ color: '#E1BEE7' }}>Управление обращениями клиентов</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border-l-4 border-purple-600">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                <span className="text-xs sm:text-sm font-medium text-purple-900">Мои обращения</span>
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-normal text-purple-600 mb-1">
              {myAppealsCount}
            </div>
            <div className="text-xs text-purple-700">
              обращений в работе
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border-l-4 border-gray-400">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-900">Всего обращений</span>
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-normal text-gray-600 mb-1">
              {allAppealsCount}
            </div>
            <div className="text-xs text-gray-700">
              доступных обращений
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                <span className="text-xs sm:text-sm font-medium text-red-900">Срочные</span>
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-normal text-red-600 mb-1">
              2
            </div>
            <div className="text-xs text-red-700">
              требуют внимания
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 space-y-3 sm:space-y-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск обращений..."
              className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
            />
          </div>

          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex gap-2 flex-wrap">
              {['Все обращения', 'Физлицо', 'Юрлицо'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTypeFilter(filter)}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors rounded ${
                    typeFilter === filter
                      ? 'text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-purple-50'
                  }`}
                  style={typeFilter === filter ? { backgroundColor: '#673AB7' } : {}}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="flex gap-2 flex-wrap">
              {['Мои обращения', 'Все обращения'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors rounded ${
                    activeFilter === filter
                      ? 'text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-purple-50'
                  }`}
                  style={activeFilter === filter ? { backgroundColor: '#673AB7' } : {}}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Appeals List - Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredAppeals.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Номер</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Дата</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Категория</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Статус</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Дедлайн</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Ответственный</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Заявитель</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Организация</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Адрес</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">ЦБ</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppeals.map((appeal, idx) => (
                  <tr
                    key={appeal.id}
                    onClick={() => onOpenAppeal(appeal.id)}
                    className={`border-b border-gray-100 hover:bg-purple-50 cursor-pointer transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-700 font-medium">{appeal.id}</span>
                        {appeal.isMine && (
                          <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">МОЁ</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-gray-700">{appeal.regDate}</td>
                    <td className="px-3 py-2 text-gray-700">{appeal.category}</td>
                    <td className="px-3 py-2 text-gray-700">{appeal.status}</td>
                    <td className="px-3 py-2 text-gray-700">{appeal.deadline}</td>
                    <td className="px-3 py-2 text-gray-700">{appeal.responsible}</td>
                    <td className="px-3 py-2 text-gray-700">{appeal.applicantName}</td>
                    <td className="px-3 py-2 text-gray-700">{appeal.organizationName}</td>
                    <td className="px-3 py-2 text-gray-700">{appeal.address}</td>
                    <td className="px-3 py-2 text-gray-700">{appeal.cbs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Обращения не найдены</p>
            </div>
          )}
        </div>

        {/* Appeals List - Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filteredAppeals.length > 0 ? (
            filteredAppeals.map((appeal) => (
              <div
                key={appeal.id}
                onClick={() => onOpenAppeal(appeal.id)}
                className="bg-white rounded-lg shadow-sm p-4 active:bg-purple-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-purple-700 font-semibold text-sm mb-1">{appeal.id}</div>
                    {appeal.isMine && (
                      <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">МОЁ ОБРАЩЕНИЕ</span>
                    )}
                  </div>
                  <div className="text-xs px-2 py-1 bg-gray-100 rounded">{appeal.category}</div>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Статус:</span>
                    <span className="font-medium text-gray-900">{appeal.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Дедлайн:</span>
                    <span className="font-medium text-red-600">{appeal.deadline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ответственный:</span>
                    <span className="font-medium text-gray-900">{appeal.responsible}</span>
                  </div>
                  {appeal.applicantName !== 'N/A' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Заявитель:</span>
                      <span className="font-medium text-gray-900">{appeal.applicantName}</span>
                    </div>
                  )}
                  {appeal.organizationName !== 'N/A' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Организация:</span>
                      <span className="font-medium text-gray-900">{appeal.organizationName}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 text-sm">Обращения не найдены</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// MAIN PROCESSING PAGE COMPONENT
export function ProcessingPageMobile() {
  const [view, setView] = useState<'cabinet' | 'card'>('cabinet');
  const [selectedAppealId, setSelectedAppealId] = useState<string | null>(null);
  const [allAppeals, setAllAppeals] = useState(mockAppeals);

  // Load appeals from localStorage on mount
  useEffect(() => {
    const savedAppeals = appealStorage.getAllAppeals();
    if (savedAppeals.length > 0) {
      const combined = [...mockAppeals, ...savedAppeals];
      setAllAppeals(combined);
    }
  }, []);

  const handleOpenAppeal = (appealId: string) => {
    setSelectedAppealId(appealId);
    setView('card');
  };

  const handleBack = () => {
    setView('cabinet');
    setSelectedAppealId(null);
    // Reload appeals when going back
    const savedAppeals = appealStorage.getAllAppeals();
    if (savedAppeals.length > 0) {
      const combined = [...mockAppeals, ...savedAppeals];
      setAllAppeals(combined);
    }
  };

  const selectedAppeal = allAppeals.find(a => a.id === selectedAppealId);

  return (
    <>
      {view === 'card' && selectedAppeal ? (
        <AppealCard onBack={handleBack} appealData={selectedAppeal} />
      ) : (
        <ProcessingCabinet onOpenAppeal={handleOpenAppeal} />
      )}
    </>
  );
}

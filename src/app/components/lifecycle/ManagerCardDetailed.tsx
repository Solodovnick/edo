import { useState } from 'react';
import {
  ArrowLeft,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Paperclip
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface ManagerCardDetailedProps {
  onBack: () => void;
  appealData: any;
}

interface DepartmentRequest {
  id: number;
  department: string;
  type: string;
  requestDate: string;
  deadline: string;
  responseDate: string;
  responsible: string;
  status: string;
}

interface DepartmentResponse {
  id: number;
  type: string;
  from: string;
  requestCreatedDate: string;
  expectedDate: string;
  responseDate: string;
  responsible: string;
  incidentNumber?: string;
  status?: string;
  solution?: string;
  content?: string;
  comment?: string;
  decisionText?: string;
  signedDocument?: string;
  secretaryComment?: string;
  commissionComment?: string;
}

export function ManagerCardDetailed({ onBack, appealData }: ManagerCardDetailedProps) {
  const [decision, setDecision] = useState('');
  const [managerComment, setManagerComment] = useState('');
  const [selectedResponsible, setSelectedResponsible] = useState(appealData.responsible || '');
  const [leftExpanded, setLeftExpanded] = useState({
    requests: true,
  });

  // Статус обращения "Готово к подписи" - только для него показывается кнопка подписи
  const isReadyForSignature = appealData.status === 'Готово к подписи';

  // Запросы в подразделения - данные из скриншота
  const departmentRequests: DepartmentRequest[] = [
    {
      id: 1,
      department: 'Претензионная комиссия',
      type: 'Проект решения',
      requestDate: '07.04.2026',
      deadline: '10.04.2026',
      responseDate: '09.04.2026',
      responsible: 'Наида Юсупова',
      status: 'Закрыт',
    },
    {
      id: 2,
      department: 'Претензионная комиссия',
      type: 'Проект решения',
      requestDate: '10.04.2026',
      deadline: '13.04.2026',
      responseDate: 'Не получен',
      responsible: 'Наида Юсупова',
      status: 'В работе',
    },
    {
      id: 3,
      department: 'Претензионная комиссия',
      type: 'Проект решения',
      requestDate: '13.04.2026',
      deadline: '16.04.2026',
      responseDate: '15.04.2026',
      responsible: 'Наида Юсупова',
      status: 'Закрыт',
    },
    {
      id: 4,
      department: 'Претензионная комиссия',
      type: 'Проект решения',
      requestDate: '17.04.2026',
      deadline: '20.04.2026',
      responseDate: 'Не получен',
      responsible: 'Наида Юсупова',
      status: 'В работе',
    },
    {
      id: 5,
      department: 'Претензионная комиссия',
      type: 'Проект решения',
      requestDate: '21.04.2026',
      deadline: '24.04.2026',
      responseDate: '23.04.2026',
      responsible: 'Наида Юсупова',
      status: 'Закрыт',
    },
    {
      id: 6,
      department: 'Отдел технической поддержки',
      type: 'Инцидент',
      requestDate: '09.04.2026',
      deadline: '12.04.2026',
      responseDate: 'Не получен',
      responsible: 'Магомед Ахмедов',
      status: 'В работе',
    },
    {
      id: 7,
      department: 'Отдел технической поддержки',
      type: 'Инцидент',
      requestDate: '11.04.2026',
      deadline: '14.04.2026',
      responseDate: '13.04.2026',
      responsible: 'Тимур Ибрагимов',
      status: 'Закрыт',
    },
    {
      id: 8,
      department: 'Отдел технической поддержки',
      type: 'Инцидент',
      requestDate: '18.04.2026',
      deadline: '21.04.2026',
      responseDate: '20.04.2026',
      responsible: 'Шамиль Рамазанов',
      status: 'Закрыт',
    },
    {
      id: 9,
      department: 'Отдел технической поддержки',
      type: 'Инцидент',
      requestDate: '22.04.2026',
      deadline: '25.04.2026',
      responseDate: 'Не получен',
      responsible: 'Диана Мусаева',
      status: 'В работе',
    },
    {
      id: 10,
      department: 'Департамент розничного бизнеса',
      type: 'Запрос',
      requestDate: '03.04.2026',
      deadline: '18.04.2026',
      responseDate: '12.04.2026',
      responsible: 'Расул Рамазанов',
      status: 'Закрыт',
    },
  ];

  // Ответы подразделений - скопировано из ProcessingCardNew.tsx
  const departmentResponses: DepartmentResponse[] = [
    {
      id: 1,
      type: 'helpdesk',
      from: 'Helpdesk',
      incidentNumber: 'INC-2026-003421',
      requestCreatedDate: '03.03.26 09:15',
      expectedDate: '05.03.26 18:00',
      responseDate: '05.03.26 14:23',
      status: 'Решен',
      responsible: 'Иванов И.И.',
      solution: 'Выполнена настройка доступа в систему ДБО. Клиент может войти под своими учетными данными.',
    },
    {
      id: 2,
      type: 'business',
      from: 'Управление пластиковых карт',
      requestCreatedDate: '02.03.26 14:30',
      expectedDate: '04.03.26 17:00',
      responseDate: '04.03.26 11:15',
      content: 'Выполнена проверка истории операций по карте за период с 01.01.26 по 04.03.26. Обнаружена операция на сумму 15 000 руб. от 28.02.26, которая была отклонена системой безопасности. Блокировка снята, клиент может повторить операцию.',
      responsible: 'Петрова А.С.',
      comment: 'Рекомендуется проинформировать клиента о необходимости обновления лимитов по карте.',
    },
    {
      id: 3,
      type: 'commission',
      from: 'Претензионная комиссия',
      requestCreatedDate: '01.03.26 10:00',
      expectedDate: '03.03.26 16:00',
      responseDate: '03.03.26 15:45',
      decisionText: 'Претензия клиента Иванова П.С. рассмотрена на заседании комиссии от 03.03.2026 года. Комиссия приняла решение удовлетворить претензию частично: возместить клиенту сумму комиссии в размере 500 руб., в остальной части претензии отказать. Основание: п.4.2 Тарифов Банка, действовавших на момент совершения операции.',
      signedDocument: 'Решение_комиссии_298472_подписано.pdf',
      secretaryComment: 'Протокол заседания №12 от 03.03.2026. Присутствовали: 7 из 9 членов комиссии. Решение принято большинством голосов.',
      commissionComment: 'Клиенту необходимо направить письменное уведомление о принятом решении в течение 3 рабочих дней.',
    },
    {
      id: 4,
      type: 'business',
      from: 'Операционное управление',
      requestCreatedDate: '05.03.26 09:00',
      expectedDate: '06.03.26 18:00',
      responseDate: '06.03.26 10:30',
      content: 'Проведена проверка платежного поручения №456 от 05.03.26. Платеж был отклонен по причине некорректного БИК банка получателя. Клиент уведомлен о необходимости предоставления корректных реквизитов.',
      responsible: 'Сидоров П.М.',
      comment: 'Клиент предоставил исправленное платежное поручение, платеж проведен успешно.',
    },
  ];

  // List of 30 employees
  const employees = [
    'Расул Рамазанов',
    'Ибрагим Магомедов',
    'Амина Абдуллаева',
    'Марьям Исмаилова',
    'Саид Гаджиев',
    'Патимат Алиева',
    'Муса Османов',
    'Зарема Хасанова',
    'Магомед Ахмедов',
    'Аминат Салихова',
    'Руслан Казбеков',
    'Диана Мусаева',
    'Камиль Джабраилов',
    'Самира Нурмагомедова',
    'Ахмед Абакаров',
    'Милана Гасанова',
    'Тимур Ибрагимов',
    'Фатима Магомаева',
    'Шамиль Рамазанов',
    'Айшат Сулейманова',
    'Рустам Халилов',
    'Джамиля Омарова',
    'Арсен Курбанов',
    'Мадина Гаджимурадова',
    'Ислам Муртазалиев',
    'Наида Юсупова',
    'Рашид Абдулаев',
    'Хадижат Камилова',
    'Гамзат Магомедов',
    'Айна Расулова'
  ];

  const handleApprove = () => {
    if (selectedResponsible && selectedResponsible !== appealData.responsible) {
      toast.success(`Обращение №${appealData.id} подписано. Ответственный: ${selectedResponsible}`);
    } else {
      toast.success(`Обращение №${appealData.id} подписано`);
    }
    onBack();
  };

  const handleReject = () => {
    if (!managerComment.trim()) {
      toast.error('Укажите причину возврата');
      return;
    }
    toast.success(`Обращение №${appealData.id} возвращено на доработку`);
    onBack();
  };

  const handleResponsibleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newResponsible = e.target.value;
    setSelectedResponsible(newResponsible);
    if (newResponsible) {
      toast.success(`Ответственный назначен: ${newResponsible}`);
    }
  };

  // Safe access to optional fields
  const attachments = appealData.attachments || [];
  const history = appealData.history || [];
  const phone = appealData.phone || 'Не указан';
  const viewHistory = appealData.viewHistory || [];

  return (
    <div className="min-h-screen" style={{ background: '#D1C4E9' }}>
      {/* Header */}
      <div className="shadow-md" style={{ backgroundColor: '#673AB7' }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-purple-600 rounded transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-medium text-white">
                Обращение №{appealData.id}
              </h1>
              <p className="text-sm text-purple-200">
                Проверка руководителя
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* LEFT COLUMN - Applicant Info - STICKY */}
          <div className="lg:col-span-3 space-y-4">
            <div className="sticky top-4 space-y-4">
            {/* Applicant */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Заявитель</h3>
              <div className="space-y-3">
                {appealData.applicantName !== 'N/A' && (
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-600">ФИО</div>
                      <div className="text-sm text-gray-900">{appealData.applicantName}</div>
                    </div>
                  </div>
                )}
                {appealData.organizationName !== 'N/A' && (
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-600">Организация</div>
                      <div className="text-sm text-gray-900">{appealData.organizationName}</div>
                    </div>
                  </div>
                )}
                {phone && phone !== 'Не указан' && (
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-600">Телефон</div>
                      <div className="text-sm text-gray-900">{phone}</div>
                    </div>
                  </div>
                )}
                {appealData.address !== 'N/A' && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-600">Адрес</div>
                      <div className="text-sm text-gray-900">{appealData.address}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-600">Тип</div>
                    <div className="text-sm text-gray-900">{appealData.type}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Appeal Data */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Данные обращения</h3>
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-gray-600">Номер</div>
                  <div className="text-sm font-medium text-gray-900">№{appealData.id}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Дата регистрации</div>
                  <div className="text-sm text-gray-900">{appealData.regDate}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Срок исполнения</div>
                  <div className="text-sm text-gray-900">{appealData.deadline}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Статус</div>
                  <div className="text-sm text-gray-900">{appealData.status}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Категория</div>
                  <div className="text-sm text-gray-900">{appealData.category}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Ответственный</div>
                  <div className="text-sm text-gray-900">{appealData.responsible}</div>
                </div>
              </div>
            </div>

            {/* Attachments */}
            {attachments.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Вложения</h3>
                <div className="space-y-2">
                  {attachments.map((file: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <div className="text-xs text-gray-900 font-medium">{file.name}</div>
                      <div className="text-xs text-gray-600">{file.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Department Requests */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Запросы в подразделения</h3>
              <div className="space-y-2">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setLeftExpanded({ requests: !leftExpanded.requests })}
                >
                  <div className="text-xs text-gray-600">Запросы</div>
                  {leftExpanded.requests ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                {leftExpanded.requests && (
                  <div className="space-y-2">
                    {departmentRequests.map((request) => (
                      <div
                        key={request.id}
                        className="p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        <div className="text-xs text-gray-900 font-medium">
                          {request.department} - {request.type}
                        </div>
                        <div className="text-xs text-gray-600">
                          Дата запроса: {request.requestDate}, Срок: {request.deadline}, Ответ: {request.responseDate}, Ответственный: {request.responsible}, Статус: {request.status}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>

          {/* CENTER COLUMN - Main Content */}
          <div className="lg:col-span-6 space-y-4">
            {/* Content */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Содержание обращения
              </label>
              <div className="p-3 bg-gray-50 rounded text-sm text-gray-700 whitespace-pre-wrap">
                {appealData.content}
              </div>
            </div>

            {/* Solution */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Описание решения
              </label>
              <div className="p-3 bg-gray-50 rounded text-sm text-gray-700 whitespace-pre-wrap">
                {appealData.solution}
              </div>
            </div>

            {/* Response */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Форма ответа клиенту
              </label>
              <div className="p-3 bg-gray-50 rounded text-sm text-gray-700 whitespace-pre-wrap">
                {appealData.response}
              </div>
            </div>

            {/* Department Responses Widget - скопировано из ProcessingCardNew.tsx */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <span>Ответы подразделений</span>
                {departmentResponses.length > 0 && (
                  <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                    {departmentResponses.length}
                  </span>
                )}
              </h3>
              <div className="space-y-3">
                {departmentResponses.length === 0 ? (
                  <div className="text-xs text-gray-500 italic py-2">
                    Нет ответов от подразделений
                  </div>
                ) : (
                  departmentResponses.map((resp) => {
                    // Helpdesk Card
                    if (resp.type === 'helpdesk') {
                      return (
                        <div key={resp.id} className="border border-blue-200 bg-blue-50/30 rounded p-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                              <span className="text-xs font-medium text-gray-900">{resp.from}</span>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              resp.status === 'Решен' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {resp.status}
                            </span>
                          </div>
                          
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Номер инцидента:</span>
                              <span className="text-xs font-medium text-blue-700">{resp.incidentNumber}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Дата создания запроса:</span>
                              <span className="text-xs text-gray-900">{resp.requestCreatedDate}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Ожидаемая дата:</span>
                              <span className="text-xs text-gray-900">{resp.expectedDate}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Дата ответа:</span>
                              <span className="text-xs text-gray-900">{resp.responseDate}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Ответственный:</span>
                              <span className="text-xs text-gray-900">{resp.responsible}</span>
                            </div>
                          </div>

                          {resp.solution && (
                            <div className="pt-2 border-t border-blue-200">
                              <div className="text-xs text-gray-600 mb-1">Решение:</div>
                              <div className="text-xs text-gray-900">{resp.solution}</div>
                            </div>
                          )}
                        </div>
                      );
                    }

                    // Business Department Card
                    if (resp.type === 'business') {
                      return (
                        <div key={resp.id} className="border border-purple-200 bg-purple-50/30 rounded p-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                              <span className="text-xs font-medium text-gray-900">{resp.from}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Дата создания запроса:</span>
                              <span className="text-xs text-gray-900">{resp.requestCreatedDate}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Ожидаемая дата:</span>
                              <span className="text-xs text-gray-900">{resp.expectedDate}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Дата ответа:</span>
                              <span className="text-xs text-gray-900">{resp.responseDate}</span>
                            </div>
                            
                            <div className="pt-2 border-t border-purple-200">
                              <div className="text-xs text-gray-600 mb-1">Содержание ответа:</div>
                              <div className="text-xs text-gray-900 leading-relaxed">{resp.content}</div>
                            </div>
                            
                            <div className="flex items-center gap-1 text-xs text-gray-700 pt-1">
                              <User className="w-3 h-3" />
                              <span className="font-medium">Ответственный:</span>
                              <span>{resp.responsible}</span>
                            </div>

                            {resp.comment && (
                              <div className="pt-2 border-t border-purple-200">
                                <div className="text-xs text-gray-600 mb-1">Комментарий:</div>
                                <div className="text-xs text-gray-900 italic">{resp.comment}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }

                    // Commission Card
                    if (resp.type === 'commission') {
                      return (
                        <div key={resp.id} className="border border-amber-200 bg-amber-50/30 rounded p-3 space-y-2">
                          <div className="flex items-start gap-2">
                            <Building2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <span className="text-xs font-medium text-gray-900">{resp.from}</span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-600">Дата создания запроса:</span>
                                <span className="text-xs text-gray-900">{resp.requestCreatedDate}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-600">Ожидаемая дата:</span>
                                <span className="text-xs text-gray-900">{resp.expectedDate}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-600">Дата ответа:</span>
                                <span className="text-xs text-gray-900">{resp.responseDate}</span>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-amber-200">
                              <div className="text-xs font-medium text-amber-800 mb-1">Проект решения:</div>
                              <div className="text-xs text-gray-900 leading-relaxed bg-white/50 p-2 rounded border border-amber-100">
                                {resp.decisionText}
                              </div>
                            </div>

                            {resp.signedDocument && (
                              <div className="flex items-center gap-2 p-2 bg-white/50 rounded border border-amber-100">
                                <Paperclip className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs text-gray-600">Решение с ЭП:</div>
                                  <div className="text-xs font-medium text-amber-700 truncate">{resp.signedDocument}</div>
                                </div>
                              </div>
                            )}

                            {resp.secretaryComment && (
                              <div className="pt-2 border-t border-amber-200">
                                <div className="text-xs font-medium text-gray-700 mb-1">Комментарий секретаря:</div>
                                <div className="text-xs text-gray-900">{resp.secretaryComment}</div>
                              </div>
                            )}

                            {resp.commissionComment && (
                              <div className="pt-2 border-t border-amber-200">
                                <div className="text-xs font-medium text-gray-700 mb-1">Комментарий комиссии:</div>
                                <div className="text-xs text-gray-900">{resp.commissionComment}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Actions - STICKY */}
          <div className="lg:col-span-3 space-y-4">
            <div className="sticky top-4 space-y-4">
            {/* Manager Actions */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Действия</h3>
              
              <div className="space-y-3">
                {/* Кнопка "Подписать" показывается только для статуса "Готово к подписи" */}
                {isReadyForSignature && (
                  <button
                    onClick={handleApprove}
                    className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Подписать
                  </button>
                )}
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Назначить ответственного
                  </label>
                  <select
                    value={selectedResponsible}
                    onChange={handleResponsibleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none bg-white"
                  >
                    <option value="">Выберите сотрудника...</option>
                    {employees.map((employee, index) => (
                      <option key={index} value={employee}>
                        {employee}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={handleReject}
                  className="w-full px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Вернуть на доработку
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Комментарий руководителя
                </label>
                <textarea
                  value={managerComment}
                  onChange={(e) => setManagerComment(e.target.value)}
                  placeholder="Укажите комментарий..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
                />
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
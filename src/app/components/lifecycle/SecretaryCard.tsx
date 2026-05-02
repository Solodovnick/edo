import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Send,
  User,
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  Paperclip,
  History,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Upload
} from 'lucide-react';
import { appealStorage } from '../../../services/appealStorage';
import { toast } from 'sonner';

// Допустимый статус для кабинета секретаря - только статус 6 "На ПК"
const ALLOWED_STATUS = 'На ПК';

interface SecretaryCardProps {
  onBack: () => void;
  appealData: any;
}

export function SecretaryCard({ onBack, appealData }: SecretaryCardProps) {
  const [content, setContent] = useState(appealData.content || '');
  const [solution, setSolution] = useState(appealData.solution || '');
  const [response, setResponse] = useState(appealData.response || '');
  const [status, setStatus] = useState(appealData.status || 'В работе');
  const [responsible, setResponsible] = useState(appealData.responsible || '');
  const [commissionMembers, setCommissionMembers] = useState('');
  const [decisionDraft, setDecisionDraft] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  // Текущий пользователь (можно будет брать из контекста/auth)
  const currentUser = 'Секретарь комиссии';
  
  // Sidebar expansion states
  const [leftExpanded, setLeftExpanded] = useState({
    applicant: true,
    history: false,
    data: true,
    responses: true,
  });
  
  const [rightExpanded, setRightExpanded] = useState({
    protocol: true,
    data: true,
  });

  // Auto-save to localStorage
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (appealData.id) {
        const updated = appealStorage.updateAppeal(appealData.id, {
          content,
          solution,
          response,
          status,
          responsible,
        });
        
        if (!updated) {
          appealStorage.saveAppeal({
            ...appealData,
            content,
            solution,
            response,
            status,
            responsible,
          });
        }
      }
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [content, solution, response, status, responsible, appealData]);

  const handleSave = () => {
    if (appealData.id) {
      const updated = appealStorage.updateAppeal(appealData.id, {
        content,
        solution,
        response,
        status,
        responsible,
      });
      
      if (!updated) {
        appealStorage.saveAppeal({
          ...appealData,
          content,
          solution,
          response,
          status,
          responsible,
        });
      }
      toast.success('Изменения сохранены');
    }
  };

  const handleTakeInWork = () => {
    if (appealData.id) {
      setResponsible(currentUser);
      const updated = appealStorage.updateAppeal(appealData.id, {
        responsible: currentUser,
        status: 'В работе',
      });
      
      if (!updated) {
        appealStorage.saveAppeal({
          ...appealData,
          responsible: currentUser,
          status: 'В работе',
        });
      }
      toast.success(`Обращение №${appealData.id} принято в работу`);
    }
  };

  const handleSubmitDecision = () => {
    if (!commissionMembers.trim()) {
      toast.error('Укажите состав комиссии');
      return;
    }
    if (!decisionDraft.trim()) {
      toast.error('Заполните проект решения');
      return;
    }
    if (uploadedFiles.length === 0) {
      toast.error('Прикрепите файлы проекта решения с ЭП');
      return;
    }

    if (appealData.id) {
      const updated = appealStorage.updateAppeal(appealData.id, {
        content,
        solution,
        response,
        status: 'На рассмотрении комиссии',
        responsible,
        commissionMembers,
        decisionDraft,
      });
      
      if (!updated) {
        appealStorage.saveAppeal({
          ...appealData,
          content,
          solution,
          response,
          status: 'На рассмотрении комиссии',
          responsible,
          commissionMembers,
          decisionDraft,
        });
      }
      toast.success(`Проект решения по обращению №${appealData.id} отправлен`, {
        description: `Комиссия: ${commissionMembers}`,
      });
      onBack();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles([...uploadedFiles, ...files]);
      toast.success(`Загружено файлов: ${files.length}`);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  // Проверяем, является ли обращение моим
  const isMyAppeal = responsible === currentUser;

  // Mock data
  const historyAppeals = appealData.history || [
    { number: '298471', date: '15.02.26', status: 'Закрыт' },
    { number: '287456', date: '03.01.26', status: 'Закрыт' },
  ];

  const protocolSteps = [
    { step: 'Регистрация', date: appealData.regDate, user: 'Регистратор', active: true },
    { step: 'В работе', date: appealData.regDate, user: appealData.responsible, active: true },
    { step: 'На аудите', date: '—', user: '—', active: false },
    { step: 'Закрыто', date: '—', user: '—', active: false },
  ];

  // Mock данные ответов от подразделений
  const departmentResponses = appealData.departmentResponses || [
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
      decisionText: 'Претензия клиента Иванова П.С. рассмотрена на заседании комиссии от 03.03.2026 года. Комиссия приняла решение удовлетворить претензию частично: возместить клиенту сумму комиссии в размере 500 руб., в остальн��й части претензии отказать. Основание: п.4.2 Тарифов Банка, действовавших на момент совершения операции.',
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

  return (
    <div className="min-h-screen" style={{ background: '#D1C4E9' }}>
      {/* Header */}
      <div className="shadow-md" style={{ backgroundColor: '#673AB7' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-purple-600 rounded transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-medium text-white">
                    Обращение №{appealData.id}
                  </h1>
                  {isMyAppeal && (
                    <span className="text-xs px-2 py-0.5 bg-white/20 text-white rounded-full font-medium">
                      МОЁ
                    </span>
                  )}
                </div>
                <p className="text-sm text-purple-200">
                  {appealData.type} · {appealData.category}
                </p>
              </div>
            </div>
            <button
              onClick={handleSave}
              className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors"
              title="Сох��анить"
            >
              <Save className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* LEFT SIDEBAR - Applicant Info - STICKY */}
          <div className="lg:col-span-3 space-y-4">
            <div className="sticky top-4 space-y-4">
            {/* Applicant Information */}
            <div className="bg-white rounded-lg shadow-sm">
              <button
                onClick={() => setLeftExpanded({ ...leftExpanded, applicant: !leftExpanded.applicant })}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
              >
                <span className="text-sm font-medium text-gray-900">Заявитель</span>
                {leftExpanded.applicant ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>
              {leftExpanded.applicant && (
                <div className="px-4 pb-4 space-y-3">
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
                  {appealData.phone && (
                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <div className="text-xs text-gray-600">Телефон</div>
                        <div className="text-sm text-gray-900">{appealData.phone}</div>
                      </div>
                    </div>
                  )}
                  {appealData.email && (
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <div className="text-xs text-gray-600">Email</div>
                        <div className="text-sm text-gray-900">{appealData.email}</div>
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
                      <div className="text-xs text-gray-600">Тип заявителя</div>
                      <div className="text-sm text-gray-900">{appealData.type}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Appeal Data */}
            <div className="bg-white rounded-lg shadow-sm">
              <button
                onClick={() => setRightExpanded({ ...rightExpanded, data: !rightExpanded.data })}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
              >
                <span className="text-sm font-medium text-gray-900">Данные обращения</span>
                {rightExpanded.data ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>
              {rightExpanded.data && (
                <div className="px-4 pb-4 space-y-3">
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
                    <div className="text-sm text-gray-900">{status}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Тип обращения</div>
                    <div className="text-sm text-gray-900">{appealData.category}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Ответственный</div>
                    <div className="text-sm text-gray-900">{responsible}</div>
                  </div>
                  {appealData.cbs && appealData.cbs !== 'N/A' && (
                    <div>
                      <div className="text-xs text-gray-600">ЦБ/Регулятор</div>
                      <div className="text-sm text-gray-900">{appealData.cbs}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Department Responses Widget */}
            <div className="bg-white rounded-lg shadow-sm">
              <button
                onClick={() => setLeftExpanded({ ...leftExpanded, responses: !leftExpanded.responses })}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">Ответы подразделений</span>
                  {departmentResponses.length > 0 && (
                    <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                      {departmentResponses.length}
                    </span>
                  )}
                </div>
                {leftExpanded.responses ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>
              {leftExpanded.responses && (
                <div className="px-4 pb-4 space-y-3">
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
              )}
            </div>

            </div>
          </div>

          {/* CENTER COLUMN - Main Content */}
          <div className="lg:col-span-6 space-y-4">
            {/* Appeal Content */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Содержание обращения <span className="text-red-600">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="Опишите суть обращения клиента..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
              />
            </div>

            {/* Solution Description */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Описание решения <span className="text-red-600">*</span>
              </label>
              <textarea
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                rows={6}
                placeholder="Опишите проведенные действия и принятое решение..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
              />
            </div>

            {/* Response Form */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Форма ответа клиенту <span className="text-red-600">*</span>
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={8}
                placeholder="Введите текст ответа клиенту..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
              />
            </div>
          </div>

          {/* RIGHT SIDEBAR - Actions Widget */}
          <div className="lg:col-span-3">
            <div className="sticky top-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Действия</h3>
                <div className="space-y-3">
                  {/* Кнопки управления */}
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={handleTakeInWork}
                      disabled={isMyAppeal}
                      className={`w-full px-4 py-3 rounded font-medium transition-colors flex items-center justify-center gap-2 ${
                        isMyAppeal 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      <UserCheck className="w-5 h-5" />
                      Принять в работу
                    </button>
                    
                    <button
                      onClick={handleSubmitDecision}
                      disabled={!isMyAppeal}
                      className={`w-full px-4 py-3 rounded font-medium transition-colors flex items-center justify-center gap-2 ${
                        !isMyAppeal 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-purple-700 hover:bg-purple-800 text-white'
                      }`}
                    >
                      <Send className="w-5 h-5 flex-shrink-0" />
                      <span>Отправить проект решения</span>
                    </button>
                  </div>

                  {/* Разделитель */}
                  {isMyAppeal && <div className="border-t border-gray-200 my-3"></div>}

                  {/* Поля для заполнения (только если обращение ое) */}
                  {isMyAppeal && (
                    <>
                      {/* Состав комиссии */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Состав комиссии <span className="text-red-600">*</span>
                        </label>
                        <textarea
                          value={commissionMembers}
                          onChange={(e) => setCommissionMembers(e.target.value)}
                          rows={3}
                          placeholder="Укажите состав комиссии (ФИО, должности)..."
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
                        />
                      </div>

                      {/* Прикрепить файлы */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Прикрепить файлы проекта решения с ЭП <span className="text-red-600">*</span>
                        </label>
                        <div className="space-y-2">
                          <label className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded hover:border-purple-500 transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-purple-600">
                            <Upload className="w-4 h-4" />
                            <span>Выбрать файлы</span>
                            <input
                              type="file"
                              multiple
                              onChange={handleFileUpload}
                              className="hidden"
                              accept=".pdf,.doc,.docx,.sig"
                            />
                          </label>
                          {uploadedFiles.length > 0 && (
                            <div className="space-y-1">
                              {uploadedFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between text-xs bg-gray-50 px-2 py-1 rounded">
                                  <div className="flex items-center gap-1 flex-1 min-w-0">
                                    <Paperclip className="w-3 h-3 text-gray-500 flex-shrink-0" />
                                    <span className="truncate">{file.name}</span>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveFile(index)}
                                    className="text-red-600 hover:text-red-700 ml-2"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Проект решения */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Проект решения <span className="text-red-600">*</span>
                        </label>
                        <textarea
                          value={decisionDraft}
                          onChange={(e) => setDecisionDraft(e.target.value)}
                          rows={6}
                          placeholder="Введите текст проекта решения комиссии..."
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
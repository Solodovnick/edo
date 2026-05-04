import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  User,
  Phone,
  Clock,
  Calendar,
  Paperclip,
  MessageSquare,
  Send,
  Edit,
  Save,
  History,
  CheckCircle
} from 'lucide-react';
import type { UnifiedAppeal } from '../../../data/unifiedAppealsData';
import { appealStorage } from '../../../services/appealStorage';
import { toast } from 'sonner';

interface AuditCardDetailedProps {
  onBack: () => void;
  appealData: UnifiedAppeal;
}

interface SavedAuditResult {
  templateName: string;
  questions: string[];
  answers: string[];
  rating: number;
  callStatus: 'connected' | 'not_connected';
  timestamp: string;
}

export function AuditCardDetailed({ onBack, appealData }: AuditCardDetailedProps) {
  const [auditResult, setAuditResult] = useState('');
  const [auditComment, setAuditComment] = useState('');
  const [crmComment, setCrmComment] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showAuditForm, setShowAuditForm] = useState(false);
  const [feedbackTemplate, setFeedbackTemplate] = useState('');
  const [feedbackAnswers, setFeedbackAnswers] = useState<string[]>(['', '', '', '', '']);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [callStatus, setCallStatus] = useState<'connected' | 'not_connected'>('connected');
  const [callAttempt, setCallAttempt] = useState(0); // 0 = initial, 1 = first attempt, 2 = second attempt, 3 = third attempt
  const [isTakenToWork, setIsTakenToWork] = useState(appealData.isMine || false);
  const [savedAuditResult, setSavedAuditResult] = useState<SavedAuditResult | null>(null);
  const [currentStatus, setCurrentStatus] = useState(appealData.status); // Текущий статус обращения
  const [showRefuseWidget, setShowRefuseWidget] = useState(false);
  const [refuseReason, setRefuseReason] = useState('');
  const [refuseComment, setRefuseComment] = useState('');

  // Safe access to optional fields
  const attachments = appealData.attachments || [];
  const history = appealData.history || [];
  const crmComments = appealData.crmComments || [];
  const phone = appealData.phone || 'Не указан';
  const deadlineCountdown = appealData.deadlineCountdown || { days: 0, hours: 0, minutes: 0 };

  // Load saved audit result from localStorage on mount
  useEffect(() => {
    const storageKey = `audit_result_${appealData.id}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setSavedAuditResult(parsedData);
        
        // Если есть сохраненный результат аудита, статус должен быть "В архиве"
        setCurrentStatus('В архиве');
      } catch (e) {
        console.error('Error loading saved audit result:', e);
      }
    } else {
      // Load saved status from localStorage only if no audit result
      const statusStorageKey = `appeal_status_${appealData.id}`;
      const savedStatus = localStorage.getItem(statusStorageKey);
      if (savedStatus) {
        setCurrentStatus(savedStatus);
      }
    }
  }, [appealData.id]);

  const handleSaveDraft = () => {
    alert('Черновик сохранён');
  };

  const handleOpenEditor = () => {
    alert('Открытие редактора...');
  };

  const handlePublish = () => {
    alert('Результаты аудита опубликованы');
    onBack();
  };

  const handleSendComment = () => {
    alert('Комментарий отправлен');
    setCrmComment('');
  };

  const handleTakeToWork = () => {
    setIsTakenToWork(true);
    alert('Обращение взято в работу');
  };

  const handleRefuse = () => {
    setIsTakenToWork(false);
    
    // Возвращаем обращение в кабинет аудитора со статусом "Аудит"
    const updated = appealStorage.updateAppeal(appealData.id, {
      status: 'Аудит',
      auditRefused: true,
      auditRefuseReason: refuseReason,
      auditRefuseComment: refuseComment,
    });
    
    if (!updated) {
      appealStorage.saveAppeal({
        ...appealData,
        status: 'Аудит',
        auditRefused: true,
        auditRefuseReason: refuseReason,
        auditRefuseComment: refuseComment,
      });
    }
    
    toast.success(`Вы отказались от обращения №${appealData.id}`, {
      description: `Причина: ${refuseReason}. Обращение вернулось в очередь аудитора.`,
    });
    onBack();
  };

  const feedbackTemplates = {
    quality: {
      name: 'Качество обслуживания',
      questions: [
        'Насколько быстро был обработан ваш запрос?',
        'Как вы оцениваете вежливость сотрудника?',
        'Была ли информация предоставлена понятно?',
        'Решил ли сотрудник вашу проблему полностью?',
        'Порекомендуете ли вы наш банк друзьям?'
      ]
    },
    technical: {
      name: 'Техническая поддержка',
      questions: [
        'Насколько быстро был получен ответ на технический вопрос?',
        'Была ли предоставленная инструкция ��онятной?',
        'Помогло ли решение проблемы?',
        'Удобно ли было получать техническую поддержку?',
        'Удовлетворены ли вы результатом обращения?'
      ]
    },
    card: {
      name: 'Выпуск/Перевыпуск карты',
      questions: [
        'Насколько понятна была процедура заказа карты?',
        'Устроили ли вас сроки изготовления карты?',
        'Удобно ли было получить карту?',
        'Получили ли вы всю необходимую информацию?',
        'Довольны ли вы качеством обслуживания?'
      ]
    },
    credit: {
      name: 'Кредитные продукты',
      questions: [
        'Насколько понятны были условия кредитного продукта?',
        'Был ли процесс оформления кредита удобным?',
        'Довольны ли вы процентной ставкой и условиями?',
        'Получили ли вы полную консультацию по продукту?',
        'Порекомендуете ли вы наши кредитные продукты?'
      ]
    },
    deposit: {
      name: 'Депозиты и вклады',
      questions: [
        'Понятны ли были условия размещения вклада?',
        'Устроили ли вас предложенные процентные ставки?',
        'Был ли процесс оформления вклада быстрым?',
        'Получили ли вы исчерпывающую информацию о продукте?',
        'Готовы ли вы в будущем разместить еще один вклад?'
      ]
    },
    online_banking: {
      name: 'Интернет-банк и мобильное приложение',
      questions: [
        'Насколько понятен интерфейс приложения/интернет-банка?',
        'Быстро ли был решен ваш технический вопрос?',
        'Удобно ли пользоваться функционалом системы?',
        'Была ли предоставлена достаточная помощь при возникших сложностях?',
        'Удовлетворены ли вы качеством онлайн-обслуживания?'
      ]
    },
    transfer: {
      name: 'Переводы и платежи',
      questions: [
        'Насколько быстро был выполнен ваш перевод/платеж?',
        'Была ли процедура оформления понятной?',
        'Устроила ли вас комиссия за операцию?',
        'Получили ли вы всю необходимую информацию о статусе платежа?',
        'Довольны ли вы качеством сервиса переводов?'
      ]
    },
    currency: {
      name: 'Валютные операции',
      questions: [
        'Устроил ли вас предложенный курс обмена валюты?',
        'Был ли процесс обмена валюты удобным?',
        'Насколько быстро была проведена операция?',
        'Получили ли вы полную консультацию по валютным операциям?',
        'Готовы ли вы воспользоваться валютными услугами в будущем?'
      ]
    },
    complaint: {
      name: 'Жалобы и претензии',
      questions: [
        'Насколько быстро была рассмотрена ваша жалоба?',
        'Был ли ответ на жалобу исчерпывающим?',
        'Удовлетворены ли вы принятыми мерами?',
        'Почувствовали ли вы, что банк услышал ваши претензии?',
        'Изменилось ли ваше мнение о банке после рассмотрения жалобы?'
      ]
    },
    consultation: {
      name: 'Консультационные услуги',
      questions: [
        'Насколько компетентным был сотрудник при консультации?',
        'Была ли предоставлена вся необходимая информация?',
        'Понятно ли объяснены были условия продуктов/услуг?',
        'Сколько времени заняла консультация?',
        'Готовы ли вы обратиться за консультацией повторно?'
      ]
    }
  };

  const handleOpenAuditModal = () => {
    // Reset form when opening modal (start fresh each time)
    setFeedbackTemplate('');
    setFeedbackAnswers(['', '', '', '', '']);
    setFeedbackRating(0);
    setCallStatus('connected');
    setCallAttempt(0);
    setShowAuditForm(true);
  };

  // Функция завершения аудита с финальным статусом
  const completeAudit = (finalCallStatus: 'connected' | 'not_connected', skipRatingValidation: boolean = false) => {
    // Validation: check if rating is selected (skip for third unsuccessful call attempt)
    if (!skipRatingValidation && feedbackRating === 0) {
      alert('Пожалуйста, укажите оценку от 1 до 5!');
      return;
    }

    // Save to localStorage
    const storageKey = `audit_result_${appealData.id}`;
    const selectedTemplate = feedbackTemplates[feedbackTemplate as keyof typeof feedbackTemplates];
    const auditData: SavedAuditResult = {
      templateName: selectedTemplate.name,
      questions: selectedTemplate.questions,
      answers: feedbackAnswers,
      rating: feedbackRating, // Will be 0 if skipped
      callStatus: finalCallStatus,
      timestamp: new Date().toLocaleString('ru-RU')
    };

    localStorage.setItem(storageKey, JSON.stringify(auditData));
    setSavedAuditResult(auditData);

    // Обновляем статус обращения на "Закрыт" в appealStorage
    const updated = appealStorage.updateAppeal(appealData.id, {
      status: 'Закрыт',
      auditCompleted: true,
      auditResult: auditData,
      auditCompletedAt: new Date().toISOString(),
    });
    
    if (!updated) {
      appealStorage.saveAppeal({
        ...appealData,
        status: 'Закрыт',
        auditCompleted: true,
        auditResult: auditData,
        auditCompletedAt: new Date().toISOString(),
      });
    }
    
    setCurrentStatus('Закрыт'); // Обновляем локальное состояние

    // Close modal and reset form
    setShowAuditForm(false);
    setFeedbackTemplate('');
    setFeedbackAnswers(['', '', '', '', '']);
    setFeedbackRating(0);
    setCallStatus('connected');
    setCallAttempt(0);

    if (skipRatingValidation) {
      toast.success(`Аудит обращения №${appealData.id} завершен`, {
        description: 'Клиент не ответил после 3 попыток. Статус изменен на "Закрыт".',
      });
    } else {
      toast.success(`Аудит обращения №${appealData.id} завершен успешно!`, {
        description: 'Статус изменен на "Закрыт".',
      });
    }
    
    onBack();
  };

  // Обработчики кнопок дозвона
  const handleNotConnected1 = () => {
    setCallAttempt(1);
    setCallStatus('not_connected');
  };

  const handleNotConnected2 = () => {
    setCallAttempt(2);
    setCallStatus('not_connected');
  };

  const handleNotConnected3 = () => {
    setCallAttempt(3);
    setCallStatus('not_connected');
    // Завершаем аудит после третьей попытки без проверки оценки
    completeAudit('not_connected', true);
  };

  const handleConnected = () => {
    setCallStatus('connected');
    // Завершаем аудит при успешном дозвоне
    completeAudit('connected');
  };

  const updateFeedbackAnswer = (index: number, value: string) => {
    const newAnswers = [...feedbackAnswers];
    newAnswers[index] = value;
    setFeedbackAnswers(newAnswers);
  };

  const handleCancelFeedback = () => {
    setShowAuditForm(false);
    setFeedbackTemplate('');
    setFeedbackAnswers(['', '', '', '', '']);
    setFeedbackRating(0);
    setCallStatus('connected');
    setCallAttempt(0);
  };

  const handleRefuseWidgetOpen = () => {
    setShowRefuseWidget(true);
  };

  const handleRefuseWidgetClose = () => {
    setShowRefuseWidget(false);
    setRefuseReason('');
    setRefuseComment('');
  };

  const handleRefuseSubmit = () => {
    if (!refuseReason || !refuseComment) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    // Здесь можно добавить логику отправки причины отказа и комментария на сервер
    alert(`Вы отказались от обращения по причине: ${refuseReason}. Комментарий: ${refuseComment}`);
    handleRefuseWidgetClose();
    handleRefuse();
  };

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
            <div className="flex-1">
              <h1 className="text-xl font-medium text-white">Аудит обращения</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-4">
          {/* LEFT SIDEBAR - Applicant Info */}
          <div className="space-y-4">
            {/* Applicant Widget */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Виджет с заявителем</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-600 mb-1">ФИО заявителя</div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">
                      {appealData.applicantName !== 'N/A' ? appealData.applicantName : appealData.organizationName}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Номер телефона</div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-900">{phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Информация по обраще��ию */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Информация по обращению</h3>
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Номер</div>
                  <div className="text-sm font-medium text-gray-900">{appealData.id}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Категория обращения</div>
                  <div className="text-sm text-gray-900">{appealData.category}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">ФИО Регистратора</div>
                  <div className="text-sm text-gray-900">{appealData.registrar || 'Не указан'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">ФИО Ответственного</div>
                  <div className="text-sm text-gray-900">{appealData.responsible || 'Не назначен'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Дата оздания</div>
                  <div className="text-sm text-gray-900">{appealData.regDate}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Дата решения</div>
                  <div className="text-sm text-gray-900">{appealData.deadline}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Статус</div>
                  <div className="text-sm font-medium text-purple-600">{currentStatus}</div>
                </div>
              </div>
            </div>

            {/* Вложения */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <Paperclip className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-900">Вложения</h3>
              </div>
              <div className="space-y-1">
                {attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                  >
                    <Paperclip className="w-3 h-3 text-gray-500" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-900 truncate">{file.name}</div>
                      <div className="text-xs text-gray-500">{file.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN - Main Content */}
          <div className="space-y-4">
            {/* Исходное обращение */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Исходное обращение</h3>
              <div className="bg-gray-50 rounded border border-gray-200 p-3 text-sm text-gray-800 leading-relaxed max-h-48 overflow-y-auto">
                {appealData.content}
              </div>
            </div>

            {/* Текст решения */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Текст решения</h3>
              <div className="bg-gray-50 rounded border border-gray-200 p-3 text-sm text-gray-800 leading-relaxed max-h-48 overflow-y-auto">
                {appealData.solution}
              </div>
            </div>

            {/* История обращений */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <History className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-900">История обращений</h3>
              </div>
              
              {!showHistory ? (
                <button
                  onClick={() => setShowHistory(true)}
                  className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium transition-colors"
                >
                  Запросить историю
                </button>
              ) : (
                <div className="space-y-3">
                  {history.length > 0 ? (
                    history.map((item, idx) => (
                      <div key={idx} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">Номер:</span>
                            <span className="text-xs font-medium text-gray-900">{item.number}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">Дата открытия:</span>
                            <span className="text-xs text-gray-900">{item.openDate || '01/03/26'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">Дата закрытия:</span>
                            <span className="text-xs text-gray-900">{item.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">Категория:</span>
                            <span className="text-xs text-gray-900">{item.category || 'Перевыпуск карты'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">Статус:</span>
                            <span className="text-xs font-medium text-green-600">{item.status}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-500 text-center py-2">Нет истории</div>
                  )}
                </div>
              )}
            </div>

            {/* Результаты аудита - показывается только если есть сохраненные данные */}
            {savedAuditResult && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="text-sm font-medium text-gray-900">Результаты аудита</h3>
                </div>
                <div className="bg-gray-50 rounded border border-gray-200 p-3">
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-medium text-gray-900 mb-1">Шаблон: {savedAuditResult.templateName}</div>
                      <div className="text-xs text-gray-600">Дата проведения: {savedAuditResult.timestamp}</div>
                    </div>

                    <div className="pt-2 border-t border-gray-300">
                      <div className="font-medium text-gray-900 mb-2">Результаты опроса:</div>
                      <div className="space-y-2">
                        {savedAuditResult.questions.map((question, idx) => (
                          <div key={idx} className="text-xs">
                            <div className="text-gray-700 font-medium mb-1">{idx + 1}. {question}</div>
                            <div className="text-gray-600 pl-4">
                              {savedAuditResult.answers[idx] || '(Не заполнено)'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-300 flex items-center justify-between">
                      <div className="text-gray-900">
                        <span className="font-medium">Общая оценка:</span>
                        <span className="ml-2 px-3 py-1 bg-purple-100 text-purple-700 rounded font-bold">
                          {savedAuditResult.rating} / 5
                        </span>
                      </div>
                      <div className="text-gray-900">
                        <span className="font-medium">Статус дозвона:</span>
                        <span className={`ml-2 px-3 py-1 rounded font-medium ${
                          savedAuditResult.callStatus === 'connected'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {savedAuditResult.callStatus === 'connected' ? 'Дозвонился' : 'Не дозвонился'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR - Actions, History & Feedback */}
          <div className="space-y-4">
            {/* Действия */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Действия</h3>
              <div className="space-y-3">
                {isTakenToWork ? (
                  // Показываем кнопку отказа только если аудит не завершен
                  savedAuditResult === null && (
                    showRefuseWidget ? (
                      // Показываем виджет отказа
                      <div className="space-y-3 p-3 border-2 border-purple-200 rounded-lg bg-purple-50">
                        <h4 className="text-sm font-medium text-gray-900">Объяснительная</h4>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">Причина</label>
                          <select
                            value={refuseReason}
                            onChange={(e) => setRefuseReason(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none bg-white"
                          >
                            <option value="">Выберите причину...</option>
                            <option value="cannot_resolve">Не могу решить</option>
                            <option value="handover">Передача дел</option>
                            <option value="other">Другое</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">Комментарий</label>
                          <textarea
                            value={refuseComment}
                            onChange={(e) => setRefuseComment(e.target.value)}
                            placeholder="Введите комментарий..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none bg-white"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleRefuseWidgetClose}
                            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
                          >
                            Отмена
                          </button>
                          <button
                            onClick={handleRefuseSubmit}
                            className="flex-1 px-3 py-2 bg-purple-600 text-white rounded text-sm font-medium hover:bg-purple-700 transition-colors"
                          >
                            ОК
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={handleRefuseWidgetOpen}
                        className="w-full px-4 py-2 border-2 rounded text-sm font-medium transition-colors bg-white border-red-500 text-red-500 hover:bg-red-50"
                      >
                        Отказаться
                      </button>
                    )
                  )
                ) : (
                  <button
                    onClick={handleTakeToWork}
                    className="w-full px-4 py-2 text-white rounded text-sm font-medium transition-colors"
                    style={{ backgroundColor: '#673AB7' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#5E35B1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#673AB7';
                    }}
                  >
                    Взять в работу
                  </button>
                )}
                
                {/* Показываем блок аудита только если обращение взято в работу */}
                {isTakenToWork && !showRefuseWidget && (
                  <div className="pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-600 mb-3">Опрос удовлетворенности</div>
                    <button
                      onClick={handleOpenAuditModal}
                      disabled={savedAuditResult !== null}
                      className={`w-full px-4 py-2 rounded text-sm font-medium transition-colors ${
                        savedAuditResult !== null
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : showAuditForm
                          ? 'bg-purple-500 hover:bg-purple-600 text-white'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      {savedAuditResult !== null ? '✓ Аудит завершен' : showAuditForm ? 'Аудит в процессе' : 'Выполнить аудит'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Форма аудита - показывается справа при нажатии на "Выполнить аудит" */}
            {showAuditForm && !savedAuditResult && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-base font-medium text-gray-900 mb-3">Форма обратной связи</h2>
                
                {/* Audit Instructions */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
                  <h3 className="text-xs font-medium text-purple-900 mb-1.5">Инструкция по проведению аудита</h3>
                  <ol className="text-xs text-purple-800 space-y-0.5 list-decimal list-inside">
                    <li>Выберите подходящий шаблон в зависимости от категории обращения</li>
                    <li>Заполните все поля оценки качества обработки обращения</li>
                    <li>Укажите общую оценку удовлетворенности от 1 до 5</li>
                    <li>Проверьте корректность ответа ответственного сотрудника</li>
                    <li>Нажмите "Дозвонился" или "Не дозвонился" для завершения</li>
                  </ol>
                </div>

                {/* Template Selection */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Выбрать вариант шаблона
                  </label>
                  <select
                    value={feedbackTemplate}
                    onChange={(e) => setFeedbackTemplate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  >
                    <option value="">Выберите шаблон...</option>
                    <option value="quality">Качество обслуживания</option>
                    <option value="technical">Техническая поддержка</option>
                    <option value="card">Выпуск/Перевыпуск карты</option>
                    <option value="credit">Кредитные продукты</option>
                    <option value="deposit">Депозиты и вклады</option>
                    <option value="online_banking">Интернет-банк и мобильное приложение</option>
                    <option value="transfer">Переводы и платежи</option>
                    <option value="currency">Валютные операции</option>
                    <option value="complaint">Жалобы и претензии</option>
                    <option value="consultation">Консультационные услуги</option>
                  </select>
                </div>

                {/* Cancel Button - shows when template is NOT selected */}
                {!feedbackTemplate && (
                  <button
                    onClick={handleCancelFeedback}
                    className="w-full px-3 py-2 mb-3 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Отмена
                  </button>
                )}

                {/* Questions */}
                {feedbackTemplate && (
                  <>
                    <div className="space-y-3 mb-3">
                      {feedbackTemplates[feedbackTemplate as keyof typeof feedbackTemplates].questions.map((question, idx) => (
                        <div key={idx}>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {idx + 1}. {question}
                          </label>
                          <textarea
                            value={feedbackAnswers[idx]}
                            onChange={(e) => updateFeedbackAnswer(idx, e.target.value)}
                            placeholder="Ответ заявителя..."
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Rating */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Оценка от 1 до 5 <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setFeedbackRating(rating)}
                            className={`w-10 h-10 rounded border-2 text-sm font-medium transition-colors ${
                              feedbackRating === rating
                                ? 'border-purple-600 bg-purple-600 text-white'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-purple-400'
                            }`}
                          >
                            {rating}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Call Status */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Статус дозвона
                      </label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <button
                            onClick={handleNotConnected1}
                            className={`flex-1 px-3 py-2 rounded border-2 text-xs font-medium transition-colors ${
                              callAttempt >= 1
                                ? 'border-red-600 bg-red-50 text-red-700'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            Не дозвонился (1)
                          </button>
                          <button
                            onClick={handleConnected}
                            className="flex-1 px-3 py-2 rounded border-2 text-xs font-medium transition-colors border-green-600 bg-green-50 text-green-700 hover:border-green-700"
                          >
                            Дозвонился
                          </button>
                        </div>

                        {callAttempt >= 1 && (
                          <div className="flex gap-2">
                            <button
                              onClick={handleNotConnected2}
                              className={`flex-1 px-3 py-2 rounded border-2 text-xs font-medium transition-colors ${
                                callAttempt >= 2
                                  ? 'border-red-600 bg-red-50 text-red-700'
                                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                              }`}
                            >
                              Не дозвонился (2)
                            </button>
                            <button
                              onClick={handleConnected}
                              className="flex-1 px-3 py-2 rounded border-2 text-xs font-medium transition-colors border-green-600 bg-green-50 text-green-700 hover:border-green-700"
                            >
                              Дозвонился
                            </button>
                          </div>
                        )}

                        {callAttempt >= 2 && (
                          <div className="flex gap-2">
                            <button
                              onClick={handleNotConnected3}
                              className="flex-1 px-3 py-2 rounded border-2 text-xs font-medium transition-colors border-red-600 bg-red-50 text-red-700 hover:border-red-700"
                            >
                              Не дозвонился (3)
                            </button>
                            <button
                              onClick={handleConnected}
                              className="flex-1 px-3 py-2 rounded border-2 text-xs font-medium transition-colors border-green-600 bg-green-50 text-green-700 hover:border-green-700"
                            >
                              Дозвонился
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cancel Button - moved to the bottom */}
                    <button
                      onClick={handleCancelFeedback}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Отмена
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
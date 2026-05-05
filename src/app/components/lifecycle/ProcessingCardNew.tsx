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
  UserMinus,
  ArrowRight
} from 'lucide-react';
import { appealStorage } from '../../../services/appealStorage';
import { toast } from 'sonner';
import { ResponseDocumentEditor } from './ResponseDocumentEditor';

// Допустимые статусы для кабинета ответственного
const ALLOWED_STATUSES = [
  'В работе',                        // Зарегистрированные обращения
  'На ответственном, не взято',      // Не взятые в работу
  'На ответственном, взято',         // Взятые в работу
  'На БП',                           // Бизнес-подразделение
  'На ПК',                           // Претензионная комиссия
  'На HD'                            // Helpdesk
];

interface ProcessingCardProps {
  onBack: () => void;
  appealData: any;
}

export function ProcessingCardNew({ onBack, appealData }: ProcessingCardProps) {
  const [content, setContent] = useState(appealData.content || '');
  const [solution, setSolution] = useState(appealData.solution || '');
  const [response, setResponse] = useState(appealData.response || '');
  const [status, setStatus] = useState(appealData.status || 'В работе');
  const [comment, setComment] = useState('');
  const [responsible, setResponsible] = useState(appealData.responsible || '');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departmentComment, setDepartmentComment] = useState('');
  const [plannedDate, setPlannedDate] = useState('');
  const [declineReason, setDeclineReason] = useState('');
  const [declineComment, setDeclineComment] = useState('');
  
  // States for response delivery confirmation
  const [isResponseDelivered, setIsResponseDelivered] = useState(false);
  const [deliveryDateTime, setDeliveryDateTime] = useState('');
  
  // Call tracking states
  const [callAttempt1Failed, setCallAttempt1Failed] = useState(false);
  const [callAttempt2Failed, setCallAttempt2Failed] = useState(false);
  const [callAttempt3Failed, setCallAttempt3Failed] = useState(false);
  const [callSuccess, setCallSuccess] = useState(false);
  
  // Response template selection
  const [selectedTemplate, setSelectedTemplate] = useState('');
  
  // Response templates organized by category
  const responseTemplates = {
    complaints: {
      label: 'Жалобы',
      subcategories: {
        service_quality: {
          label: 'Качество обслуживания',
          template: `Уважаемый(ая) [ФИО],

Благодарим Вас за обращение в [Название Банка].

Ваша жалоба на качество обслуживания от [дата] рассмотрена. По результатам проведенной проверки установлено, что [описание ситуации].

Приносим извинения за доставленные неудобства. Нами приняты меры для недопущения подобных ситуаций в будущем: [принятые меры].

С уважением,
[Должность]
[ФИО]
[Контактные данные]`,
        },
        fees_charges: {
          label: 'Комиссии и тарифы',
          template: `Уважаемый(ая) [ФИО],

Благодарим Вас за обращение в [Название Банка].

По вопросу начисления комиссии по [продукт/услуга] сообщаем следующее:

Согласно действующим Тарифам Банка, утвержденным [дата], по операции [наименование операции] взимается комиссия в размере [размер комиссии]. Данная комиссия была списана [дата] в соответствии с условиями договора.

[Дополнительная информация о возврате/корректировке, если применимо]

Для получения подробной информации о тарифах Вы можете ознакомиться с документом на сайте банка или обратиться в отделение.

С уважением,
[Должность]
[ФИО]`,
        },
        unauthorized_transaction: {
          label: 'Несанкционированная операция',
          template: `Уважаемый(ая) [ФИО],

Благодарим Вас за обращение в [Название Банка].

По факту несанкционированной операции по карте **** [последние 4 цифры] на сумму [сумма] от [дата] проведена проверка.

По результатам проверки установлено: [описание результатов проверки].

[Если операция признана несанкционированной:]
Сумма операции в размере [сумма] будет возвращена на Ваш счет в течение [срок] рабочих дней.

[Если операция признана санкционированной:]
Операция была проведена с использованием правильного PIN-кода/кода подтверждения, что подтверждает Ваше участие в транзакции.

Рекомендуем соблюдать меры безопасности при использовании банковских карт.

С уважением,
[Должность]
[ФИО]`,
        },
      },
    },
    applications: {
      label: 'Заявления',
      subcategories: {
        account_opening: {
          label: 'Открытие счета',
          template: `Уважаемый(ая) [ФИО],

Благодарим Вас за обращение в [Название Банка].

Ваше заявление на открытие [тип счета] от [дата] рассмотрено и одобрено.

Номер открытого счета: [номер счета]
Дата открытия: [дата]

Реквизиты для перевода средств и дополнительная информация направлены на Ваш email: [email].

Для активации дистанционного банковского обслуживания, пожалуйста, обратитесь в отделение Банка с паспортом или воспользуйтесь мобильным приложением.

С уважением,
[Должность]
[ФИО]`,
        },
        card_issue: {
          label: 'Выпуск карты',
          template: `Уважаемый(ая) [ФИО],

Благодарим Вас за обращение в [Название Банка].

Ваше заявление на выпуск [тип карты] от [дата] принято в обработку.

Ориентировочный срок изготовления карты: [срок] рабочих дней.
Способ получения: [отделение/доставка курьером]
[Если отделение:] Адрес отделения: [адрес]

О готовности карты Вы будете уведомлены по SMS/email.

При получении карты необходимо иметь при себе паспорт.

С уважением,
[Должность]
[ФИО]`,
        },
        limit_increase: {
          label: 'Увеличение лимита',
          template: `Уважаемый(ая) [ФИО],

Благодарим Вас за обращение в [Название Банка].

Ваше з��явление на увеличение лимита по [продукт] от [дата] рассмотрено.

[Если одобрено:]
Ваш лимит увеличен с [старый лимит] до [новый лимит]. Изменения вступили в силу [дата].

[Если отклонено:]
К сожалению, на данный момент мы не можем увеличить Ваш лимит по следующим причинам: [причины].
Рекомендуем повторно обратиться с заявлением через [срок].

С уважением,
[Должность]
[ФИО]`,
        },
      },
    },
    requests: {
      label: 'Запросы информации',
      subcategories: {
        statement_request: {
          label: 'Запрос выписки',
          template: `Уважаемый(ая) [ФИО],

Благодарим Вас за обращение в [Название Банка].

Выписка по счету [номер счета] за период с [дата начала] по [дата окончания] подготовлена.

[Если электронная:]
Выписка направлена на Ваш email: [email].

[Если бумажная:]
Выписка будет готова к выдаче в отделении [адрес] с [дата]. При получении необходимо иметь при себе паспорт.

С уважением,
[Должность]
[ФИО]`,
        },
        certificate_request: {
          label: 'Запрос справки',
          template: `Уважаемый(ая) [ФИО],

Благодарим Вас за обращение в [Название Банка].

Ваш запрос на предоставление справки [тип справки] от [дата] принят в обработку.

Срок подготовки документа: [срок] рабочих дней.
Способ получения: [отделение/email]

[Если платная услуга:]
Стоимость услуги согласно Тарифам Банка составляет [сумма]. Комиссия будет списана со счета [номер счета].

О готовности справки Вы удете уведомлены дополнительно.

С уважением,
[Должность]
[ФИО]`,
        },
        balance_inquiry: {
          label: 'Запрос остатка',
          template: `Уважаемый(ая) [ФИО],

Благодарим Вас за обращение в [Название Банка].

По состоянию на [дата и время] остаток по Вашему счету [номер счета] составляет: [сумма] [валюта].

Доступный остаток: [сумма] [валюта]
Заблокированные средства: [сумма] [валюта]

Актуальную информацию о балансе Вы всегда можете получить в мобильном приложении или интернет-банке.

С уважением,
[Должность]
[ФИО]`,
        },
      },
    },
    refusals: {
      label: 'Отказы',
      subcategories: {
        credit_refusal: {
          label: 'Отказ в кредите',
          template: `Уважаемый(ая) [ФИО],

Благодарим Вас за обращение в [Название Банка].

Ваша заявка на получение [тип кредитного продукта] от [дата] рассмотрена.

К сожалению, по результатам рассмотрения Банк принял решение об отказе в предоставлении кредита. Решение принято на основании внутренних методик оценки кредитоспособности клиентов.

Вы можете повторно обратиться с заявкой через [срок], при этом рекомендуем:
- [рекомендация 1]
- [рекомендация 2]

Банк не разглашает конкретные причины отказа в соответствии с внутренними политиками.

С уважением,
[Должность]
[ФИО]`,
        },
        service_refusal: {
          label: 'Отказ в услуге',
          template: `Уважаемый(ая) [ФИО],

Благодарим Вас за обращение в [Название Банка].

Ваше заявление на [наименование услуги] от [дата] рассмотрено.

По результатам рассмотрения Банк вынужден отказать в предоставлении данной услуги по следующим причинам:
[причины отказа]

[Если применимо:]
Для получения данной услуги необходимо выполнение следующих условий:
- [условие 1]
- [условие 2]

Вы можете повторно обратиться после устранения указанных несоответствий.

С уважением,
[Должность]
[ФИО]`,
        },
        partial_satisfaction: {
          label: 'Частичное удовлетворение',
          template: `Уважаемый(ая) [ФИО],

Благодарим Вас за обращение в [Название Банка].

Ваше обращение от [дата] рассмотрено Претензионной комиссией Банка.

Комиссия приняла решение удовлетворить Вашу претензию частично:

Удовлетворено:
[описание удовлетворенной части]

Отказано:
[описание части, в которой отказано]
Основание: [ссылка на договор/тарифы/законодательство]

[Если предусмотрена компенсация:]
Сумма в размере [сумма] будет зачислена на Ваш счет в течение [срок] рабочих дней.

С уважением,
[Должность]
[ФИО]`,
        },
      },
    },
    regulator: {
      label: 'Ответы регулятору',
      subcategories: {
        cb_response: {
          label: 'Ответ в ЦБ РФ',
          template: `В Центральный банк Российской Федерации
[Адрес подразделения ЦБ]

Исх. № [номер] от [дата]

ОТВЕТ
на обращение гражданина [ФИО] от [дата] № [номер]

[Название Банка] рассмотрел обращение гражданина [ФИО] (далее – Заявитель) и сообщает следующее.

1. Фактические обстоятельства:
[Описание ситуации]

2. Правовое обоснование:
[Ссылки на законодательство, договор, тарифы]

3. Позиция Банка:
[Аргументированная позиция]

4. Принятые меры:
[Описание принятых мер]

5. Результат рассмотрения:
[Итоговое решение]

Приложения:
[Список документов]

[Должность подписанта]
[ФИО]

М.П.`,
        },
        rospotrebnadzor_response: {
          label: 'Ответ в Роспотребнадзор',
          template: `В Управление Федеральной службы по надзору
в сфере защиты прав потребителей и благополучия человека
по [субъект РФ]
[Адрес]

Исх. № [номер] от [дата]

ОТВЕТ
на обращение от [дата] № [номер]

[Название Банка] рассмотрел обращение и сообщает следующее.

Согласно материалам обращения, Заявитель [краткое изложение требований].

По результатам проверки установлено:
[Фактические обстоятельства]

Правовое обоснование позиции Банка:
[Ссылки на ГК РФ, Закон о защите прав потребителей, внутренние документы]

Принятые Банком меры:
[Описание мер]

Заявителю направлен ответ от [дата] с разъяснением позиции Банка и принятых мер.

Приложения:
[Список документов]

[Должность подписанта]
[ФИО]

М.П.`,
        },
      },
    },
    technical: {
      label: 'Технические вопросы',
      subcategories: {
        online_banking_access: {
          label: 'Доступ к ДБО',
          template: `Уважаемый(ая) [ФИО],

Благодарим Вас за обращение в [Название Банка].

По вопросу восстановления доступа к системе дистанционного банковского обслуживания сообщаем:

[Если доступ восстановлен:]
Доступ к системе восстановлен [дата, время]. Временный пароль направлен на номер телефона [номер]. При первом входе система предложит изменить пароль на постоянный.

[Если требуется личное обращение:]
Для восстановления доступа необходимо обратиться в любое отделение Банка с паспортом. Специалист поможет сбросить пароль и восстановить доступ.

В целях безопасности рекомендуем:
- Не передавать логин и пароль третьим лицам
- Использовать сложные пароли
- Регулярно менять пароль

С уважением,
[Должность]
[ФИО]`,
        },
        mobile_app_issue: {
          label: 'Проблемы с приложением',
          template: `Уважаемый(ая) [ФИО],

Благодарим Вас за обращение в [Название Банка].

Ваше обращение о проблемах с работой мобильного приложения от [дата] рассмотрено технической службой.

[Описание проблемы и решения]

Для корректной работы приложения рекомендуем:
- Убедиться, что установлена последняя версия приложения (текущая версия: [версия])
- Проверить стабильность интернет-соединения
- Очистить кэш приложения
- При необходимости переустановить приложение

[Если проблема на стороне банка:]
Специалисты Банка работают над устранением неполадки. Ориентировочный срок решения: [срок].

С уважением,
[Должность]
[ФИО]`,
        },
      },
    },
  };

  // Handle template selection
  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedTemplate(value);
    
    if (value) {
      // Parse the value (format: "category.subcategory")
      const [category, subcategory] = value.split('.');
      const template = responseTemplates[category as keyof typeof responseTemplates]
        ?.subcategories[subcategory as keyof typeof responseTemplates[keyof typeof responseTemplates]['subcategories']]
        ?.template;
      
      if (template) {
        setResponse(template);
        toast.success('Шаблон вставлен', {
          description: 'Вы можете отредактировать текст ответа',
        });
      }
    }
  };

  // Handle call attempt buttons
  const handleCallAttempt1Failed = () => {
    setCallAttempt1Failed(true);
    toast.info('Звонок неуспех 1 зафиксирован');
  };

  const handleCallAttempt2Failed = () => {
    setCallAttempt2Failed(true);
    toast.info('Звонок неуспех 2 зафиксирован');
  };

  const handleCallAttempt3Failed = () => {
    setCallAttempt3Failed(true);
    setIsResponseDelivered(true);
    // Set date and time in format: "12.03.26 14:23"
    const now = new Date();
    const formattedDateTime = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear().toString().slice(-2)} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setDeliveryDateTime(formattedDateTime);
    toast.warning('Звонок неуспех 3 зафиксирован', {
      description: 'Ответ помечен как доведенный',
    });
  };

  const handleCallSuccess = () => {
    setCallSuccess(true);
    setIsResponseDelivered(true);
    // Set date and time in format: "12.03.26 14:23"
    const now = new Date();
    const formattedDateTime = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear().toString().slice(-2)} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setDeliveryDateTime(formattedDateTime);
    toast.success('Звонок успех зафиксирован', {
      description: 'Ответ помечен как доведенный',
    });
  };
  
  // Текущий пользователь (можно будет брать из контекста/auth)
  const currentUser = 'Расул Рамазанов';
  
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
        // Try to update first
        const updated = appealStorage.updateAppeal(appealData.id, {
          content,
          solution,
          response,
          status,
          responsible,
        });
        
        // If update failed (appeal not in localStorage), save the full appeal
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

  const handleDeclineAppeal = () => {
    if (!declineReason) {
      toast.error('Выберите причину отказа');
      return;
    }
    if (!declineComment.trim()) {
      toast.error('Укажите комментарий к отказу');
      return;
    }
    
    if (appealData.id) {
      setResponsible('Не назначено');
      const updated = appealStorage.updateAppeal(appealData.id, {
        responsible: 'Не назначено',
        status: 'На ответственном, не взято',
        declineReason,
        declineComment,
      });
      
      if (!updated) {
        appealStorage.saveAppeal({
          ...appealData,
          responsible: 'Не назначено',
          status: 'На ответственном, не взято',
          declineReason,
          declineComment,
        });
      }
      toast.success(`Вы отказались от обращения №${appealData.id}`, {
        description: `Причина: ${declineReason}. Обращение вернулось в очередь ответственного.`,
      });
      onBack();
    }
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      toast.error('Заполните содержание обращения');
      return;
    }
    if (!solution.trim()) {
      toast.error('Заполните описание решения');
      return;
    }
    if (!response.trim()) {
      toast.error('Заполните форму ответа клиенту');
      return;
    }

    if (appealData.id) {
      // Определяем статус в зависимости от типа обращения
      // Устные обращения идут на аудит, письменные закрываются сразу
      const isOral = appealData.category === 'Устное' || appealData.appealType === 'Устное';
      const newStatus = isOral ? 'Аудит' : 'Закрыт';
      
      const updated = appealStorage.updateAppeal(appealData.id, {
        content,
        solution,
        response,
        status: newStatus,
        responsible,
      });
      
      if (!updated) {
        appealStorage.saveAppeal({
          ...appealData,
          content,
          solution,
          response,
          status: newStatus,
          responsible,
        });
      }
      
      if (isOral) {
        toast.success(`Обращение №${appealData.id} отправлено на аудит`);
      } else {
        toast.success(`Обращение №${appealData.id} завершено и закрыто`);
      }
      onBack();
    }
  };

  const handleTransferToDepartment = () => {
    if (!selectedDepartment) {
      toast.error('Выберите бизнес подразделение');
      return;
    }
    if (!plannedDate) {
      toast.error('Укажите плановую дату выполнения');
      return;
    }
    if (!departmentComment.trim()) {
      toast.error('Укажите комментарий для передачи');
      return;
    }
    
    if (appealData.id) {
      // Если передаем в Претензионную комиссию - меняем статус на "На ПК"
      const newStatus = selectedDepartment === 'Претензионная комиссия' ? 'На ПК' : appealData.status;
      
      const updated = appealStorage.updateAppeal(appealData.id, {
        status: newStatus,
        transferredTo: selectedDepartment,
        transferComment: departmentComment,
        plannedDate: plannedDate,
      });
      
      if (!updated) {
        appealStorage.saveAppeal({
          ...appealData,
          status: newStatus,
          transferredTo: selectedDepartment,
          transferComment: departmentComment,
          plannedDate: plannedDate,
        });
      }
      
      toast.success(`Обращение №${appealData.id} передано в ${selectedDepartment}`, {
        description: `Плановая дата: ${plannedDate}`,
      });
      onBack();
    }
  };

  // Бизнес подразделения
  const businessDepartments = [
    'Helpdesk',
    'Претензионная комиссия',
    'Операционное управление',
    'Управление оформления операционных сделок',
    'Управление пластиковых карт',
    'Управление по работе с корпоративными клиентами',
    'Управление продуктами корпоративного бизнеса',
    'Управление продуктами розничного бизнеса',
    'Управление сети продаж',
    'тдел по работе с розничными клиентами',
    'Отдел мониторинга банковских операций',
    'Управление контроля кредитных сделок',
  ];

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
              title="Сохранить"
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
                        <div className="text-xs text-gray-600">Организаця</div>
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
                  {appealData.appealCategory && (
                    <div>
                      <div className="text-xs text-gray-600">Категория</div>
                      <div className="text-sm text-gray-900">{appealData.appealCategory}</div>
                    </div>
                  )}
                  {appealData.appealSubcategory && (
                    <div>
                      <div className="text-xs text-gray-600">Подкатегория</div>
                      <div className="text-sm text-gray-900">{appealData.appealSubcategory}</div>
                    </div>
                  )}
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
                                  <div className="text-xs font-medium text-gray-700 mb-1">Комментарий коиссии:</div>
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
            <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
              {/* Template Selector Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  📋 Выберите шаблон ответа
                </label>
                <select
                  value={selectedTemplate}
                  onChange={handleTemplateSelect}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none bg-gray-50 hover:bg-white transition-colors"
                >
                  <option value="">Выберите категорию и шаблон...</option>
                  
                  {Object.entries(responseTemplates).map(([categoryKey, category]) => (
                    <optgroup key={categoryKey} label={`📁 ${category.label}`}>
                      {Object.entries(category.subcategories).map(([subKey, subcategory]) => (
                        <option key={`${categoryKey}.${subKey}`} value={`${categoryKey}.${subKey}`}>
                          {subcategory.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Выбранный шаблон будет вставлен в форму ответа. Вы сможете его отредактировать.
                </p>
              </div>

              {/* Форма ответа: документ с полями из контекстного меню (ПКМ) — рамка фиолетовая у активного поля, серая у неактивного */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Форма ответа клиенту <span className="text-red-600">*</span>
                </label>
                <ResponseDocumentEditor value={response} onChange={setResponse} className="font-sans" minHeightPx={288} />
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR - Actions Widget */}
          <div className="lg:col-span-3">
            <div className="sticky top-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Действия</h3>
                <div className="space-y-3">
                  {!isMyAppeal ? (
                    <button
                      onClick={handleTakeInWork}
                      className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <UserCheck className="w-5 h-5" />
                      Принять в работу
                    </button>
                  ) : (
                    <>
                      {/* Response Delivery Confirmation Block */}
                      <div className="bg-white border border-gray-300 rounded-lg p-3 space-y-3">
                        <h4 className="text-sm font-bold text-gray-900">Фиксация доведения</h4>
                        
                        {/* Call Tracking Buttons */}
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            {/* Звонок неуспех 1 - always visible */}
                            <button
                              onClick={handleCallAttempt1Failed}
                              disabled={callAttempt1Failed}
                              className={`px-3 py-2 text-xs font-medium rounded transition-colors ${
                                callAttempt1Failed
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                              }`}
                            >
                              📞 Звонок неуспех 1
                            </button>

                            {/* Звонок успех - always visible */}
                            <button
                              onClick={handleCallSuccess}
                              disabled={callSuccess}
                              className={`px-3 py-2 text-xs font-medium rounded transition-colors ${
                                callSuccess
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              ✅ Звонок успех
                            </button>
                          </div>

                          {/* Звонок неуспех 2 - show only if attempt 1 failed */}
                          {callAttempt1Failed && (
                            <button
                              onClick={handleCallAttempt2Failed}
                              disabled={callAttempt2Failed}
                              className={`w-full px-3 py-2 text-xs font-medium rounded transition-colors ${
                                callAttempt2Failed
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                              }`}
                            >
                              📞 Звонок неуспех 2
                            </button>
                          )}

                          {/* Звонок неуспех 3 - show only if attempt 2 failed */}
                          {callAttempt2Failed && (
                            <button
                              onClick={handleCallAttempt3Failed}
                              disabled={callAttempt3Failed}
                              className={`w-full px-3 py-2 text-xs font-medium rounded transition-colors ${
                                callAttempt3Failed
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : 'bg-red-100 text-red-700 hover:bg-red-200'
                              }`}
                            >
                              ❌ Звонок неуспех 3
                            </button>
                          )}
                        </div>

                        {/* Checkbox */}
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isResponseDelivered}
                            onChange={(e) => {
                              setIsResponseDelivered(e.target.checked);
                              if (e.target.checked && !deliveryDateTime) {
                                // Auto-set date and time when manually checking
                                const now = new Date();
                                const formattedDateTime = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear().toString().slice(-2)} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                                setDeliveryDateTime(formattedDateTime);
                              }
                            }}
                            className="mt-0.5 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-700">Ответ доведен до заявителя</span>
                        </label>

                        {/* Date and Time Display - appears when checkbox is checked */}
                        {isResponseDelivered && (
                          <>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                Дата и время доведения
                              </label>
                              <div className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-gray-50 text-gray-900 font-medium">
                                {deliveryDateTime || '—'}
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Кнопка "Завершить работу" - disabled if response not delivered */}
                      <button
                        onClick={handleSubmit}
                        disabled={!isResponseDelivered}
                        className={`w-full px-4 py-3 rounded font-medium transition-colors flex items-center justify-center gap-2 text-center leading-snug ${
                          isResponseDelivered
                            ? 'bg-purple-700 hover:bg-purple-800 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <Send className="w-5 h-5 flex-shrink-0" />
                        <span>Завершить работу</span>
                      </button>

                      {/* Разделитель */}
                      <div className="border-t border-gray-200 my-3"></div>

                      {/* Причина отказа */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Причина отказа
                        </label>
                        <select
                          value={declineReason}
                          onChange={(e) => setDeclineReason(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                        >
                          <option value="">Выберите причину</option>
                          <option value="Ошибка выбора категории">Ошибка выбора категории</option>
                          <option value="Не могу решить">Не могу решить</option>
                          <option value="Другое">Другое</option>
                        </select>
                      </div>

                      {/* Комментарий к отказу */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Комментарий
                        </label>
                        <textarea
                          value={declineComment}
                          onChange={(e) => setDeclineComment(e.target.value)}
                          rows={3}
                          placeholder="Укажите причину отказа..."
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
                        />
                      </div>

                      {/* Кнопка отказа */}
                      <button
                        onClick={handleDeclineAppeal}
                        className="w-full px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded font-medium transition-colors flex items-center justify-center gap-2 text-center leading-snug"
                      >
                        <UserMinus className="w-5 h-5 flex-shrink-0" />
                        <span>Отказаться от<br/>обращения</span>
                      </button>
                    </>
                  )}
                  
                  <div className="pt-2 border-t border-gray-200">
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Передать запрос
                    </label>
                    
                    {/* Подразделение */}
                    <div className="mb-2">
                      <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className={`w-full px-3 py-2 text-sm border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none ${
                          !selectedDepartment && (plannedDate || departmentComment)
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                      >
                        <option value="">Выберите подразделение</option>
                        {businessDepartments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                      {!selectedDepartment && (plannedDate || departmentComment) && (
                        <p className="text-xs text-red-600 mt-1">Выберите подразделение</p>
                      )}
                    </div>

                    {/* Плановая дата выполнения */}
                    <div className="mb-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Плановая дата решения
                      </label>
                      <input
                        type="date"
                        value={plannedDate}
                        onChange={(e) => setPlannedDate(e.target.value)}
                        className={`w-full px-3 py-2 text-sm border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none ${
                          !plannedDate && (selectedDepartment || departmentComment)
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                        placeholder="Плановая дата выполнения"
                      />
                      {!plannedDate && (selectedDepartment || departmentComment) && (
                        <p className="text-xs text-red-600 mt-1">Укажите плановую дату выполнения</p>
                      )}
                    </div>

                    {/* Комментарий */}
                    <div className="mb-2">
                      <textarea
                        value={departmentComment}
                        onChange={(e) => setDepartmentComment(e.target.value)}
                        rows={2}
                        placeholder="Комментарий для передачи..."
                        className={`w-full px-3 py-2 text-sm border rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none ${
                          !departmentComment.trim() && (selectedDepartment || plannedDate)
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                      />
                      {!departmentComment.trim() && (selectedDepartment || plannedDate) && (
                        <p className="text-xs text-red-600 mt-1">Укажите комментарий</p>
                      )}
                    </div>

                    {/* Кнопка передачи */}
                    <button
                      onClick={handleTransferToDepartment}
                      disabled={!selectedDepartment || !plannedDate || !departmentComment.trim()}
                      className={`w-full px-4 py-2.5 rounded font-medium transition-colors flex items-center justify-center gap-2 text-sm ${
                        selectedDepartment && plannedDate && departmentComment.trim()
                          ? 'bg-purple-500 hover:bg-purple-600 text-white cursor-pointer'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ArrowRight className="w-4 h-4" />
                      Передать запрос
                    </button>

                    {/* Общая валидация */}
                    {(!selectedDepartment || !plannedDate || !departmentComment.trim()) && 
                     (selectedDepartment || plannedDate || departmentComment) && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                        <p className="text-xs text-red-700 font-medium">
                          Для передачи запроса необходимо:
                        </p>
                        <ul className="text-xs text-red-600 mt-1 space-y-1 list-disc list-inside">
                          {!selectedDepartment && <li>Выбрать подразделение</li>}
                          {!plannedDate && <li>Указать плановую дату</li>}
                          {!departmentComment.trim() && <li>Указать комментарий</li>}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
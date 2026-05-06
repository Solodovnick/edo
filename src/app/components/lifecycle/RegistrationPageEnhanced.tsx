import { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle,
  XCircle,
  FileText,
  MoreVertical,
  ArrowLeft,
  Eye,
  Settings,
  Calendar,
  Search,
  Upload,
  X as XIcon,
  Mail,
  Plus,
  User
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { AppealRegistrationCard } from './AppealRegistrationCard';
import { appealStorage, Appeal } from '../../../services/appealStorage';
import { persistRegisteredAppeal } from '../../../services/edoCabinetApi';
import bankCategories from '../../../imports/bank-categories.json';
import { notificationService } from '../../../services/notificationService';
import { initializeTestNotifications } from '../../../utils/initializeNotifications';

// Type definitions for categories
type ApplicantType = 'individual' | 'company';
type CategoriesData = {
  [key: string]: {
    [category: string]: string[];
  };
};

// Helper functions for categories
const getAvailableCategories = (applicantType: ApplicantType): string[] => {
  const categories = bankCategories as CategoriesData;
  const commonCategories = Object.keys(categories['для любого типа'] || {});
  
  if (applicantType === 'individual') {
    return [...commonCategories, ...Object.keys(categories['Физ.лицо'] || {})];
  } else {
    // company - только общие категории
    return commonCategories;
  }
};

const getAvailableSubcategories = (applicantType: ApplicantType, category: string): string[] => {
  const categories = bankCategories as CategoriesData;
  
  // Сначала проверяем в специфичных категориях для типа заявителя
  if (applicantType === 'individual' && categories['Физ.лицо']?.[category]) {
    return categories['Физ.лицо'][category].filter(sub => sub !== '');
  }
  
  // Затем проверяем в общих категориях
  if (categories['для любого типа']?.[category]) {
    return categories['для любого типа'][category].filter(sub => sub !== '');
  }
  
  return [];
};

// Solution templates for different response forms
const SOLUTION_TEMPLATES = {
  'Шаблон для кредита': `Уважаемый клиент!

По результатам рассмотрения Вашего обращения сообщаем следующее:

Ваш вопрос по кредитному продукту был рассмотрен. Согласно условиям кредитного договора №_____ от ________, процентная ставка составляет ___%. График платежей был предоставлен при оформлении кредита.

Дополнительную информацию Вы можете получить:
- По телефону горячей линии: 8-800-xxx-xx-xx
- В личном кабинете на сайте банка
- В любом отделении банка

С уважением,
Служба поддержки клиентов`,

  'Шаблон для вклада': `Уважаемый клиент!

По результатам рассмотрения Вашего обращения сообщаем следующее:

Ваш депозитный счет №_____ открыт ________ на срок _____ месяцев под ____% годовых. Согласно условиям договора банковского вклада, начисление процентов производится ежемесячно/ежеквартально.

Информация о состоянии вклада доступна:
- В мобильном приложении банка
- В личном кабинете на сайте
- По телефону: 8-800-xxx-xx-xx

С уважением,
Служба поддержки клиентов`,

  'Шаблон для карты': `Уважаемый клиент!

По результатам рассмотрения Вашего обращения сообщаем следующее:

Ваша банковская карта **** **** **** ____ активна и готова к использованию. Лимит операций по карте составляет _____ рублей в сутки. Для увеличения лимита Вы можете обратиться в отделение банка или оставить заявку в мобильном приложении.

Служба поддержки клиентов работает круглосуточно:
- Телефон: 8-800-xxx-xx-xx
- Чат в мобильном приложении
- Онлайн-консультант на сайте банка

С уважением,
Служба поддержки клиентов`
};

// Knowledge base data
const KNOWLEDGE_BASE = [
  {
    id: 1,
    category: 'Кредитование',
    subcategory: 'Начисление процентов',
    sla: null,
    gradient: 'from-pink-100 to-purple-100',
    instruction: {
      title: 'Инструкция: Начисление процентов по кредиту',
      sections: [
        {
          subtitle: '1. Основная информация',
          content: 'При обращении клиента по вопросу начисления процентов необходимо проверить кредитный договор и историю платежей в системе.'
        },
        {
          subtitle: '2. Порядок действий',
          content: '• Запросить номер кредитного договора\n• Проверить график платежей в ЦФТ\n• Сверить процентную ставку по договору\n• Рассчитать начисленные проценты\n• Объяснить клиенту порядок начисления'
        },
        {
          subtitle: '3. Типовые ситуации',
          content: '• Изменение процентной ставки - проверить наличие уведомления\n• Расхождение в расчетах - провести перерасчет\n• Досрочное погашение - пересчитать проценты с учетом даты платежа'
        },
        {
          subtitle: '4. Шаблон ответа',
          content: 'Уважаемый клиент! По Вашему кредитному договору №___ от ___ процентная ставка составляет ___%. Проценты начисляются ежедневно на остаток задолженности. График платежей предоставлен при оформлении кредита.'
        }
      ]
    }
  },
  {
    id: 2,
    category: 'Кредитование',
    subcategory: 'Досрочное погашение',
    sla: null,
    gradient: 'from-pink-100 to-purple-100',
    instruction: {
      title: 'Инструкция: Досрочное погашение кредита',
      sections: [
        {
          subtitle: '1. Основная информация',
          content: 'Клиент имеет право досрочно погасить кредит полностью или частично без комиссий и штрафов согласно законодательству РФ.'
        },
        {
          subtitle: '2. Порядок действий',
          content: '• Принять заявление на досрочное погашение (минимум за 3 рабочих дня)\n• Рассчитать сумму для погашения на дату платежа\n• Проверить наличие задолженности по процентам\n• Сформировать график платежей после досрочного погашения\n• Направить клиенту уведомление с суммой'
        },
        {
          subtitle: '3. Важные нюансы',
          content: '• При полном досрочном погашении - закрыть кредит и выдать справку\n• При частичном - предложить варианты: уменьшение суммы платежа или срока кредита\n• Перерасчет процентов производится с даты фактического поступления средств'
        },
        {
          subtitle: '4. Сроки',
          content: 'Заявление подается не менее чем за 3 рабочих дня. Справка о полном погашении выдается в течение 5 рабочих дней.'
        }
      ]
    }
  },
  {
    id: 3,
    category: 'Карты',
    subcategory: 'Блокировка карты',
    sla: null,
    gradient: 'from-purple-100 to-blue-100',
    instruction: {
      title: 'Инструкция: Блокировка банковской карты',
      sections: [
        {
          subtitle: '1. Причины блокировки',
          content: '• Утеря или кража карты\n• Подозрительные операции (служба безопасности)\n• Компрометация карточных данных\n• Блокировка по заявлению клиента\n• Истечение срока действия'
        },
        {
          subtitle: '2. Порядок действий при обращении',
          content: '• Идентифицировать клиента (ФИО, паспорт, кодовое слово)\n• Уточнить причину блокировки\n• Проверить статус карты в системе\n• Если блокировка клиентом - немедленно заблокировать\n• Если служба безопасности - соединить с СБ\n• Оформить заявление на выпуск новой карты'
        },
        {
          subtitle: '3. Сроки разблокировки',
          content: 'Разблокировка по заявлению клиента - в течение 1 часа. Блокировка СБ - только после служебного расследования. Перевыпуск карты - 5-7 рабочих дней.'
        },
        {
          subtitle: '4. Важно',
          content: 'При утере/краже немедленно блокировать карту! Операции после блокировки клиент не оспаривает.'
        }
      ]
    }
  },
  {
    id: 4,
    category: 'Карты',
    subcategory: 'Ошибка списания',
    sla: null,
    gradient: 'from-purple-100 to-blue-100',
    instruction: {
      title: 'Инструкция: Ошибка списания по карте',
      sections: [
        {
          subtitle: '1. Типы ошибок',
          content: '• Двойное списание\n• Списание без авторизации клиента\n• Неверная сумма операции\n• Списание после возврата товара\n• Списание с заблокированной карты'
        },
        {
          subtitle: '2. Первичные действия',
          content: '• Запросить детали операции (дата, время, сумма, мерчант)\n• Проверить операцию в банковской системе\n• Уточнить статус операции (успешная/отклоненная/в обработке)\n• Проверить наличие авторизации\n• Сверить данные с чеком клиента'
        },
        {
          subtitle: '3. Процедура рекламации',
          content: '• Оформить заявление на рекламацию\n• Запросить подтверждающие документы (чек, скриншоты)\n• Зарегистрировать обращение в процессинге\n• Срок рассмотрения - до 30 календарных дней\n• При подтверждении ошибки - возврат средств'
        },
        {
          subtitle: '4. Превентивные меры',
          content: 'Рекомендовать клиенту подключить SMS/Push уведомления для контроля операций.'
        }
      ]
    }
  },
  {
    id: 5,
    category: 'Эквайринг',
    subcategory: 'Сбой',
    sla: 'SLA 1д',
    gradient: 'from-blue-100 to-purple-100',
    instruction: {
      title: 'Инструкция: Сбой в работе эквайринга',
      sections: [
        {
          subtitle: '1. Критичность обращения',
          content: 'ВНИМАНИЕ! Обращения по эквайрингу имеют повышенный приоритет - SLA 1 рабочий день! Сбой эквайринга влияет на бизнес клиента.'
        },
        {
          subtitle: '2. Типы сбоев',
          content: '• Терминал не принимает карты\n• Ошибка связи с процессингом\n• Отклонение всех транзакций\n• Зависание терминала\n• Отсутствие чековой ленты (технический сбой)'
        },
        {
          subtitle: '3. Срочные действия',
          content: '• Зафиксировать точное время сбоя\n• Запросить номер терминала и точку установки\n• Проверить статус терминала в системе\n• Проверить связь с процессинговым центром\n• При массовом сбое - эскалация в техподдержку\n• Создать инцидент с приоритетом "Высокий"'
        },
        {
          subtitle: '4. Временное решение',
          content: 'Предложить клиенту использовать резервный терминал (если есть) или онлайн-оплату. Организовать выезд технического специалиста в течение 4 часов.'
        },
        {
          subtitle: '5. Обратная связь',
          content: 'Обязательно связаться с клиентом после устранения сбоя и подтвердить работоспособность!'
        }
      ]
    }
  },
  {
    id: 6,
    category: 'Вклады',
    subcategory: 'Пролонгация вклада',
    sla: null,
    gradient: 'from-green-100 to-blue-100',
    instruction: {
      title: 'Инструкция: Пролонгация вклада',
      sections: [
        {
          subtitle: '1. Основная информация',
          content: 'Пролонгация - автоматическое или по заявлению продление срочного вклада на новый срок после окончания предыдущего.'
        },
        {
          subtitle: '2. Типы пролонгации',
          content: '• Автоматическая - прописана в договоре вклада\n• По заявлению клиента - требует письменного согласия\n• С капитализацией процентов - проценты добавляются к сумме вклада\n• Без капитализации - проценты выплачиваются на отдельный счет'
        },
        {
          subtitle: '3. Порядок действий',
          content: '• Проверить условия вклада в договоре\n• Уточнить желание клиента продлить вклад\n• Предложить актуальные процентные ставки\n• Оформить доп. соглашение (если ставка изменилась)\n• Разъяснить условия новой пролонгации'
        },
        {
          subtitle: '4. Важные моменты',
          content: '• При автопролонгации ставка может измениться согласно тарифам банка\n• Клиент вправе отказаться от пролонгации и забрать средства\n• Уведомление о пролонгации направляется за 7 дней до окончания срока вклада\n• При досрочном расторжении после пролонгации - проценты по ставке "до востребования"'
        }
      ]
    }
  },
  {
    id: 7,
    category: 'Платежи',
    subcategory: 'Невыполнение платежа',
    sla: null,
    gradient: 'from-yellow-100 to-orange-100',
    instruction: {
      title: 'Инструкция: Невыполнение платежа',
      sections: [
        {
          subtitle: '1. Причины невыполнения',
          content: '• Недостаточно средств на счете\n• Неверные реквизиты получателя\n• Превышен лимит операций\n• Счет заблокирован (115-ФЗ, исполнительное производство)\n• Технический сбой в платежной системе\n• Санкционные ограничения'
        },
        {
          subtitle: '2. Диагностика проблемы',
          content: '• Запросить детали платежа (сумма, получатель, дата)\n• Проверить статус платежа в системе\n• Проверить баланс счета\n• Проверить корректность реквизитов\n• Проверить наличие блокировок и ограничений\n• Проверить лимиты по операциям'
        },
        {
          subtitle: '3. Действия по решению',
          content: '• Недостаточно средств - попросить пополнить счет\n• Неверные реквизиты - помочь скорректировать и создать новый платеж\n• Блокировка - направить в службу безопасности\n• Технический сбой - повторить операцию или эскалация\n• Лимит - увеличить лимит или разбить платеж'
        },
        {
          subtitle: '4. Сроки',
          content: 'Внутрибанковские платежи - мгновенно. Межбанковские платежи - до 3 рабочих дней. Международные - до 5 рабочих дней.'
        }
      ]
    }
  },
  {
    id: 8,
    category: 'Взаимодействие в рамках 230-ФЗ',
    subcategory: 'Частота взаимодействия',
    sla: null,
    gradient: 'from-red-100 to-pink-100',
    instruction: {
      title: 'Инструкция: Взаимодействие с должниками по ФЗ-230',
      sections: [
        {
          subtitle: '1. Основные положения',
          content: 'ФЗ-230 "О защите прав и законных интересов физических лиц при осуществлении деятельности по возврату просроченной задолженности" регламентирует частоту и способы взаимодействия с должниками.'
        },
        {
          subtitle: '2. Ограничения по частоте',
          content: '• Телефонные звонки: не более 1 раза в сутки, не более 2 раз в неделю, не более 8 раз в месяц\n• Личные встречи: не более 1 раза в неделю\n• Запрещено взаимодействие с 22:00 до 08:00 (по местному времени должника)\n• Запрещено взаимодействие в нерабочие праздничные и выходные дни'
        },
        {
          subtitle: '3. Порядок действий при обращении',
          content: '• Зафиксировать жалобу на превышение частоты контактов\n• Проверить логи взаимодействий в CRM\n• Подсчитать количество контактов за отчетный период\n• Если выявлено нарушение - приостановить взаимодействие и уведомить коллекторский отдел\n• Принести извинения клиенту\n• Направить письменный ответ с объяснениями'
        },
        {
          subtitle: '4. Ответственность',
          content: 'Нарушение требований ФЗ-230 влечет административную ответственность для кредитной организации. За систематические нарушения - отзыв лицензии.'
        }
      ]
    }
  },
  {
    id: 9,
    category: 'Взаимодействие в рамках 152-ФЗ',
    subcategory: 'Обработка персональных данных',
    sla: null,
    gradient: 'from-indigo-100 to-purple-100',
    instruction: {
      title: 'Инструкция: Обработка персональных данных (ФЗ-152)',
      sections: [
        {
          subtitle: '1. Основные принципы',
          content: 'Персональные данные обрабатываются только при наличии согласия субъекта или на законном основании (исполнение договора, защита жизни и здоровья).'
        },
        {
          subtitle: '2. Права субъекта ПД',
          content: '• Право на доступ к своим персональным данным\n• Право на уточнение, блокирование или уничтожение данных\n• Право на отзыв согласия на обработку\n• Право на получение информации об обработке данных\n• Право обжаловать действия банка в Роскомнадзор'
        },
        {
          subtitle: '3. Порядок обработки запроса',
          content: '• Идентифицировать клиента\n• Принять письменный запрос\n• Зарегистрировать обращение\n• Направить в отдел защиты информации\n• Срок ответа - 10 рабочих дней\n• Предоставить запрашиваемую информацию или мотивированный отказ'
        },
        {
          subtitle: '4. Отзыв согласия',
          content: 'При отзыве согласия на обработку ПД банк обязан прекратить обработку данных в течение 3 рабочих дней, если нет законных оснований для продолжения (исполнение договора кредита/вклада).'
        }
      ]
    }
  },
  {
    id: 10,
    category: 'Дистанционные сервисы',
    subcategory: 'Мобильный банк',
    sla: null,
    gradient: 'from-cyan-100 to-blue-100',
    instruction: {
      title: 'Инструкция: Проблемы с мобильным банком',
      sections: [
        {
          subtitle: '1. Типичные проблемы',
          content: '• Не удается войти в приложение (неверный пароль, блокировка)\n• Не отображается баланс или история операций\n• Ошибка при проведении платежа\n• Не приходит SMS с кодом подтверждения\n• Приложение зависает или вылетает\n• Не работает биометрическая аутентификация'
        },
        {
          subtitle: '2. Первичная диагностика',
          content: '• Уточнить модель телефона и версию ОС\n• Проверить версию приложения (рекомендовать обновить)\n• Проверить статус клиента в системе (блокировки)\n• Проверить наличие интернет-соединения у клиента\n• Попросить перезапустить приложение\n• Попросить очистить кеш приложения'
        },
        {
          subtitle: '3. Решение проблем',
          content: '• Блокировка входа - сброс пароля через SMS или отделение\n• Технические проблемы - переустановка приложения\n• Проблемы с платежами - использовать веб-версию банка\n• Не приходит SMS - проверить номер телефона в базе, перевыпустить SIM\n• Критические ошибки - эскалация в техподдержку'
        },
        {
          subtitle: '4. Превентивные рекомендации',
          content: 'Рекомендовать клиенту: регулярно обновлять приложение, не использовать root/jailbreak устройства, подключить биометрию, включить push-уведомления.'
        }
      ]
    }
  },
  {
    id: 11,
    category: 'Поведение и квалификация сотрудников',
    subcategory: 'Некорректное общение',
    sla: null,
    gradient: 'from-orange-100 to-red-100',
    instruction: {
      title: 'Инструкция: Жалоба на поведение сотрудника',
      sections: [
        {
          subtitle: '1. КРИТИЧНОСТЬ',
          content: 'ВНИМАНИЕ! Жалобы на поведение сотрудников имеют повышенный приоритет и требуют немедленного реагирования. Негатив влияет на репутацию банка!'
        },
        {
          subtitle: '2. Сбор информации',
          content: '• ФИО сотрудника или должность\n• Дата, время и место инцидента\n• Суть жалобы (грубость, хамство, некомпетентность)\n• Наличие свидетелей\n• Последствия для клиента (материальный или моральный ущерб)'
        },
        {
          subtitle: '3. Немедленные действия',
          content: '• Принести извинения от имени банка\n• Зафиксировать жалобу с максимальными подробностями\n• Эскалация руководителю подразделения\n• Уведомить HR и службу качества\n• Назначить служебное расследование\n• Срок ответа клиенту - 3 рабочих дня'
        },
        {
          subtitle: '4. Компенсационные меры',
          content: '• Извинения от руководства\n• Гарантия проведения беседы с сотрудником\n• Компенсация морального вреда (по согласованию)\n• Назначение персонального менеджера\n• Бонусы/льготы по продуктам банка'
        }
      ]
    }
  },
  {
    id: 12,
    category: 'Ошибка Банка',
    subcategory: 'Технический сбой',
    sla: '4 часа',
    gradient: 'from-rose-100 to-pink-100',
    instruction: {
      title: 'Инструкция: Технический сбой в системах банка',
      sections: [
        {
          subtitle: '1. СРОЧНОСТЬ',
          content: 'SLA: 4 часа! Технические сбои критично влияют на обслуживание клиентов. Требуется немедленная эскалация.'
        },
        {
          subtitle: '2. Типы сбоев',
          content: '• Недоступность интернет-банка\n• Сбой в работе АБС (автоматизированная банковская система)\n• Проблемы с процессингом карт\n• Ошибки в мобильном приложении\n• Недоступность платежной системы\n• Сбой эквайринга'
        },
        {
          subtitle: '3. Протокол действий',
          content: '• Зафиксировать точное время сбоя\n• Определить масштаб (локальный или массовый)\n• Проверить статус систем в мониторинге\n• Немедленная эскалация в IT-департамент\n• Создать инцидент с приоритетом "Критический"\n• Уведомить клиента о проблеме и сроках устранения\n• Предложить альтернативные каналы обслуживания'
        },
        {
          subtitle: '4. Коммуникация с клиентом',
          content: 'Обязательно информировать клиента о ходе решения проблемы каждые 2 часа. После устранения - подтвердить работоспособность и извиниться за неудобства.'
        }
      ]
    }
  },
  {
    id: 13,
    category: 'Запрос документов',
    subcategory: 'Справка/выписка',
    sla: null,
    gradient: 'from-teal-100 to-green-100',
    instruction: {
      title: 'Инструкция: Предоставление справок и выписок',
      sections: [
        {
          subtitle: '1. Виды документов',
          content: '• Справка об отсутствии задолженности\n• Справка о закрытии кредита\n• Выписка по счету\n• График платежей\n• Справка 2-НДФЛ (по вкладам)\n• Справка для визы\n• Справка о движении средств'
        },
        {
          subtitle: '2. Порядок предоста��ления',
          content: '• Идентифицировать клиента (паспорт)\n• Принять письменное заявление\n• Уточнить период и форму предоставления (на руки, email, через отделение)\n• Проверить наличие задолженности по комиссиям\n• Сформировать документ в системе\n• Заверить подписью уполномоченного лица и печатью'
        },
        {
          subtitle: '3. Сроки предоставления',
          content: '• Выписка по счету - мгновенно (через интернет-банк)\n• Справка об отсутствии задолженности - в течение 1 рабочего дня\n• Справка о закрытии кредита - 5 рабочих дней после полного погашения\n• Архивные выписки (> 3 лет) - до 10 рабочих дней'
        },
        {
          subtitle: '4. Стоимость услуги',
          content: 'Первая выписка за месяц - бесплатно. Повторные выписки и архивные справки - согласно тарифам банка (обычно 200-500 руб.).'
        }
      ]
    }
  },
  {
    id: 14,
    category: 'Благодарность',
    subcategory: 'Качество обслуживания',
    sla: null,
    gradient: 'from-green-100 to-emerald-100',
    instruction: {
      title: 'Инструкция: Регистрация благодарности',
      sections: [
        {
          subtitle: '1. Важность позитивной обратной связи',
          content: 'Благодарности клиентов - важный показатель качества работы. Они влияют на мотивацию сотрудников и KPI подразделений.'
        },
        {
          subtitle: '2. Информация для фиксации',
          content: '• ФИО сотрудника или номер отделения\n• Дата и время обслуживания\n• Суть благодарности (что именно понравилось)\n• Контакты клиента для обратной связи (опционально)'
        },
        {
          subtitle: '3. Регистрация',
          content: '• Зафиксировать благодарность в CRM\n• Уведомить руководителя сотрудника\n• Направить информацию в отдел качества\n• Поблагодарить клиента за обратную связь\n• Предложить клиенту оставить отзыв на внешних площадках'
        },
        {
          subtitle: '4. Поощрение сотрудника',
          content: 'Благодарности учитываются в системе мотивации персонала. При накоплении определенного количества положительных отзывов - премирование, грамоты, публичное признание.'
        }
      ]
    }
  }
];

// TEST CLIENT DATABASE
const TEST_CLIENTS = [
  // Individual Clients
  {
    type: 'individual',
    name: 'Райан Гослинг',
    birthDate: '1980-11-12',
    phone: '+7 (999) 111-22-33',
    isClient: true,
    hasPersonalManager: true,
    personalManager: 'Ярослав Дудченко',
    appealHistory: 3
  },
  {
    type: 'individual',
    name: 'Солодовник Александр Викторович',
    birthDate: '1985-03-15',
    phone: '+7 (912) 345-67-89',
    isClient: true,
    hasPersonalManager: false,
    personalManager: null,
    appealHistory: 1
  },
  {
    type: 'individual',
    name: 'Иванова Мария Петровна',
    birthDate: '1992-07-22',
    phone: '+7 (903) 456-78-90',
    isClient: true,
    hasPersonalManager: true,
    personalManager: 'Анна Смирнова',
    appealHistory: 5
  },
  {
    type: 'individual',
    name: 'Петров Сергей Николаевич',
    birthDate: '1978-12-05',
    phone: '+7 (916) 234-56-78',
    isClient: false,
    hasPersonalManager: false,
    personalManager: null,
    appealHistory: 0
  },
  {
    type: 'individual',
    name: 'Козлова Елена Андреевна',
    birthDate: '1995-09-18',
    phone: '+7 (925) 678-90-12',
    isClient: true,
    hasPersonalManager: false,
    personalManager: null,
    appealHistory: 2
  },
  
  // Company Clients
  {
    type: 'company',
    name: 'Центральный Банк Российской Федерации',
    inn: '7702235133',
    kpp: '770201001',
    address: 'г. Москва, ул. Неглинная, д. 12',
    isClient: true,
    hasPersonalManager: true,
    personalManager: 'Дмитрий Волков',
    appealHistory: 8
  },
  {
    type: 'company',
    name: 'ООО Ромашка',
    inn: '7743123456',
    kpp: '774301001',
    address: 'г. Москва, ул. Тверская, д. 5, офис 301',
    isClient: true,
    hasPersonalManager: false,
    personalManager: null,
    appealHistory: 4
  },
  {
    type: 'company',
    name: 'АО Газпром',
    inn: '7736050003',
    kpp: '773601001',
    address: 'г. Москва, ул. Наметкина, д. 16',
    isClient: true,
    hasPersonalManager: true,
    personalManager: 'Ольга Петрова',
    appealHistory: 12
  },
  {
    type: 'company',
    name: 'ИП Кузнецов Иван Иванович',
    inn: '773456789012',
    kpp: '',
    address: 'г. Санкт-Петербург, Невский проспект, д. 28',
    isClient: false,
    hasPersonalManager: false,
    personalManager: null,
    appealHistory: 0
  },
  {
    type: 'company',
    name: 'ПАО Сбербанк',
    inn: '7707083893',
    kpp: '773601001',
    address: 'г. Москва, ул. Вавилова, д. 19',
    isClient: true,
    hasPersonalManager: true,
    personalManager: 'Екатерина Морозова',
    appealHistory: 15
  }
];

// REGISTRATION CABINET COMPONENT (кабинет регистратора - по умолчанию)
function RegistrationCabinet({ onCreateAppeal, onRegisterWrittenAppeal, stats }: { 
  onCreateAppeal: () => void, 
  onRegisterWrittenAppeal: () => void,
  stats: { withoutErrors: number, withErrors: number, total: number } 
}) {
  const [unregisteredAppeals, setUnregisteredAppeals] = useState(5);

  // Load unregistered appeals from localStorage
  useEffect(() => {
    // Initialize test notifications on first load
    initializeTestNotifications();
    
    const loadUnregisteredAppeals = () => {
      const saved = localStorage.getItem('unregisteredWrittenAppeals');
      if (saved) {
        try {
          setUnregisteredAppeals(parseInt(saved));
        } catch (error) {
          console.error('Failed to parse unregistered appeals:', error);
        }
      } else {
        // If no saved value, initialize with 5 and save to localStorage
        localStorage.setItem('unregisteredWrittenAppeals', '5');
        setUnregisteredAppeals(5);
      }
    };

    loadUnregisteredAppeals();

    // Listen for storage changes to update the counter
    window.addEventListener('storage', loadUnregisteredAppeals);
    
    return () => {
      window.removeEventListener('storage', loadUnregisteredAppeals);
    };
  }, []);

  const handleAddWrittenAppeal = () => {
    const newCount = unregisteredAppeals + 1;
    setUnregisteredAppeals(newCount);
    localStorage.setItem('unregisteredWrittenAppeals', newCount.toString());
    
    // Generate notification for written appeal
    notificationService.addNotification('письменное');
    toast.success('Письменное обращение добавлено в очередь');
  };

  return (
    <div className="pb-12" style={{ background: '#D1C4E9', minHeight: '100vh' }}>
      {/* Google Forms Header */}
      <div className="shadow-md" style={{ backgroundColor: '#673AB7' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-normal text-white">Кабинет регистратора</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-normal text-gray-900 mb-2">
            Создание и учет обращений клиентов
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Регистрируйте новые обращения и отслеживайте статистику
          </p>
          <button
            onClick={onCreateAppeal}
            className="px-8 py-3 bg-white border-2 rounded font-medium transition-colors hover:text-white"
            style={{ 
              borderColor: '#673AB7', 
              color: '#673AB7'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#673AB7';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = '#673AB7';
            }}
          >
            Создать обращение
          </button>
        </div>

        {/* Grid with Unregistered Appeals and Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Unregistered Written Appeals Widget */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Незарегистрированные письменные обращения
            </h3>
            <div className="bg-purple-50 rounded-lg p-5 border-l-4 border-purple-600">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Ожидают регистрации</span>
                  <button
                    onClick={handleAddWrittenAppeal}
                    className="p-1 rounded hover:bg-purple-200 transition-colors"
                    title="Добавить письменное обращение"
                  >
                    <Plus className="w-4 h-4 text-purple-700" />
                  </button>
                </div>
                {unregisteredAppeals > 0 && (
                  <button
                    onClick={onRegisterWrittenAppeal}
                    className="px-3 py-2 text-sm font-medium transition-colors rounded hover:opacity-90 text-center leading-tight"
                    style={{ backgroundColor: '#673AB7', color: 'white' }}
                  >
                    Зарегистрировать<br />обращение
                  </button>
                )}
              </div>
              <div className="text-4xl font-normal text-purple-600 mb-1">
                {unregisteredAppeals}
              </div>
              <div className="text-xs text-purple-700">
                письменных обращений в очереди
              </div>
            </div>
          </div>

          {/* Statistics Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Статистика за этот месяц
            </h3>

            <div className="space-y-3">
              {/* Without Errors */}
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Без ошибок</span>
                  </div>
                  <div className="text-2xl font-normal text-green-600">
                    {stats.withoutErrors}
                  </div>
                </div>
              </div>

              {/* With Errors */}
              <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-red-900">С ошибками</span>
                  </div>
                  <div className="text-2xl font-normal text-red-600">
                    {stats.withErrors}
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Всего</span>
                  </div>
                  <div className="text-2xl font-normal text-blue-600">
                    {stats.total}
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

// REGISTRATION CARD COMPONENT (карточка регистрации - в стиле Google Forms)
function RegistrationCard({ onBack, onRegisterSuccess }: { onBack: () => void, onRegisterSuccess: () => void }) {
  // Auto-generated appeal number
  const [appealNumber, setAppealNumber] = useState('');
  
  // Form fields
  const [applicantType, setApplicantType] = useState<'individual' | 'company'>('individual');
  const [applicantName, setApplicantName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [clientStatus, setClientStatus] = useState<'client' | 'nonclient' | null>(null);
  const [registratorName, setRegistratorName] = useState('');
  const [responsibleName, setResponsibleName] = useState('');
  const [personalManager, setPersonalManager] = useState('');
  const [inn, setInn] = useState('');
  const [kpp, setKpp] = useState('');
  const [address, setAddress] = useState('');
  const [appealTheme, setAppealTheme] = useState('');
  const [appealType, setAppealType] = useState<'oral' | 'written' | 'regulator'>('oral');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [appealContent, setAppealContent] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [plannedDate, setPlannedDate] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [actualDate, setActualDate] = useState('');
  const [resolvedImmediately, setResolvedImmediately] = useState(false);
  const [solutionDescription, setSolutionDescription] = useState('');
  const [responseForm, setResponseForm] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Knowledge Base Modal states
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
  const [selectedKnowledgeItem, setSelectedKnowledgeItem] = useState<typeof KNOWLEDGE_BASE[0] | null>(null);

  // Refs for validation scrolling
  const applicantNameRef = useRef<HTMLDivElement>(null);
  const birthDateRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const organizationNameRef = useRef<HTMLDivElement>(null);
  const innRef = useRef<HTMLDivElement>(null);
  const kppRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const appealContentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Error highlighting state
  const [highlightedField, setHighlightedField] = useState<string | null>(null);

  // Auto-filled fields
  const registratorNameAuto = 'Петров Петр Петрович';
  const hasPersonalManager = personalManager !== '';

  useEffect(() => {
    // Generate appeal number
    const generatedId = appealStorage.generateId();
    setAppealNumber(generatedId);
    
    const today = new Date();
    setRegistrationDate(today.toLocaleDateString('ru-RU'));
    
    // Calculate planned date (+7 days)
    const planned = new Date(today);
    planned.setDate(planned.getDate() + 7);
    setPlannedDate(planned.toLocaleDateString('ru-RU'));
    
    // Calculate report date (+5 days)
    const report = new Date(today);
    report.setDate(report.getDate() + 5);
    setReportDate(report.toLocaleDateString('ru-RU'));
  }, []);

  // Set actual date to today when resolved immediately is checked
  useEffect(() => {
    if (resolvedImmediately) {
      const today = new Date();
      setActualDate(today.toISOString().split('T')[0]);
    } else {
      setActualDate('');
    }
  }, [resolvedImmediately]);

  // Remove error highlight after 10 seconds
  useEffect(() => {
    if (highlightedField) {
      const timer = setTimeout(() => {
        setHighlightedField(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [highlightedField]);

  // Auto-search client when name is entered (with debounce)
  useEffect(() => {
    const searchTerm = applicantType === 'individual' ? applicantName : organizationName;
    
    if (searchTerm.trim().length > 2) {
      const timer = setTimeout(() => {
        const foundClient = TEST_CLIENTS.find(client => 
          client.type === applicantType && 
          client.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (foundClient) {
          setClientStatus('client');
          
          // Auto-fill individual fields
          if (foundClient.type === 'individual') {
            setApplicantName(foundClient.name);
            setBirthDate(foundClient.birthDate);
            setPhone(foundClient.phone);
          }
          
          // Auto-fill company fields
          if (foundClient.type === 'company') {
            setOrganizationName(foundClient.name);
            setInn(foundClient.inn);
            setKpp(foundClient.kpp);
            setAddress(foundClient.address);
          }
          
          // Set personal manager and auto-fill responsible if personal manager exists
          if (foundClient.hasPersonalManager) {
            setPersonalManager(foundClient.personalManager);
            setResponsibleName(foundClient.personalManager); // Auto-fill responsible
          } else {
            setPersonalManager('');
            setResponsibleName(''); // Clear responsible if no personal manager
          }
        } else {
          setClientStatus('nonclient');
          setPersonalManager('');
          setResponsibleName(''); // Clear responsible for non-clients
        }
      }, 500); // 500ms debounce delay
      
      return () => clearTimeout(timer);
    } else if (searchTerm.trim().length === 0) {
      // Reset status when field is cleared
      setClientStatus(null);
      setPersonalManager('');
      setResponsibleName('');
    }
  }, [applicantName, organizationName, applicantType]);

  const handleSearchClient = () => {
    const searchTerm = applicantType === 'individual' ? applicantName : organizationName;
    if (searchTerm.trim()) {
      const foundClient = TEST_CLIENTS.find(client => 
        client.type === applicantType && client.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (foundClient) {
        setClientStatus('client');
        
        // Auto-fill individual fields
        if (foundClient.type === 'individual') {
          setApplicantName(foundClient.name);
          setBirthDate(foundClient.birthDate);
          setPhone(foundClient.phone);
        }
        
        // Auto-fill company fields
        if (foundClient.type === 'company') {
          setOrganizationName(foundClient.name);
          setInn(foundClient.inn);
          setKpp(foundClient.kpp);
          setAddress(foundClient.address);
        }
        
        // Set personal manager and auto-fill responsible if personal manager exists
        if (foundClient.hasPersonalManager) {
          setPersonalManager(foundClient.personalManager);
          setResponsibleName(foundClient.personalManager); // Auto-fill responsible
        } else {
          setPersonalManager('');
          setResponsibleName(''); // Clear responsible if no personal manager
        }
      } else {
        setClientStatus('nonclient');
        setPersonalManager('');
        setResponsibleName(''); // Clear responsible for non-clients
      }
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setAttachments(prev => [...prev, ...newFiles]);
      toast.success(`Добавлено файлов: ${newFiles.length}`);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleSubmit = async () => {
    // Validate required fields and scroll to first empty field
    if (applicantType === 'individual') {
      if (!applicantName.trim()) {
        applicantNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedField('applicantName');
        toast.error('Заполните обязательные поля', { duration: 10000 });
        return;
      }
      if (!birthDate) {
        birthDateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedField('birthDate');
        toast.error('Заполните обязательные поля', { duration: 10000 });
        return;
      }
      if (!phone.trim()) {
        phoneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedField('phone');
        toast.error('Заполните обязательные поля', { duration: 10000 });
        return;
      }
    } else if (applicantType === 'company') {
      if (!organizationName.trim()) {
        organizationNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedField('organizationName');
        toast.error('Заполните обязательные поля', { duration: 10000 });
        return;
      }
      if (!inn.trim()) {
        innRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedField('inn');
        toast.error('Заполните обязательные поля', { duration: 10000 });
        return;
      }
      if (!kpp.trim()) {
        kppRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedField('kpp');
        toast.error('Заполните обязательные поля', { duration: 10000 });
        return;
      }
      if (!address.trim()) {
        addressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedField('address');
        toast.error('Заполните обязательные поля', { duration: 10000 });
        return;
      }
    }
    
    if (!category) {
      categoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedField('category');
      toast.error('Заполните обязательные поля', { duration: 10000 });
      return;
    }
    
    if (!appealContent.trim()) {
      appealContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedField('appealContent');
      toast.error('Заполните обязательные поля', { duration: 10000 });
      return;
    }

    // All validations passed - save appeal to storage
    const newAppealId = appealStorage.generateId();
    
    // Рассчитываем дедлайн в зависимости от типа обращения
    const today = new Date();
    const deadline = new Date(today);
    if (appealType === 'oral') {
      deadline.setDate(deadline.getDate() + 7); // Устные - 7 дней
    } else if (appealType === 'written') {
      deadline.setDate(deadline.getDate() + 15); // Письменные - 15 дней
    } else {
      deadline.setDate(deadline.getDate() + 3); // Регуляторные - 3 дня
    }
    
    const respTrim = (responsibleName || '').trim()
    const hasAssignee = Boolean(respTrim) && respTrim !== 'Не назначено'
    const cabinetStatus = hasAssignee ? 'На ответственном, взято' : 'Назначено'

    const channelLabel =
      appealType === 'oral' ? 'Устное' : appealType === 'written' ? 'Письменное' : 'Регулятор'

    const newAppeal: Appeal = {
      id: newAppealId,
      regDate: registrationDate,
      category: channelLabel,
      subcategory,
      status: cabinetStatus,
      deadline: deadline.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' }),
      responsible: respTrim || 'Не назначено',
      applicantName: applicantType === 'individual' ? applicantName : 'N/A',
      organizationName: applicantType === 'company' ? organizationName : 'N/A',
      address: address || 'N/A',
      cbs: 'N/A',
      type: applicantType === 'individual' ? 'Физ лицо' : 'Юр лицо',
      isMine: false,
      content: appealContent,
      solution: solutionDescription || '',
      response: responseForm || '',
      phone: phone || '',
      email: email || '',
      appealType: channelLabel as Appeal['appealType'],
      inn: applicantType === 'company' ? inn : undefined,
      createdBy: registratorName || 'Регистратор',
      updatedAt: new Date().toISOString(),
    };

    const result = await persistRegisteredAppeal(newAppeal, (a) => appealStorage.saveAppeal(a));

    if (result.apiSynced && result.ok) {
      toast.success(`Обращение №${result.appeal.id} зарегистрировано!`, {
        description: `Статус: «${result.appeal.status}», срок исполнения: ${result.appeal.deadline}`,
      });
      window.dispatchEvent(new CustomEvent('edo-appeals-changed'));
      onRegisterSuccess();
    } else {
      toast.error('Не удалось сохранить обращение на сервере', {
        description: result.error ?? 'Проверьте API и подключение БД (DATABASE_URL).',
      });
    }
  };

  const handleClearForm = () => {
    // Reset all form fields
    setApplicantType('individual');
    setApplicantName('');
    setBirthDate('');
    setPhone('');
    setEmail('');
    setOrganizationName('');
    setClientStatus(null);
    setRegistratorName('');
    setResponsibleName('');
    setPersonalManager('');
    setInn('');
    setKpp('');
    setAddress('');
    setAppealTheme('');
    setAppealType('oral');
    setCategory('');
    setSubcategory('');
    setPriority('medium');
    setAppealContent('');
    setResolvedImmediately(false);
    setSolutionDescription('');
    setResponseForm('');
    setAttachments([]);
    setHighlightedField(null);

    // Reset dates to current date
    const today = new Date();
    setRegistrationDate(today.toLocaleDateString('ru-RU'));
    
    const planned = new Date(today);
    planned.setDate(planned.getDate() + 7);
    setPlannedDate(planned.toLocaleDateString('ru-RU'));
    
    const report = new Date(today);
    report.setDate(report.getDate() + 5);
    setReportDate(report.toLocaleDateString('ru-RU'));
    
    setActualDate('');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Show success message
    toast.success('Форма очищена');
  };

  return (
    <div style={{ background: '#D1C4E9', paddingBottom: '3rem' }}>
      {/* Google Forms-style Header */}
      <div className="shadow-md" style={{ backgroundColor: '#673AB7' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg transition-colors hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-lg font-medium text-white">Регистрация обращения клиента</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
        {/* Title Block */}
        <div className="bg-white rounded-lg shadow-sm p-5" style={{ borderTop: '8px solid #673AB7' }}>
          <h2 className="text-2xl font-normal text-gray-900 mb-1">
            Регистрация обращения клиента
          </h2>
          <p className="text-sm text-gray-600">
            Заполните все обязательные поля для регистрации обращения
          </p>
        </div>

        {/* Applicant Type */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <label className="block text-base text-gray-900 mb-2">
            Выберите тип заявителя <span className="text-red-600">*</span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setApplicantType('individual');
                setCategory('');
                setSubcategory('');
              }}
              className={`px-5 py-2 text-sm font-medium transition-colors rounded ${
                applicantType === 'individual'
                  ? 'text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-purple-50'
              }`}
              style={applicantType === 'individual' ? { backgroundColor: '#673AB7' } : {}}
            >
              Физлицо
            </button>
            <button
              onClick={() => {
                setApplicantType('company');
                setCategory('');
                setSubcategory('');
              }}
              className={`px-5 py-2 text-sm font-medium transition-colors rounded ${
                applicantType === 'company'
                  ? 'text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-purple-50'
              }`}
              style={applicantType === 'company' ? { backgroundColor: '#673AB7' } : {}}
            >
              Юр лицо
            </button>
          </div>
        </div>

        {/* Appeal Type */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <label className="block text-base text-gray-900 mb-2">
            Выберите тип обращения <span className="text-red-600">*</span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setAppealType('oral')}
              className={`px-5 py-2 text-sm font-medium transition-colors rounded ${
                appealType === 'oral'
                  ? 'text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-purple-50'
              }`}
              style={appealType === 'oral' ? { backgroundColor: '#673AB7' } : {}}
            >
              Устное
            </button>
            <button
              onClick={() => setAppealType('written')}
              className={`px-5 py-2 text-sm font-medium transition-colors rounded ${
                appealType === 'written'
                  ? 'text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-purple-50'
              }`}
              style={appealType === 'written' ? { backgroundColor: '#673AB7' } : {}}
            >
              Письменное
            </button>
            <button
              onClick={() => setAppealType('regulator')}
              className={`px-5 py-2 text-sm font-medium transition-colors rounded ${
                appealType === 'regulator'
                  ? 'text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-purple-50'
              }`}
              style={appealType === 'regulator' ? { backgroundColor: '#673AB7' } : {}}
            >
              Регулятор
            </button>
          </div>
        </div>

        {/* Individual Fields */}
        {applicantType === 'individual' && (
          <>
            {/* Appeal Number - auto-generated */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <label className="block text-base text-gray-900 mb-2">
                Номер обращения
              </label>
              <div className="px-3 py-1.5 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded">
                {appealNumber}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4" ref={applicantNameRef} style={highlightedField === 'applicantName' ? { border: '3px solid #673AB7' } : {}}>
              <label className="block text-base text-gray-900 mb-2">
                ФИО <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="flex-1 text-sm text-gray-700 border border-gray-300 px-3 py-1.5 focus:border-purple-600 focus:outline-none rounded"
                  placeholder="Иванов Иван Иванович"
                />
                <button
                  onClick={handleSearchClient}
                  className="px-4 py-1.5 text-sm font-medium transition-colors rounded bg-white text-gray-700 border border-gray-300 hover:bg-purple-50"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
              {clientStatus && (
                <div className={`mt-2 px-3 py-1.5 rounded text-sm ${
                  clientStatus === 'client' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-orange-50 text-orange-700 border border-orange-200'
                }`}>
                  Статус: {clientStatus === 'client' ? 'Клиент банка' : 'Не клиент банка'}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4" ref={birthDateRef} style={highlightedField === 'birthDate' ? { border: '3px solid #673AB7' } : {}}>
              <label className="block text-base text-gray-900 mb-2">
                Дата рождения <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full text-sm text-gray-700 border border-gray-300 px-3 py-1.5 focus:border-purple-600 focus:outline-none rounded"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4" ref={phoneRef} style={highlightedField === 'phone' ? { border: '3px solid #673AB7' } : {}}>
              <label className="block text-base text-gray-900 mb-2">
                Номер телефона <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-sm text-gray-700 border border-gray-300 px-3 py-1.5 focus:border-purple-600 focus:outline-none rounded"
                placeholder="+7 (999) 123-45-67"
              />
            </div>

            {/* Appeal Content (after phone for individual) */}
            <div className="bg-white rounded-lg shadow-sm p-4" ref={appealContentRef} style={highlightedField === 'appealContent' ? { border: '3px solid #673AB7' } : {}}>
              <label className="block text-base text-gray-900 mb-2">
                Содержание обращения <span className="text-red-600">*</span>
              </label>
              <textarea
                value={appealContent}
                onChange={(e) => setAppealContent(e.target.value)}
                rows={4}
                className="w-full text-sm text-gray-700 border border-gray-300 px-3 py-1.5 focus:border-purple-600 focus:outline-none resize-none rounded"
                placeholder="Опишите суть обращения..."
              />
            </div>

            {/* Attachments (after content) */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <label className="block text-base text-gray-900 mb-2">
                Вложения
              </label>
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-purple-600 bg-purple-50' 
                    : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/30'
                }`}
                style={isDragging ? { outline: '3px solid #673AB7', outlineOffset: '2px' } : {}}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-1">
                  Перетащите файлы сюда или нажмите для выбора
                </p>
                <p className="text-xs text-gray-500">
                  Поддерживаются все форматы файлов
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </div>
              
              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(index);
                        }}
                        className="p-1 hover:bg-red-100 rounded transition-colors"
                      >
                        <XIcon className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Company Fields */}
        {applicantType === 'company' && (
          <>
            {/* Appeal Number - auto-generated */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <label className="block text-base text-gray-900 mb-2">
                Номер обращения
              </label>
              <div className="px-3 py-1.5 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded">
                {appealNumber}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4" ref={organizationNameRef} style={highlightedField === 'organizationName' ? { border: '3px solid #673AB7' } : {}}>
              <label className="block text-base text-gray-900 mb-2">
                Наименование организации <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="flex-1 text-sm text-gray-700 border border-gray-300 px-3 py-1.5 focus:border-purple-600 focus:outline-none rounded"
                  placeholder="ООО Ромашка"
                />
                <button
                  onClick={handleSearchClient}
                  className="px-4 py-1.5 text-sm font-medium transition-colors rounded bg-white text-gray-700 border border-gray-300 hover:bg-purple-50"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
              {clientStatus && (
                <div className={`mt-2 px-3 py-1.5 rounded text-sm ${
                  clientStatus === 'client' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-orange-50 text-orange-700 border border-orange-200'
                }`}>
                  Статус: {clientStatus === 'client' ? 'Клиент банка' : 'Не клиент банка'}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4" ref={innRef} style={highlightedField === 'inn' ? { border: '3px solid #673AB7' } : {}}>
              <label className="block text-base text-gray-900 mb-2">
                ИНН <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={inn}
                onChange={(e) => setInn(e.target.value)}
                className="w-full text-sm text-gray-700 border border-gray-300 px-3 py-1.5 focus:border-purple-600 focus:outline-none rounded"
                placeholder="1234567890"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4" ref={kppRef} style={highlightedField === 'kpp' ? { border: '3px solid #673AB7' } : {}}>
              <label className="block text-base text-gray-900 mb-2">
                КПП <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={kpp}
                onChange={(e) => setKpp(e.target.value)}
                className="w-full text-sm text-gray-700 border border-gray-300 px-3 py-1.5 focus:border-purple-600 focus:outline-none rounded"
                placeholder="123456789"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4" ref={addressRef} style={highlightedField === 'address' ? { border: '3px solid #673AB7' } : {}}>
              <label className="block text-base text-gray-900 mb-2">
                Адрес <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-sm text-gray-700 border border-gray-300 px-3 py-1.5 focus:border-purple-600 focus:outline-none rounded"
                placeholder="г. Москва, ул. Ленина, д. 1"
              />
            </div>

            {/* Appeal Content (after address for company) */}
            <div className="bg-white rounded-lg shadow-sm p-4" ref={appealContentRef} style={highlightedField === 'appealContent' ? { border: '3px solid #673AB7' } : {}}>
              <label className="block text-base text-gray-900 mb-2">
                Содержание обращения <span className="text-red-600">*</span>
              </label>
              <textarea
                value={appealContent}
                onChange={(e) => setAppealContent(e.target.value)}
                rows={4}
                className="w-full text-sm text-gray-700 border border-gray-300 px-3 py-1.5 focus:border-purple-600 focus:outline-none resize-none rounded"
                placeholder="Опишите суть обращения..."
              />
            </div>

            {/* Attachments (after content) */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <label className="block text-base text-gray-900 mb-2">
                Вложения
              </label>
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-purple-600 bg-purple-50' 
                    : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/30'
                }`}
                style={isDragging ? { outline: '3px solid #673AB7', outlineOffset: '2px' } : {}}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-1">
                  Перетащите файлы сюда или нажмите для выбора
                </p>
                <p className="text-xs text-gray-500">
                  Поддерживаются все форматы файлов
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </div>
              
              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(index);
                        }}
                        className="p-1 hover:bg-red-100 rounded transition-colors"
                      >
                        <XIcon className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Appeal History */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <label className="block text-base text-gray-900 mb-2">
            История обращений
          </label>
          <div className="text-sm text-gray-500 italic p-2 border border-gray-200 rounded bg-gray-50">
            {clientStatus === 'client' ? (
              <a href="#" className="text-purple-600 hover:underline">Посмотреть историю обращений</a>
            ) : (
              'Нет данных об обращениях'
            )}
          </div>
        </div>

        {/* Registrator & Responsible */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <label className="block text-base text-gray-900 mb-2">
            ФИО Регистратора
          </label>
          <div className="px-3 py-1.5 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded">
            {registratorNameAuto}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <label className="block text-base text-gray-900 mb-2">
            ФИО Ответственного
          </label>
          <input
            type="text"
            value={responsibleName}
            onChange={(e) => setResponsibleName(e.target.value)}
            className="w-full text-sm text-gray-700 border border-gray-300 px-3 py-1.5 focus:border-purple-600 focus:outline-none rounded"
            placeholder="будет добавлено позже"
          />
        </div>

        {/* Personal Manager Status */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <label className="block text-base text-gray-900 mb-2">
            Персональный менеджер
          </label>
          <div className={`px-3 py-1.5 rounded text-sm ${
            hasPersonalManager 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-gray-50 text-gray-600 border border-gray-200'
          }`}>
            {hasPersonalManager ? `Есть персональный ме��едже: ${personalManager}` : 'Нет персонального менеджера'}
          </div>
        </div>

        {/* Appeal Theme */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <label className="block text-base text-gray-900 mb-2">
            Тема обращения
          </label>
          <input
            type="text"
            value={appealTheme}
            onChange={(e) => setAppealTheme(e.target.value)}
            className="w-full text-sm text-gray-700 border border-gray-300 px-3 py-1.5 focus:border-purple-600 focus:outline-none rounded"
            placeholder="Проблема с кредитом"
          />
        </div>

        {/* Category */}
        <div className="bg-white rounded-lg shadow-sm p-4" ref={categoryRef} style={highlightedField === 'category' ? { border: '3px solid #673AB7' } : {}}>
          <label className="block text-base text-gray-900 mb-2">
            Выберите категорию <span className="text-red-600">*</span>
          </label>
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubcategory('');
              }}
              className="flex-1 text-sm text-gray-700 border border-gray-300 px-3 py-1.5 focus:border-purple-600 focus:outline-none bg-white rounded"
            >
              <option value="">Категория</option>
              {getAvailableCategories(applicantType).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              onClick={() => setShowKnowledgeBase(true)}
              className="px-4 py-1.5 text-sm font-medium text-white rounded transition-colors"
              style={{ backgroundColor: '#673AB7' }}
            >
              База знаний
            </button>
          </div>
        </div>

        {/* Subcategory */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <label className="block text-base text-gray-900 mb-2">
            Выберите подкатегорию
          </label>
          <select
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            className="w-full text-sm text-gray-700 border border-gray-300 px-3 py-1.5 focus:border-purple-600 focus:outline-none bg-white rounded"
            disabled={!category}
          >
            <option value="">Подкатегория</option>
            {category && getAvailableSubcategories(applicantType, category).map(subcat => (
              <option key={subcat} value={subcat}>{subcat}</option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <label className="block text-base text-gray-900 mb-2">
            Приоритет
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setPriority('low')}
              className={`px-5 py-2 text-sm font-medium transition-colors rounded ${
                priority === 'low'
                  ? 'text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-purple-50'
              }`}
              style={priority === 'low' ? { backgroundColor: '#673AB7' } : {}}
            >
              Низкий
            </button>
            <button
              onClick={() => setPriority('medium')}
              className={`px-5 py-2 text-sm font-medium transition-colors rounded ${
                priority === 'medium'
                  ? 'text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-purple-50'
              }`}
              style={priority === 'medium' ? { backgroundColor: '#673AB7' } : {}}
            >
              Средний
            </button>
            <button
              onClick={() => setPriority('high')}
              className={`px-5 py-2 text-sm font-medium transition-colors rounded ${
                priority === 'high'
                  ? 'text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-purple-50'
              }`}
              style={priority === 'high' ? { backgroundColor: '#673AB7' } : {}}
            >
              Высокий
            </button>
          </div>
        </div>

        {/* Dates - Read Only */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <label className="block text-base text-gray-900 mb-2">
            Дата регистрации (автоматически)
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={registrationDate}
              readOnly
              className="w-48 text-sm text-gray-700 border border-gray-300 px-3 py-1.5 bg-gray-50 rounded cursor-not-allowed"
            />
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <label className="block text-base text-gray-900 mb-2">
            Дата доведения
          </label>
          {resolvedImmediately ? (
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={registrationDate}
                readOnly
                className="w-48 text-sm text-gray-700 border border-gray-300 px-3 py-1.5 bg-gray-50 rounded cursor-not-allowed"
              />
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
          ) : (
            <div className="px-3 py-1.5 text-sm text-gray-500 italic bg-gray-50 border border-gray-200 rounded">
              будет внесено позже
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <label className="block text-base text-gray-900 mb-2">
            Плановая дата (автоматически)
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={plannedDate}
              readOnly
              className="w-48 text-sm text-gray-700 border border-gray-300 px-3 py-1.5 bg-gray-50 rounded cursor-not-allowed"
            />
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <label className="block text-base text-gray-900 mb-2">
            Фактическая дата
          </label>
          {resolvedImmediately ? (
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={actualDate}
                readOnly
                className="w-48 text-sm text-gray-700 border border-gray-300 px-3 py-1.5 bg-gray-50 rounded cursor-not-allowed"
              />
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
          ) : (
            <div className="px-3 py-1.5 text-sm text-gray-500 italic bg-gray-50 border border-gray-200 rounded">
              будет внесено позже
            </div>
          )}
        </div>

        {/* Resolved Immediately Checkbox - Only show if appeal type is NOT "written" */}
        {appealType !== 'written' && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={resolvedImmediately}
                  onChange={(e) => setResolvedImmediately(e.target.checked)}
                  className="w-5 h-5 border-2 border-gray-300 rounded cursor-pointer"
                  style={resolvedImmediately ? { accentColor: '#673AB7' } : {}}
                />
              </div>
              <span className="text-base text-gray-900">
                Решено на первой линии (Не отправлять в пул)
              </span>
            </label>
          </div>
        )}

        {/* Solution Description and Response Form - Show when resolved immediately */}
        {resolvedImmediately && appealType !== 'written' && (
          <>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <label className="block text-base text-gray-900 mb-2">
                Описание решения <span className="text-red-600">*</span>
              </label>
              <textarea
                value={solutionDescription}
                onChange={(e) => setSolutionDescription(e.target.value)}
                rows={12}
                className="w-full text-sm text-gray-700 border border-gray-300 px-3 py-1.5 focus:border-purple-600 focus:outline-none rounded"
                placeholder="Опишите как было решено обращение..."
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <label className="block text-base text-gray-900 mb-2">
                Шаблон ответа <span className="text-red-600">*</span>
              </label>
              <select
                value={responseForm}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  setResponseForm(selectedValue);
                  
                  // Auto-fill solution description if template is selected
                  if (SOLUTION_TEMPLATES[selectedValue as keyof typeof SOLUTION_TEMPLATES]) {
                    setSolutionDescription(SOLUTION_TEMPLATES[selectedValue as keyof typeof SOLUTION_TEMPLATES]);
                  }
                }}
                className="w-full text-sm text-gray-700 border border-gray-300 px-3 py-1.5 focus:border-purple-600 focus:outline-none bg-white rounded"
              >
                <option value="">Выберите шаблон ответа</option>
                <option value="Шаблон для кредита">Шаблон для кредита</option>
                <option value="Шаблон для вклада">Шаблон для вклада</option>
                <option value="Шаблон для карты">Шаблон для карты</option>
              </select>
            </div>
          </>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-3">
          <button
            onClick={handleSubmit}
            className="px-8 py-2.5 hover:opacity-90 text-white rounded font-medium transition-colors"
            style={{ backgroundColor: '#673AB7' }}
          >
            {!resolvedImmediately 
              ? 'Зарегистрировать обращение'
              : appealType === 'oral'
              ? 'Зарегистрировать и передать в аудит'
              : 'Зарегистрировать и закрыть'}
          </button>
          <button
            onClick={handleClearForm}
            className="px-6 py-2.5 rounded font-medium transition-colors"
            style={{ color: '#673AB7' }}
          >
            Очистить форму
          </button>
        </div>
      </div>

      {/* Knowledge Base Modal */}
      {showKnowledgeBase && !selectedKnowledgeItem && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowKnowledgeBase(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">База Знаний</h2>
              <button
                onClick={() => setShowKnowledgeBase(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-3">
              {KNOWLEDGE_BASE.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedKnowledgeItem(item);
                  }}
                  className={`relative p-5 rounded-xl cursor-pointer transition-all hover:shadow-lg bg-gradient-to-r ${item.gradient} border border-gray-200`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {item.category}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.subcategory}
                      </p>
                    </div>
                    {item.sla && (
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        {item.sla}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Instruction Modal */}
      {selectedKnowledgeItem && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedKnowledgeItem(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedKnowledgeItem.instruction.title}
              </h2>
              <button
                onClick={() => setSelectedKnowledgeItem(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Instruction Content */}
            <div className="p-6 space-y-6">
              {selectedKnowledgeItem.instruction.sections.map((section, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {section.subtitle}
                  </h3>
                  <p className="text-base text-gray-700 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}

              {/* Close Button */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedKnowledgeItem(null)}
                  className="w-full px-6 py-3 text-white rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: '#673AB7' }}
                >
                  Закрыть инструкцию
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// MAIN REGISTRATION PAGE COMPONENT
export function RegistrationPage() {
  const [view, setView] = useState<'cabinet' | 'card' | 'create'>('cabinet');
  const [isRegisteringWrittenAppeal, setIsRegisteringWrittenAppeal] = useState(false);
  const [stats, setStats] = useState({ 
    withoutErrors: 145, 
    withErrors: 12, 
    total: 157 
  });

  // Load statistics from localStorage on component mount
  useEffect(() => {
    const savedStats = localStorage.getItem('registrationStats');
    if (savedStats) {
      try {
        const parsedStats = JSON.parse(savedStats);
        setStats(parsedStats);
      } catch (error) {
        console.error('Failed to parse saved statistics:', error);
      }
    }
  }, []);

  // Save statistics to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('registrationStats', JSON.stringify(stats));
  }, [stats]);

  const handleCreateAppeal = () => {
    setIsRegisteringWrittenAppeal(false);
    setView('card');
  };

  const handleRegisterWrittenAppeal = () => {
    setIsRegisteringWrittenAppeal(true);
    setView('card');
  };

  const handleBack = () => {
    setView('cabinet');
  };

  const handleSaveAppeal = (appeal: Appeal) => {
    // Increase total statistics
    setStats(prev => ({
      ...prev,
      withoutErrors: prev.withoutErrors + 1,
      total: prev.total + 1
    }));
  };

  const handleRegisterSuccess = () => {
    // Increase total statistics
    setStats(prev => ({
      ...prev,
      withoutErrors: prev.withoutErrors + 1,
      total: prev.total + 1
    }));
    
    // If registering a written appeal, decrease the unregistered count
    if (isRegisteringWrittenAppeal) {
      const currentUnregistered = localStorage.getItem('unregisteredWrittenAppeals');
      const currentCount = currentUnregistered ? parseInt(currentUnregistered) : 0;
      const newCount = Math.max(0, currentCount - 1);
      localStorage.setItem('unregisteredWrittenAppeals', newCount.toString());
    }
    
    // Show success toast and navigate back
    setTimeout(() => {
      toast.success('Обращение успешно зарегистрировано!');
    }, 100);
    
    setView('cabinet');
  };

  return (
    <>
      <Toaster position="bottom-right" richColors />
      {view === 'create' ? (
        <AppealRegistrationCard onBack={handleBack} onSave={handleSaveAppeal} />
      ) : view === 'card' ? (
        <RegistrationCard onBack={handleBack} onRegisterSuccess={handleRegisterSuccess} />
      ) : (
        <RegistrationCabinet 
          onCreateAppeal={handleCreateAppeal} 
          onRegisterWrittenAppeal={handleRegisterWrittenAppeal}
          stats={stats} 
        />
      )}
    </>
  );
}
import { useState } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  Clock,
  User,
  Calendar,
  Tag,
  Award,
  Building,
  Phone,
  ExternalLink,
  Copy,
  FileSpreadsheet,
  List,
  Paperclip,
  ChevronRight,
  ChevronDown,
  Star,
  Zap,
  Heart,
  Sparkles,
  Crown,
  Shield,
  Search,
  ArrowLeft
} from 'lucide-react';

// Mock data from ProcessingPage
const mockAppeals = [
  // МОИ ОБРАЩЕНИЯ (4 шт.)
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
  },
  {
    id: '123134444',
    regDate: '14/08/26',
    category: 'Регулятор',
    status: 'Запрос в БП',
    deadline: '26/08/26',
    responsible: 'Александр Солодовников',
    applicantName: 'N/A',
    organizationName: 'Центробанк',
    address: 'N/A',
    cbs: 'Центробанк',
    type: 'Юр лицо',
    isMine: true,
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
  },
  
  // ЧУЖИЕ ОБРАЩЕНИЯ (6 шт.)
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
    isMine: false,
  },
  {
    id: '123167777',
    regDate: '17/08/26',
    category: 'Устное',
    status: 'В работе',
    deadline: '30/08/26',
    responsible: 'Сидоров П.К.',
    applicantName: 'Сидорова Н.В.',
    organizationName: 'N/A',
    address: 'N/A',
    cbs: 'N/A',
    type: 'Физ лицо',
    isMine: false,
  },
  {
    id: '123178888',
    regDate: '18/08/26',
    category: 'Письменное',
    status: 'Запрос в БП',
    deadline: '31/08/26',
    responsible: 'Иванова М.П.',
    applicantName: 'N/A',
    organizationName: 'ЦБ РФ',
    address: 'N/A',
    cbs: 'ЦБ РФ',
    type: 'Юр лицо',
    isMine: false,
  },
  {
    id: '123189999',
    regDate: '19/08/26',
    category: 'Устное',
    status: 'В работе',
    deadline: '01/09/26',
    responsible: 'Козлов Д.А.',
    applicantName: 'Васильев И.И.',
    organizationName: 'N/A',
    address: 'N/A',
    cbs: 'N/A',
    type: 'Физ лицо',
    isMine: false,
  },
  {
    id: '123190000',
    regDate: '20/08/26',
    category: 'Письменное',
    status: 'Ожидает ответа',
    deadline: '02/09/26',
    responsible: 'Петрова А.В.',
    applicantName: 'N/A',
    organizationName: 'ЗАО Техносервис',
    address: 'Санкт-Петербург, Невский пр., д.55',
    cbs: 'N/A',
    type: 'Юр лицо',
    isMine: false,
  },
  {
    id: '123191111',
    regDate: '21/08/26',
    category: 'Письменное',
    status: 'В работе',
    deadline: '03/09/26',
    responsible: 'Козлов Д.А.',
    applicantName: 'N/A',
    organizationName: 'Банк России',
    address: 'N/A',
    cbs: 'Банк России',
    type: 'Юр лицо',
    isMine: false,
  },
];

// ARCHIVE CARD COMPONENT (текущий дизайн Pixney Analytics - открывается при клике на обращение)
function ArchiveCard({ appeal, onBack }: { appeal: any; onBack: () => void }) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  const archive = {
    id: appeal.id,
    status: 'ЗАКРЫТО (В АРХИВЕ)',
    retentionDate: '15.02.2025',
    
    // Dates
    dates: {
      created: appeal.regDate,
      resolved: appeal.deadline,
      duration: '2 дня',
      closed: appeal.deadline,
    },

    // Participants
    participants: {
      applicant: {
        name: appeal.applicantName !== 'N/A' ? appeal.applicantName : 'Заявитель',
        isVIP: true,
      },
      registrar: {
        id: '12345',
        department: 'ЦТО',
      },
      responsible: {
        name: appeal.responsible,
        department: 'ГПОО',
      },
    },

    // Parameters
    parameters: {
      category: appeal.category,
      channel: 'Звонок',
    },

    // Request
    originalRequest: 'Добрый день! Обращаюсь с жалобой на некорректне начисление процентов по кредиту №123456. Считаю, что расчет выполнен с ошибкой. Прошу пересмотреть начисления и предоставить детальный расчет.',
    
    requestAttachments: [
      { name: 'Скриншот_выписки.jpg', size: '1.2 MB' }
    ],

    // Solution
    solution: 'Уважаемый Иван Иванович!\\n\\nВаше обращение рассмотрено. По результатам проверки подтверждаем корректность начисления процентов согласно условиям кредитного договора №123456 от 15.01.2023. Детальный расчет направлен Вам на email.\\n\\nДополнительно проведена разъяснительная консультация по структуре платежей и порядку погашения кредита.\\n\\nС уважением,\\nОтдел работы с обращениями',
    
    solutionAttachments: [
      { name: 'Официальный_ответ.pdf', size: '245 KB' },
      { name: 'Детальный_расчет.xlsx', size: '89 KB' }
    ],

    // Audit History
    audit: {
      clientSatisfaction: 'Удовлетворен',
      auditorComment: 'Клинт подтвердил удовлетворенность решением. Общение было вежливым, претензий к обслуживанию не высказано. Рекомендации: отметить положительную обратную связь в профиле клиента.',
      rating: {
        politeness: 5,
        timeframe: 5,
        clarity: 5,
      }
    },

    // Related Documents
    relatedDocs: [
      {
        id: 'HD-99',
        type: 'HelpDesk',
        title: 'Инцидент HelpDesk #HD-99',
        status: 'Решен',
        link: '#'
      },
      {
        id: 'DOC-44',
        type: 'Legal',
        title: 'Служебная записка Юр.Отд.',
        status: 'Завершено',
        link: '#'
      },
    ],
  };

  const handleDownloadPDF = () => {
    alert('Скачивание PDF архива обращения...');
  };

  const handleCreateRepeat = () => {
    alert('Создание повторного обращения с копированием контекста...');
  };

  const handleExportXLS = () => {
    alert('Экспорт истории в XLS...');
  };

  const handleViewChangelog = () => {
    alert('Просмотр лога изменений...');
  };

  // Pixelated Star Component
  const PixelStar = ({ className = "w-4 h-4" }: { className?: string }) => (
    <div className={`${className} relative`} style={{ imageRendering: 'pixelated' }}>
      <div className="absolute inset-0" style={{
        background: `
          linear-gradient(#FFD700 0%, #FFD700 100%),
          conic-gradient(from 0deg, 
            #FFD700 0deg 36deg,
            transparent 36deg 72deg,
            #FFD700 72deg 108deg,
            transparent 108deg 144deg,
            #FFD700 144deg 180deg,
            transparent 180deg 216deg,
            #FFD700 216deg 252deg,
            transparent 252deg 288deg,
            #FFD700 288deg 324deg,
            transparent 324deg 360deg
          )
        `,
        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
      }}></div>
    </div>
  );

  // Pixel Heart for Health Status
  const PixelHeart = ({ filled = true }: { filled?: boolean }) => (
    <div className="w-6 h-6 relative inline-block" style={{ imageRendering: 'pixelated' }}>
      <svg viewBox="0 0 16 16" className="w-full h-full">
        <rect x="4" y="3" width="2" height="2" fill={filled ? "#39FF14" : "#333"} />
        <rect x="10" y="3" width="2" height="2" fill={filled ? "#39FF14" : "#333"} />
        <rect x="2" y="5" width="2" height="2" fill={filled ? "#39FF14" : "#333"} />
        <rect x="4" y="5" width="2" height="2" fill={filled ? "#39FF14" : "#333"} />
        <rect x="6" y="5" width="2" height="2" fill={filled ? "#39FF14" : "#333"} />
        <rect x="8" y="5" width="2" height="2" fill={filled ? "#39FF14" : "#333"} />
        <rect x="10" y="5" width="2" height="2" fill={filled ? "#39FF14" : "#333"} />
        <rect x="12" y="5" width="2" height="2" fill={filled ? "#39FF14" : "#333"} />
        <rect x="2" y="7" width="2" height="2" fill={filled ? "#39FF14" : "#333"} />
        <rect x="4" y="7" width="2" height="2" fill={filled ? "#39FF14" : "#333"} />
        <rect x="6" y="7" width="2" height="2" fill={filled ? "#39FF14" : "#333"} />
        <rect x="8" y="7" width="2" height="2" fill={filled ? "#39FF14" : "#333"} />
        <rect x="10" y="7" width="2" height="2" fill={filled ? "#39FF14" : "#333"} />
        <rect x="12" y="7" width="2" height="2" fill={filled ? "#39FF14" : "#333"} />
        <rect x="4" y="9" width="2" height="2" fill={filled ? "#39FF14" : "#333"} />
        <rect x="6" y="9" width="2" height="2" fill={filled ? "#39FF14" : "#333"} />
        <rect x="8" y="9" width="2" height="2" fill={filled ? "#39FF14" : "#333"} />
        <rect x="10" y="9" width="2" height="2" fill={filled ? "#39FF14" : "#333"} />
        <rect x="6" y="11" width="2" height="2" fill={filled ? "#39FF14" : "#333"} />
        <rect x="8" y="11" width="2" height="2" fill={filled ? "#39FF14" : "#333"} />
        <rect x="7" y="13" width="2" height="2" fill={filled ? "#39FF14" : "#333"} />
      </svg>
    </div>
  );

  return (
    <div 
      className="flex flex-col h-screen overflow-hidden relative"
      style={{ 
        background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #1A1A2E 100%)',
        fontFamily: 'Nunito, sans-serif'
      }}
    >
      {/* Animated Background Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      {/* Pixney Header */}
      <div 
        className="relative z-10 px-8 py-6 border-b-2 border-white/10"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <div className="flex items-center justify-between">
          {/* Left: Breadcrumbs & Title */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={onBack}
                className="px-4 py-2 text-sm font-bold bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all"
              >
                <ArrowLeft className="w-4 h-4 text-[#00E5FF] inline mr-2" />
                Назад
              </button>
              <span 
                className="px-4 py-1 text-[10px] font-black uppercase tracking-wider"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  background: 'linear-gradient(135deg, #00E5FF 0%, #0099CC 100%)',
                  color: '#1A1A2E',
                  borderRadius: '1000px',
                  boxShadow: '0 0 24px rgba(0, 229, 255, 0.6)'
                }}
              >
                ARCHIVE
              </span>
              <ChevronRight className="w-4 h-4 text-[#00E5FF]" />
              <span 
                className="px-4 py-1 text-[10px] font-black uppercase tracking-wider border-2"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  color: '#00E5FF',
                  borderColor: '#00E5FF',
                  borderRadius: '1000px',
                  background: 'rgba(0, 229, 255, 0.1)'
                }}
              >
                VIEW
              </span>
            </div>
            <h1 
              className="text-3xl font-black uppercase tracking-tight text-transparent bg-clip-text"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                backgroundImage: 'linear-gradient(90deg, #00E5FF 0%, #39FF14 100%)',
                textShadow: '0 0 20px rgba(0, 229, 255, 0.5)'
              }}
            >
              #{archive.id}
            </h1>
          </div>

          {/* Center: Status with Crown */}
          <div className="relative">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <Crown className="w-8 h-8 text-[#FFD700] animate-pulse" style={{ filter: 'drop-shadow(0 0 12px #FFD700)' }} />
            </div>
            <div 
              className="px-8 py-3 text-sm font-black uppercase border-2 relative overflow-hidden"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#39FF14',
                borderColor: '#39FF14',
                borderRadius: '1000px',
                boxShadow: '0 0 32px rgba(57, 255, 20, 0.6), inset 0 0 20px rgba(57, 255, 20, 0.1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              <span className="relative z-10">{archive.status}</span>
            </div>
          </div>

          {/* Right: Retention & Download */}
          <div className="flex items-center gap-4">
            {/* Retention Card */}
            <div 
              className="px-6 py-3 rounded-[32px] border border-white/20 relative overflow-hidden"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="absolute top-2 right-2">
                <Sparkles className="w-4 h-4 text-[#FFD700]" />
              </div>
              <div className="text-xs font-bold text-[#00E5FF] uppercase" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                KEEP UNTIL
              </div>
              <div className="text-xl font-black text-white mt-1">{archive.retentionDate}</div>
            </div>

            {/* Download Button - Magic Arcade Style */}
            <button
              onClick={handleDownloadPDF}
              className="group relative px-8 py-4 text-sm font-black uppercase transition-all duration-300"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                background: 'linear-gradient(135deg, #00E5FF 0%, #0099CC 100%)',
                color: '#1A1A2E',
                borderRadius: '1000px',
                boxShadow: '0 0 32px rgba(0, 229, 255, 0.6)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 48px rgba(0, 229, 255, 1)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 32px rgba(0, 229, 255, 0.6)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Download className="w-5 h-5 inline mr-3" />
              DOWNLOAD PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative z-10 px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Timeline & Participants */}
          <div className="col-span-4 space-y-6">
            {/* Timeline Magic Card */}
            <div 
              className="p-6 rounded-[32px] border border-white/20 relative overflow-hidden"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-[#00E5FF]" />
                <h3 
                  className="text-lg font-black uppercase text-[#00E5FF]"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  TIMELINE
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">Создано</span>
                  <span className="text-sm font-bold text-white">{archive.dates.created}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">Решено</span>
                  <span className="text-sm font-bold text-[#39FF14]">{archive.dates.resolved}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">Длительность</span>
                  <span className="text-sm font-bold text-[#FFD700]">{archive.dates.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">Закрыто</span>
                  <span className="text-sm font-bold text-white">{archive.dates.closed}</span>
                </div>
              </div>
            </div>

            {/* Participants Card */}
            <div 
              className="p-6 rounded-[32px] border border-white/20 relative overflow-hidden"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-[#00E5FF]" />
                <h3 
                  className="text-lg font-black uppercase text-[#00E5FF]"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  PEOPLE
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs text-white/60 mb-1">Заявитель</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{archive.participants.applicant.name}</span>
                    {archive.participants.applicant.isVIP && (
                      <Crown className="w-4 h-4 text-[#FFD700]" />
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-white/60 mb-1">Регистратор</div>
                  <span className="text-sm font-bold text-white">{archive.participants.registrar.id} ({archive.participants.registrar.department})</span>
                </div>
                <div>
                  <div className="text-xs text-white/60 mb-1">Ответственный</div>
                  <span className="text-sm font-bold text-white">{archive.participants.responsible.name}</span>
                  <div className="text-xs text-white/60">{archive.participants.responsible.department}</div>
                </div>
              </div>
            </div>

            {/* Parameters Card */}
            <div 
              className="p-6 rounded-[32px] border border-white/20 relative overflow-hidden"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Tag className="w-6 h-6 text-[#00E5FF]" />
                <h3 
                  className="text-lg font-black uppercase text-[#00E5FF]"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  PARAMS
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-white/60 mb-1">Категория</div>
                  <div 
                    className="inline-block px-4 py-2 text-xs font-bold rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #00E5FF 0%, #0099CC 100%)',
                      color: '#1A1A2E'
                    }}
                  >
                    {archive.parameters.category}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-white/60 mb-1">Канал</div>
                  <div 
                    className="inline-block px-4 py-2 text-xs font-bold rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #39FF14 0%, #00CC00 100%)',
                      color: '#1A1A2E'
                    }}
                  >
                    {archive.parameters.channel}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Request & Solution */}
          <div className="col-span-5 space-y-6">
            {/* Original Request Card */}
            <div 
              className="p-6 rounded-[32px] border border-white/20 relative overflow-hidden"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-[#00E5FF]" />
                <h3 
                  className="text-lg font-black uppercase text-[#00E5FF]"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  REQUEST
                </h3>
              </div>

              <p className="text-sm text-white/80 leading-relaxed mb-4">
                {archive.originalRequest}
              </p>

              {/* Attachments */}
              <div className="space-y-2">
                {archive.requestAttachments.map((file: any, index: number) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-2xl border border-white/10"
                    style={{ background: 'rgba(0, 0, 0, 0.2)' }}
                  >
                    <div className="flex items-center gap-3">
                      <Paperclip className="w-4 h-4 text-[#00E5FF]" />
                      <span className="text-sm font-bold text-white">{file.name}</span>
                    </div>
                    <span className="text-xs text-white/60">{file.size}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution Card */}
            <div 
              className="p-6 rounded-[32px] border border-white/20 relative overflow-hidden"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-6 h-6 text-[#39FF14]" />
                <h3 
                  className="text-lg font-black uppercase text-[#39FF14]"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  SOLUTION
                </h3>
              </div>

              <p className="text-sm text-white/80 leading-relaxed mb-4 whitespace-pre-line">
                {archive.solution}
              </p>

              {/* Solution Attachments */}
              <div className="space-y-2">
                {archive.solutionAttachments.map((file: any, index: number) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-2xl border border-white/10"
                    style={{ background: 'rgba(0, 0, 0, 0.2)' }}
                  >
                    <div className="flex items-center gap-3">
                      <Paperclip className="w-4 h-4 text-[#39FF14]" />
                      <span className="text-sm font-bold text-white">{file.name}</span>
                    </div>
                    <span className="text-xs text-white/60">{file.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Audit & Actions */}
          <div className="col-span-3 space-y-6">
            {/* Audit Results Card */}
            <div 
              className="p-6 rounded-[32px] border border-white/20 relative overflow-hidden"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-6 h-6 text-[#FFD700]" />
                <h3 
                  className="text-lg font-black uppercase text-[#FFD700]"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  AUDIT
                </h3>
              </div>

              {/* Satisfaction */}
              <div className="mb-6">
                <div className="text-xs text-white/60 mb-2">Удовлетворенность</div>
                <div 
                  className="px-4 py-2 text-sm font-bold rounded-full text-center"
                  style={{
                    background: 'linear-gradient(135deg, #39FF14 0%, #00CC00 100%)',
                    color: '#1A1A2E'
                  }}
                >
                  {archive.audit.clientSatisfaction}
                </div>
              </div>

              {/* Ratings */}
              <div className="space-y-3 mb-4">
                <div>
                  <div className="text-xs text-white/60 mb-1">Вежливость</div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <PixelHeart key={i} filled={i < archive.audit.rating.politeness} />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-white/60 mb-1">Сроки</div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <PixelHeart key={i} filled={i < archive.audit.rating.timeframe} />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-white/60 mb-1">Ясность</div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <PixelHeart key={i} filled={i < archive.audit.rating.clarity} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Comment */}
              <div>
                <div className="text-xs text-white/60 mb-2">Комментарий</div>
                <p className="text-xs text-white/80 leading-relaxed">
                  {archive.audit.auditorComment}
                </p>
              </div>
            </div>

            {/* Related Documents */}
            <div 
              className="p-6 rounded-[32px] border border-white/20 relative overflow-hidden"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <ExternalLink className="w-6 h-6 text-[#00E5FF]" />
                <h3 
                  className="text-lg font-black uppercase text-[#00E5FF]"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  LINKS
                </h3>
              </div>

              <div className="space-y-3">
                {archive.relatedDocs.map((doc: any, index: number) => (
                  <a
                    key={index}
                    href={doc.link}
                    className="block p-3 rounded-2xl border border-white/10 hover:border-[#00E5FF] transition-all"
                    style={{ background: 'rgba(0, 0, 0, 0.2)' }}
                  >
                    <div className="text-xs font-bold text-[#00E5FF] mb-1">{doc.title}</div>
                    <div className="text-xs text-white/60">{doc.status}</div>
                  </a>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCreateRepeat}
                className="w-full px-4 py-3 text-sm font-bold rounded-2xl border border-white/20 hover:border-[#00E5FF] transition-all"
                style={{ background: 'rgba(0, 0, 0, 0.4)' }}
              >
                <Copy className="w-4 h-4 inline mr-2 text-[#00E5FF]" />
                <span className="text-white">Создать повторное</span>
              </button>
              <button
                onClick={handleExportXLS}
                className="w-full px-4 py-3 text-sm font-bold rounded-2xl border border-white/20 hover:border-[#39FF14] transition-all"
                style={{ background: 'rgba(0, 0, 0, 0.4)' }}
              >
                <FileSpreadsheet className="w-4 h-4 inline mr-2 text-[#39FF14]" />
                <span className="text-white">Экспорт в XLS</span>
              </button>
              <button
                onClick={handleViewChangelog}
                className="w-full px-4 py-3 text-sm font-bold rounded-2xl border border-white/20 hover:border-[#FFD700] transition-all"
                style={{ background: 'rgba(0, 0, 0, 0.4)' }}
              >
                <List className="w-4 h-4 inline mr-2 text-[#FFD700]" />
                <span className="text-white">Лог изменений</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Pixney Signature */}
      <div 
        className="relative z-10 px-8 py-4 border-t-2 border-white/10 text-center"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <div 
          className="text-xs font-black uppercase tracking-widest text-transparent bg-clip-text"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            backgroundImage: 'linear-gradient(90deg, #00E5FF 0%, #39FF14 50%, #FFD700 100%)'
          }}
        >
          ✨ PIXNEY ANALYTICS ✨ ARCHIVE SYSTEM
        </div>
      </div>
    </div>
  );
}

// ARCHIVE CABINET COMPONENT (новый кабинет архиватора - по умолчанию)
function ArchiveCabinet({ onSelectAppeal, searchQuery }: { onSelectAppeal: (appeal: any) => void; searchQuery: string }) {
  const [activeFilter, setActiveFilter] = useState<string>('Мои обращения');

  // Filter appeals based on active filter and search
  const filteredAppeals = mockAppeals.filter(appeal => {
    // Filter by "Мои обращения" or "Все обращения"
    let ownershipMatch = true;
    if (activeFilter === 'Мои обращения') {
      ownershipMatch = appeal.isMine === true;
    }
    // "Все обращения" shows all appeals (no filter)
    
    // Filter by type
    let typeMatch = true;
    if (activeFilter === 'Физлицо') typeMatch = appeal.type === 'Физ лицо' || appeal.type === 'Физлицо';
    if (activeFilter === 'Юрлицо') typeMatch = appeal.type === 'Юр лицо' || appeal.type === 'Юрлицо';
    
    // Filter by search query
    const searchMatch = searchQuery === '' || 
      appeal.id.includes(searchQuery) ||
      appeal.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appeal.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appeal.responsible.toLowerCase().includes(searchQuery.toLowerCase());

    return ownershipMatch && typeMatch && searchMatch;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Filters */}
      <div className="mb-6 flex gap-3 flex-wrap">
        {['Физлицо', 'Юрлицо', 'Все обращения', 'Мои обращения'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeFilter === filter
                ? 'bg-white text-gray-900 shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-3 font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  Номер
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </th>
              <th className="text-left p-3 font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  Дата регистрации
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </th>
              <th className="text-left p-3 font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  Категория
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </th>
              <th className="text-left p-3 font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  Статус
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </th>
              <th className="text-left p-3 font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  Дедлайн
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </th>
              <th className="text-left p-3 font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  Ответственный
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </th>
              <th className="text-left p-3 font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  ФИО заявителя
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </th>
              <th className="text-left p-3 font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  Наименование ООО
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </th>
              <th className="text-left p-3 font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  Адрес регистрации
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </th>
              <th className="text-left p-3 font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  ЦБС
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAppeals.map((appeal) => (
              <tr
                key={appeal.id}
                onClick={() => onSelectAppeal(appeal)}
                className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <td className="p-3">
                  <div className="text-blue-600 font-semibold">{appeal.id}</div>
                </td>
                <td className="p-3 text-gray-700">{appeal.regDate}</td>
                <td className="p-3 text-gray-700">{appeal.category}</td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    appeal.status === 'В работе' 
                      ? 'bg-green-100 text-green-700' 
                      : appeal.status === 'Запрос в БП'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {appeal.status}
                  </span>
                </td>
                <td className="p-3 text-gray-700">{appeal.deadline}</td>
                <td className="p-3 text-gray-700">{appeal.responsible}</td>
                <td className="p-3 text-gray-700">{appeal.applicantName}</td>
                <td className="p-3 text-gray-700">{appeal.organizationName}</td>
                <td className="p-3 text-gray-700 text-xs">{appeal.address}</td>
                <td className="p-3 text-gray-700">{appeal.cbs}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty state */}
        {filteredAppeals.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 font-semibold">Обращения не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}

// MAIN ARCHIVE PAGE COMPONENT
export function ArchivePage() {
  const [selectedAppeal, setSelectedAppeal] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectAppeal = (appeal: any) => {
    setSelectedAppeal(appeal);
  };

  const handleBack = () => {
    setSelectedAppeal(null);
  };

  // If appeal selected, show ArchiveCard
  if (selectedAppeal) {
    return <ArchiveCard appeal={selectedAppeal} onBack={handleBack} />;
  }

  // Otherwise show ArchiveCabinet (по умолчанию)
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="text-gray-600">✕</span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="text-gray-600">⌂</span>
            </button>
            <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 min-w-[400px]">
              <span className="text-gray-900 font-medium">Мои обращения</span>
            </div>
            <button className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors font-medium">
              GO
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden p-8">
        <ArchiveCabinet onSelectAppeal={handleSelectAppeal} searchQuery={searchQuery} />
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-8 py-3 flex items-center justify-center">
        <div className="text-sm text-gray-500 font-medium">
          Кабинет архиватора
        </div>
      </div>
    </div>
  );
}
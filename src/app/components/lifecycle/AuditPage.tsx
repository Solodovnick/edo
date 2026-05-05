import { useState } from 'react';
import { 
  Phone, 
  Star, 
  FileText, 
  Play,
  Calendar,
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
    type: 'Физ лицо',
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
    category: 'Письменное',
    status: 'Запрос в БП',
    deadline: '26/08/26',
    responsible: 'Александр Солодовников',
    applicantName: 'N/A',
    organizationName: 'Центробанк',
    address: 'N/A',
    cbs: 'Центробанк',
    type: 'Юрлицо',
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
    type: 'Юрлицо',
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
    type: 'Юрлицо',
    isMine: false,
  },
];

// AUDIT CARD COMPONENT (текущий дизайн Y2K - открывается при клике на обращение)
function AuditCard({ appeal, onBack }: { appeal: any; onBack: () => void }) {
  const [selectedTab, setSelectedTab] = useState<'home' | 'registry'>('home');
  const [auditTemplate, setAuditTemplate] = useState('');
  const [auditResult, setAuditResult] = useState('');
  const [comment, setComment] = useState('');

  // Extended appeal data for card
  const appealData = {
    ...appeal,
    registrationDate: appeal.regDate,
    deliveryDate: '26/04/26',
    client: {
      name: appeal.applicantName !== 'N/A' ? appeal.applicantName : 'ФИО заявителя',
      phone: '+79241234291',
    },
    history: [
      { number: '12345', dateOpen: '-- --', dateClosed: 'Закрыт' },
      { number: 'Номер', dateOpen: 'Дата закрыт', dateClosed: 'Закрыт' },
      { number: 'Номер', dateOpen: 'Дата закрыт', dateClosed: 'Закрыт' },
      { number: 'Номер', dateOpen: 'Дата закрыт', dateClosed: 'В работе' },
    ],
    originalRequest: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...',
    solutionText: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...',
    attachments: [
      { name: 'File 1  23.07.27 Таблица' },
      { name: 'File 2  23.07.27 Скан обращения' },
      { name: 'File 3  23.07.27 Сопроводительный документ' },
      { name: 'File 4  23.07.27 Аудиопомощь' },
    ],
    crmComments: [
      { title: 'Инцидент #40-99 created', status: 'Решено 10 мин назад' },
      { title: 'Юридический департамент', status: 'Сегодня 18:00' },
    ],
  };

  const handleSaveDraft = () => {
    alert('Черновик аудита сохранён');
  };

  const handleOpenEditor = () => {
    alert('Открытие редактора...');
  };

  const handlePublishAudit = () => {
    alert('Результат аудита опубликован!');
  };

  const handleSendComment = () => {
    alert('Комментарий отправлен');
    setComment('');
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#ff00ff] via-[#00ffff] to-[#ffff00]">
      {/* Y2K Header */}
      <div className="bg-[#c0c0c0] border-b-4 border-black px-4 py-2 shadow-[4px_4px_0_black]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={onBack}
              className="px-3 py-1 bg-white border-2 border-black shadow-[2px_2px_0_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_black]"
            >
              ←
            </button>
            <button className="px-3 py-1 bg-white border-2 border-black shadow-[2px_2px_0_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_black]">→</button>
            <button className="px-3 py-1 bg-white border-2 border-black shadow-[2px_2px_0_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_black]">✕</button>
            <button className="px-3 py-1 bg-white border-2 border-black shadow-[2px_2px_0_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_black]">⌂</button>
            <input 
              type="text" 
              value="Аудит обращения"
              readOnly
              className="flex-1 px-3 py-1 bg-white border-2 border-black font-bold"
              style={{ minWidth: '400px' }}
            />
            <button className="px-6 py-1 bg-white border-2 border-black shadow-[2px_2px_0_black] rounded-full hover:bg-gradient-to-r hover:from-[#ff00ff] hover:to-[#00ffff] font-bold">
              GO
            </button>
          </div>
          <div className="text-3xl">🔔</div>
        </div>
      </div>

      {/* Tabs with Stickers */}
      <div className="bg-white border-b-2 border-black px-4 py-2 flex items-center gap-2 relative">
        <button
          onClick={() => setSelectedTab('home')}
          className={`px-6 py-2 border-2 border-black font-bold ${
            selectedTab === 'home' 
              ? 'bg-gradient-to-r from-[#ff00ff] to-[#ff69b4] text-white shadow-[3px_3px_0_black]' 
              : 'bg-white shadow-[2px_2px_0_black] hover:translate-x-0.5 hover:translate-y-0.5'
          }`}
        >
          Домашняя
        </button>
        <button
          onClick={() => setSelectedTab('registry')}
          className={`px-6 py-2 border-2 border-black font-bold ${
            selectedTab === 'registry' 
              ? 'bg-gradient-to-r from-[#00ffff] to-[#00ff00] text-black shadow-[3px_3px_0_black]' 
              : 'bg-white shadow-[2px_2px_0_black] hover:translate-x-0.5 hover:translate-y-0.5'
          }`}
        >
          Реестр обращений
        </button>
        {/* Y2K Stickers */}
        <div className="absolute right-8 -top-2 text-4xl rotate-12">⭐</div>
        <div className="absolute right-32 top-1 text-2xl -rotate-12">✨</div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#e0e0e0] px-4 py-3 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔍</span>
          <input 
            type="text" 
            placeholder="Поиск..."
            className="flex-1 px-4 py-2 border-2 border-black bg-white font-bold shadow-[2px_2px_0_black]"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden p-4">
        <div className="h-full grid grid-cols-12 gap-4">
          {/* Left Column */}
          <div className="col-span-2 space-y-4 overflow-y-auto">
            {/* Client Widget */}
            <div className="bg-gradient-to-br from-[#ff69b4] to-[#ff1493] border-4 border-black p-3 shadow-[6px_6px_0_black] transform -rotate-1">
              <div className="text-white font-bold text-sm mb-2 border-b-2 border-white pb-1">
                Виджет с заявителем
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="text-white/80">ФИО заявителя</div>
                  <input 
                    type="text" 
                    defaultValue={appealData.client.name}
                    className="w-full px-2 py-1 border-2 border-black bg-white font-bold"
                  />
                </div>
                <div>
                  <div className="text-white/80">Номер телефона</div>
                  <div className="flex items-center gap-1">
                    <input 
                      type="text" 
                      defaultValue={appealData.client.phone}
                      className="flex-1 px-2 py-1 border-2 border-black bg-white font-bold"
                    />
                    <button className="p-1 bg-white border-2 border-black">
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* History Widget */}
            <div className="bg-gradient-to-br from-[#00ffff] to-[#00ff00] border-4 border-black p-3 shadow-[6px_6px_0_black] transform rotate-1">
              <div className="font-bold text-sm mb-2 border-b-2 border-black pb-1">
                История обращений
              </div>
              <div className="space-y-1">
                {appealData.history.map((item: any, index: number) => (
                  <div key={index} className="grid grid-cols-3 gap-1 text-xs font-bold">
                    <input 
                      type="text" 
                      value={item.number}
                      readOnly
                      className="px-1 py-0.5 border-2 border-black bg-white text-center"
                    />
                    <input 
                      type="text" 
                      value={item.dateOpen}
                      readOnly
                      className="px-1 py-0.5 border-2 border-black bg-white text-center"
                    />
                    <input 
                      type="text" 
                      value={item.dateClosed}
                      readOnly
                      className="px-1 py-0.5 border-2 border-black bg-white text-center"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <button className="w-full px-3 py-2 bg-gradient-to-r from-[#ffff00] to-[#ffa500] border-2 border-black shadow-[4px_4px_0_black] font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_black]">
                Обратная связь
              </button>
              <button className="w-full px-3 py-2 bg-gradient-to-r from-[#c0c0c0] to-[#ffffff] border-2 border-black shadow-[4px_4px_0_black] font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_black] flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Аудиопомощь
              </button>
              <div className="pt-2">
                <div className="text-xs font-bold mb-1">Дата доведения</div>
                <input 
                  type="text" 
                  defaultValue="13/04/26"
                  className="w-full px-2 py-1 border-2 border-black bg-white font-bold shadow-[2px_2px_0_black]"
                />
              </div>
              <button className="w-full px-3 py-2 bg-white border-2 border-black shadow-[4px_4px_0_black] font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_black]">
                Создать автозвонок
              </button>
            </div>
          </div>

          {/* Middle Column */}
          <div className="col-span-7 space-y-4 overflow-y-auto">
            {/* Appeal Info */}
            <div className="bg-white border-4 border-black p-4 shadow-[8px_8px_0_black]">
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <div className="text-xs mb-1 font-bold">Номер обращения</div>
                  <input 
                    type="text" 
                    value={appealData.id}
                    readOnly
                    className="w-full px-3 py-2 border-2 border-black bg-[#ffff00] font-bold shadow-[2px_2px_0_black]"
                  />
                </div>
                <div>
                  <div className="text-xs mb-1 font-bold">Дата регистрации</div>
                  <input 
                    type="text" 
                    value={appealData.registrationDate}
                    readOnly
                    className="w-full px-3 py-2 border-2 border-black bg-white font-bold shadow-[2px_2px_0_black]"
                  />
                </div>
                <div>
                  <button className="w-full px-3 py-2 border-2 border-black bg-white font-bold shadow-[2px_2px_0_black] hover:bg-red-200 mt-5">
                    Отказ от обращения
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <div className="text-xs mb-1 font-bold">Дата доведения ответа</div>
                  <input 
                    type="text" 
                    value={appealData.deliveryDate}
                    readOnly
                    className="w-full px-3 py-2 border-2 border-black bg-white font-bold shadow-[2px_2px_0_black]"
                  />
                </div>
                <div>
                  <button className="w-full px-3 py-2 border-2 border-black bg-gradient-to-r from-[#00ff00] to-[#00ffff] font-bold shadow-[4px_4px_0_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_black] mt-5 flex items-center justify-center gap-2">
                    ⏰ Дедлайн 1дн, 12ч, 30м
                  </button>
                </div>
              </div>

              {/* Original Request */}
              <div className="mb-4">
                <div className="text-xs mb-1 font-bold">Исходное обращение</div>
                <textarea
                  value={appealData.originalRequest}
                  readOnly
                  className="w-full px-3 py-2 border-2 border-black bg-white h-24 resize-none font-mono text-xs shadow-[3px_3px_0_black]"
                />
              </div>

              {/* Solution Text */}
              <div className="mb-4">
                <div className="text-xs mb-1 font-bold">Текст решения</div>
                <textarea
                  value={appealData.solutionText}
                  readOnly
                  className="w-full px-3 py-2 border-2 border-black bg-white h-32 resize-none font-mono text-xs shadow-[3px_3px_0_black]"
                />
              </div>

              {/* Audit Result */}
              <div className="mb-4 bg-gradient-to-br from-[#ff00ff]/20 to-[#00ffff]/20 p-4 border-2 border-black">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-sm font-bold">Результат аудита</div>
                  <select 
                    value={auditTemplate}
                    onChange={(e) => setAuditTemplate(e.target.value)}
                    className="flex-1 px-3 py-1 border-2 border-black bg-white font-bold shadow-[2px_2px_0_black]"
                  >
                    <option value="">Выбрать шаблон аудита</option>
                    <option value="1">Шаблон 1</option>
                    <option value="2">Шаблон 2</option>
                  </select>
                </div>
                <textarea
                  value={auditResult}
                  onChange={(e) => setAuditResult(e.target.value)}
                  placeholder="Введите результат аудита..."
                  className="w-full px-3 py-2 border-2 border-black bg-white h-32 resize-none font-mono text-xs shadow-[3px_3px_0_black]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={handlePublishAudit}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#ff00ff] to-[#ff69b4] border-2 border-black text-white font-bold shadow-[4px_4px_0_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_black]"
                >
                  Опубликовать результат аудита
                </button>
              </div>
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={handleSaveDraft}
                  className="flex-1 px-4 py-2 bg-white border-2 border-black font-bold shadow-[4px_4px_0_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_black]"
                >
                  Сохранить черновик аудита
                </button>
                <button 
                  onClick={handleOpenEditor}
                  className="flex-1 px-4 py-2 bg-white border-2 border-black font-bold shadow-[4px_4px_0_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_black]"
                >
                  Открыть в редакторе
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-3 space-y-4 overflow-y-auto">
            {/* Management Widget */}
            <div className="bg-gradient-to-br from-[#ffff00] to-[#ffa500] border-4 border-black p-3 shadow-[6px_6px_0_black] transform -rotate-1">
              <div className="font-bold text-sm mb-2 border-b-2 border-black pb-1">
                Управление обращением
              </div>
              <div className="space-y-2">
                {appealData.crmComments.map((item: any, index: number) => (
                  <div key={index} className="bg-white border-2 border-black p-2 shadow-[2px_2px_0_black]">
                    <div className="font-bold text-xs mb-1">{item.title}</div>
                    <div className="text-xs text-gray-700">{item.status}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CRM Comments */}
            <div className="bg-gradient-to-br from-[#00ffff] to-[#00ff00] border-4 border-black p-3 shadow-[6px_6px_0_black] transform rotate-1">
              <div className="font-bold text-sm mb-2 border-b-2 border-black pb-1">
                Комментарии в CRM
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Введите комментарий..."
                className="w-full px-2 py-2 border-2 border-black bg-white h-20 resize-none text-xs mb-2 shadow-[2px_2px_0_black]"
              />
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={handleSendComment}
                  className="px-2 py-1 bg-white border-2 border-black font-bold text-xs shadow-[2px_2px_0_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_black]"
                >
                  Отправить комментарий
                </button>
                <button className="px-2 py-1 bg-white border-2 border-black font-bold text-xs shadow-[2px_2px_0_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_black]">
                  Прикрепить вложение
                </button>
              </div>
            </div>

            {/* Attachments */}
            <div className="bg-gradient-to-br from-[#ff69b4] to-[#ff1493] border-4 border-black p-3 shadow-[6px_6px_0_black] transform -rotate-1">
              <div className="text-white font-bold text-sm mb-2 border-b-2 border-white pb-1">
                Вложения
              </div>
              <div className="space-y-1">
                {appealData.attachments.map((file: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 bg-white border-2 border-black px-2 py-1 shadow-[2px_2px_0_black]">
                    {file.name.includes('Аудио') ? (
                      <Play className="w-3 h-3 flex-shrink-0" />
                    ) : (
                      <FileText className="w-3 h-3 flex-shrink-0" />
                    )}
                    <span className="text-xs font-bold flex-1 truncate">{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Y2K Footer with Pixel Icons */}
      <div className="bg-[#c0c0c0] border-t-4 border-black px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4 text-2xl">
          <span>💾</span>
          <span>📁</span>
          <span>🎨</span>
        </div>
        <div className="font-bold text-sm">✨ Y2K AESTHETIC ✨</div>
      </div>
    </div>
  );
}

// AUDIT CABINET COMPONENT (новый кабинет аудитора - по умолчанию)
function AuditCabinet({ onSelectAppeal }: { onSelectAppeal: (appeal: any) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
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
      {/* Title */}
      <div className="mb-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#ff00ff] to-[#00ffff] bg-clip-text text-transparent" style={{ WebkitTextStroke: '1px black' }}>
          Мои обращения
        </h1>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-2 flex-wrap">
        {['Физлицо', 'Юрлицо', 'Все обращения', 'Мои обращения'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2 border-2 border-black font-bold shadow-[3px_3px_0_black] transition-all ${
              activeFilter === filter
                ? 'bg-gradient-to-r from-[#ff00ff] to-[#00ffff] text-white'
                : 'bg-white hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_black]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto border-4 border-black bg-white shadow-[8px_8px_0_black]">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gradient-to-r from-[#ff00ff] to-[#00ffff] border-b-4 border-black">
            <tr className="text-white font-bold">
              <th className="text-left p-3 border-r-2 border-black">Номер</th>
              <th className="text-left p-3 border-r-2 border-black">Дата регистрации</th>
              <th className="text-left p-3 border-r-2 border-black">Категория</th>
              <th className="text-left p-3 border-r-2 border-black">Статус</th>
              <th className="text-left p-3 border-r-2 border-black">Дедлайн</th>
              <th className="text-left p-3 border-r-2 border-black">Ответственный</th>
              <th className="text-left p-3 border-r-2 border-black">ФИО заявителя</th>
              <th className="text-left p-3 border-r-2 border-black">Наименование ООО</th>
              <th className="text-left p-3 border-r-2 border-black">Адрес регистрации</th>
              <th className="text-left p-3">ЦБС</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppeals.map((appeal) => (
              <tr
                key={appeal.id}
                onClick={() => onSelectAppeal(appeal)}
                className="border-b-2 border-black hover:bg-gradient-to-r hover:from-[#ff00ff]/10 hover:to-[#00ffff]/10 cursor-pointer transition-colors font-bold"
              >
                <td className="p-3 border-r-2 border-black">
                  <div className="text-[#ff00ff]">{appeal.id}</div>
                </td>
                <td className="p-3 border-r-2 border-black">{appeal.regDate}</td>
                <td className="p-3 border-r-2 border-black">{appeal.category}</td>
                <td className="p-3 border-r-2 border-black">
                  <span className={`px-3 py-1 border-2 border-black shadow-[2px_2px_0_black] ${
                    appeal.status === 'В работе' 
                      ? 'bg-gradient-to-r from-[#00ff00] to-[#00ffff]' 
                      : 'bg-[#ffff00]'
                  }`}>
                    {appeal.status}
                  </span>
                </td>
                <td className="p-3 border-r-2 border-black text-[#ff6600]">{appeal.deadline}</td>
                <td className="p-3 border-r-2 border-black">{appeal.responsible}</td>
                <td className="p-3 border-r-2 border-black">{appeal.applicantName}</td>
                <td className="p-3 border-r-2 border-black">{appeal.organizationName}</td>
                <td className="p-3 border-r-2 border-black text-xs">{appeal.address}</td>
                <td className="p-3">{appeal.cbs}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty state */}
        {filteredAppeals.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="font-bold text-xl">Обращения не найдены</p>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="mt-4 text-center">
        <div className="inline-block px-6 py-2 bg-white border-2 border-black shadow-[4px_4px_0_black] font-bold">
          Всего обращений: {filteredAppeals.length}
        </div>
      </div>
    </div>
  );
}

// MAIN AUDIT PAGE COMPONENT
export function AuditPage() {
  const [selectedAppeal, setSelectedAppeal] = useState<any>(null);

  const handleSelectAppeal = (appeal: any) => {
    setSelectedAppeal(appeal);
  };

  const handleBack = () => {
    setSelectedAppeal(null);
  };

  // If appeal selected, show AuditCard
  if (selectedAppeal) {
    return <AuditCard appeal={selectedAppeal} onBack={handleBack} />;
  }

  // Otherwise show AuditCabinet (по умолчанию)
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#ff00ff] via-[#00ffff] to-[#ffff00]">
      {/* Y2K Header */}
      <div className="bg-[#c0c0c0] border-b-4 border-black px-4 py-2 shadow-[4px_4px_0_black]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-white border-2 border-black shadow-[2px_2px_0_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_black]">←</button>
            <button className="px-3 py-1 bg-white border-2 border-black shadow-[2px_2px_0_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_black]">→</button>
            <button className="px-3 py-1 bg-white border-2 border-black shadow-[2px_2px_0_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_black]">✕</button>
            <button className="px-3 py-1 bg-white border-2 border-black shadow-[2px_2px_0_black] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_black]">⌂</button>
            <input 
              type="text" 
              value="Мои обращения"
              readOnly
              className="flex-1 px-3 py-1 bg-white border-2 border-black font-bold"
              style={{ minWidth: '400px' }}
            />
            <button className="px-6 py-1 bg-white border-2 border-black shadow-[2px_2px_0_black] rounded-full hover:bg-gradient-to-r hover:from-[#ff00ff] hover:to-[#00ffff] font-bold">
              GO
            </button>
          </div>
          <div className="text-3xl">🔔</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#e0e0e0] px-4 py-3 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔍</span>
          <input 
            type="text" 
            placeholder="Поиск..."
            className="flex-1 px-4 py-2 border-2 border-black bg-white font-bold shadow-[2px_2px_0_black]"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden p-4">
        <AuditCabinet onSelectAppeal={handleSelectAppeal} />
      </div>

      {/* Y2K Footer with Pixel Icons */}
      <div className="bg-[#c0c0c0] border-t-4 border-black px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4 text-2xl">
          <span>💾</span>
          <span>📁</span>
          <span>🎨</span>
        </div>
        <div className="font-bold text-sm">✨ КАБИНЕТ АУДИТОРА ✨</div>
      </div>
    </div>
  );
}

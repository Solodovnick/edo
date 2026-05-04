import { useState } from 'react';
import { 
  Phone, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Bell,
  Plus,
  Award,
  Calendar,
  Send,
  ArrowLeft,
  Paperclip,
  MessageSquare,
  Building2,
  Play,
  X,
  ChevronRight,
  Search,
  User,
  MapPin
} from 'lucide-react';

// Mock data for appeals list
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
    category: 'Регулятор',
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
    category: 'Регулятор',
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

// Processing Card Component (existing design)
function ProcessingCard({ appeal, onBack }: { appeal: any; onBack: () => void }) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [responseText, setResponseText] = useState('');
  const [comment, setComment] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock data for the card
  const appealData = {
    id: appeal.id,
    type: appeal.category,
    status: appeal.status,
    category: 'Категория 1',
    subcategory: 'Подкатегория',
    registeredDate: appeal.regDate,
    plannedDate: appeal.deadline,
    slaRemaining: '1д, 12ч, 30м',
    client: {
      name: appeal.applicantName !== 'N/A' ? appeal.applicantName : 'Клиент',
      phone: '+79241234291',
    },
    history: [
      { id: '12345', dateOpen: '12.03.26', dateClosed: '13.03.26' },
      { id: '12346', dateOpen: '15.03.26', dateClosed: '16.03.26' },
      { id: '12347', dateOpen: '18.03.26', dateClosed: '-- --' },
      { id: '-- --', dateOpen: '-- --', dateClosed: 'В работе' },
    ],
    originalRequest: 'Уважаемый клиент не может войти в систему онлайн банкинга последние три дня. Он уже пытался восстановить пароль через СМС, но код не приходит. Также пробовал через email - ситуация аналогичная. Клиент очень недоволен и требует срочного решения проблемы. Просит выслать временный пароль или разблокировать доступ другим способом. Клиент является VIP-клиентом банка с 2015 года.',
    attachments: [
      { name: 'File 1  23.07.27 Таблица', icon: 'file' },
      { name: 'File 2  23.07.27 Скан обращения', icon: 'file' },
      { name: 'File 3  23.07.27 Сопроводительный документ', icon: 'file' },
      { name: 'File 4  23.07.27 Аудиозапись', icon: 'audio' },
    ],
    crmComments: [
      { id: 1, author: 'Иванов', time: 'вчр-18:38', text: 'Созвонился', dept: 'ЦТО' },
      { id: 2, author: 'Сидоров', time: 'вчр-17:25', text: 'Клиент звонил повторно', dept: 'ЦТО' },
      { id: 3, author: 'Комментарий:', time: '', text: 'Сбой устранен. Проблема с автоматической обработкой платежей исправлена', dept: 'Юридический департамент' },
    ],
  };

  const templates = [
    { id: '1', name: 'Выбрать шаблон решения' },
    { id: '2', name: 'Технический сбой / Извинения' },
    { id: '3', name: 'Проверка завершена / Положительный ответ' },
  ];

  const handleCreateHelpDesk = () => {
    alert('Создание задачи в HelpDesk...');
  };

  const handleCreateCopy = () => {
    alert('Создание копии обращения...');
  };

  const handleSendComment = () => {
    alert('Отправка комментария в CRM...');
    setComment('');
  };

  const handleSaveDraft = () => {
    alert('Черновик решения сохранён');
  };

  const handleOpenEditor = () => {
    alert('Открытие редактора...');
  };

  const handlePublishDecision = () => {
    alert('Опубликовать решение');
  };

  const handleSignUKEP = () => {
    alert('Подписание УКЭП...');
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a]" style={{ fontFamily: 'Courier New, monospace' }}>
      {/* Winamp-style header */}
      <div className="bg-[#1a1a1a] border-b border-[#00ff00] px-4 py-2">
        <div className="flex items-center justify-between text-[#00ff00] text-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>$ /usr/bin/ответственный</span>
            </button>
            <span className="text-gray-500"># Обработка обращений - АРМ Ответственного</span>
          </div>
          <div className="flex items-center gap-4">
            <span>PID: {appealData.id}</span>
            <span className="text-gray-500">v3.0.4</span>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Columns */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-12 gap-3 p-3">
          {/* Left Column - Client Dossier (25%) */}
          <div className="col-span-3 space-y-3 overflow-y-auto">
            {/* Client Info Widget */}
            <div className="bg-[#1a1a1a] border border-[#00ff00] rounded">
              <div className="border-b border-[#00ff00] px-3 py-2">
                <div className="text-[#00ff00] text-xs font-bold">$ /rootdata</div>
              </div>
              <div className="p-3 space-y-2 text-xs">
                <div className="text-gray-500">Виджет с заявителем:</div>
                <div className="flex items-center gap-2">
                  <span className="text-[#00ff00]">ФИО:</span>
                  <span className="text-white">{appealData.client.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-[#00ff00]" />
                  <span className="text-white">{appealData.client.phone}</span>
                </div>

                {/* Volume-style indicator */}
                <div className="mt-3">
                  <div className="text-[#00ff00] mb-1">VOLUME: 70%</div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={i} className={`h-1 w-1 ${i < 14 ? 'bg-[#00ff00]' : 'bg-gray-700'}`}></div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <input type="checkbox" id="keyboard" className="accent-[#00ff00]" />
                  <label htmlFor="keyboard" className="text-[#00ff00] text-xs">KEYBOARD_AGRM</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="cafe" className="accent-[#00ff00]" />
                  <label htmlFor="cafe" className="text-[#00ff00] text-xs">CAFE_AMBIENCE</label>
                </div>
              </div>
            </div>

            {/* History Widget */}
            <div className="bg-[#1a1a1a] border border-[#00ff00] rounded">
              <div className="border-b border-[#00ff00] px-3 py-2">
                <div className="text-[#00ff00] text-xs font-bold">История обращений</div>
              </div>
              <div className="p-3">
                <table className="w-full text-xs text-[#00ff00]">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left pb-1">Номер</th>
                      <th className="text-left pb-1">Дата</th>
                      <th className="text-left pb-1">Закрыт</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appealData.history.map((item, index) => (
                      <tr key={index} className="border-b border-gray-800">
                        <td className="py-1 text-white">{item.id}</td>
                        <td className="py-1 text-white">{item.dateOpen}</td>
                        <td className="py-1 text-white">{item.dateClosed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Response Action Widget */}
            <div className="bg-[#1a1a1a] border border-[#00ff00] rounded">
              <div className="border-b border-[#00ff00] px-3 py-2">
                <div className="text-[#00ff00] text-xs font-bold">Ответ действием</div>
              </div>
              <div className="p-3 space-y-2 text-xs">
                <div className="text-gray-500">Дата доведения</div>
                <input 
                  type="text" 
                  defaultValue="13/04/26"
                  className="w-full bg-black border border-[#00ff00] text-[#00ff00] px-2 py-1 text-xs"
                />
                <button className="w-full bg-black border border-[#00ff00] text-[#00ff00] px-2 py-1 hover:bg-[#00ff00] hover:text-black transition-colors text-xs">
                  Создать автозвонок
                </button>
              </div>
            </div>

            {/* Spectrum Visualization */}
            <div className="bg-[#1a1a1a] border border-[#00ff00] rounded p-2">
              <div className="text-[#00ff00] text-xs mb-2">SPECTRUM</div>
              <div className="flex gap-0.5 items-end h-12">
                {Array.from({ length: 30 }).map((_, i) => {
                  const height = Math.random() * 100;
                  return (
                    <div 
                      key={i} 
                      className="flex-1 bg-[#00ff00]"
                      style={{ height: `${height}%` }}
                    ></div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Middle Column - Work Area (50%) */}
          <div className="col-span-6 space-y-3 overflow-y-auto">
            {/* Appeal Details Form */}
            <div className="bg-[#1a1a1a] border border-[#00ff00] rounded">
              <div className="border-b border-[#00ff00] px-3 py-2 flex items-center justify-between">
                <div className="text-[#00ff00] text-xs font-bold">Обработка обращения</div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-black border border-[#00ff00] p-1 hover:bg-[#00ff00] hover:text-black transition-colors"
                  >
                    {isPlaying ? <X className="w-3 h-3 text-[#00ff00]" /> : <Play className="w-3 h-3 text-[#00ff00]" />}
                  </button>
                  <span className="text-[#00ff00] text-xs">
                    {isPlaying ? 'PLAYING' : 'STOPPED'}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {/* Form Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-gray-500 mb-1">Тип обращения</div>
                    <div className="bg-black border border-[#00ff00] text-white px-2 py-1">
                      {appealData.type}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Статус</div>
                    <div className="bg-black border border-[#00ff00] text-[#00ff00] px-2 py-1">
                      {appealData.status}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Категория</div>
                    <div className="bg-black border border-[#00ff00] text-white px-2 py-1">
                      {appealData.category}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Подкатегория</div>
                    <div className="bg-black border border-[#00ff00] text-white px-2 py-1">
                      {appealData.subcategory}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Дата регистрации</div>
                    <div className="bg-black border border-[#00ff00] text-white px-2 py-1">
                      {appealData.registeredDate}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Плановая дата</div>
                    <div className="bg-black border border-[#ff6600] text-[#ff6600] px-2 py-1">
                      {appealData.plannedDate}
                    </div>
                  </div>
                </div>

                {/* SLA Timer */}
                <div className="bg-black border border-[#00ff00] p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-gray-500 text-xs">Осталось до SLA:</div>
                    <div className="text-[#00ff00] font-bold">{appealData.slaRemaining}</div>
                  </div>
                  <div className="mt-2 bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#00ff00] h-full" style={{ width: '65%' }}></div>
                  </div>
                </div>

                {/* Original Request */}
                <div>
                  <div className="text-gray-500 mb-1 text-xs">Текст обращения</div>
                  <div className="bg-black border border-[#00ff00] text-white px-3 py-2 text-xs max-h-32 overflow-y-auto">
                    {appealData.originalRequest}
                  </div>
                </div>

                {/* Attached Files */}
                <div>
                  <div className="text-gray-500 mb-1 text-xs">Приложения ({appealData.attachments.length})</div>
                  <div className="space-y-1">
                    {appealData.attachments.map((file, index) => (
                      <div key={index} className="bg-black border border-[#00ff00] px-3 py-2 flex items-center gap-2 hover:bg-[#00ff00] hover:bg-opacity-10 transition-colors cursor-pointer">
                        <Paperclip className="w-3 h-3 text-[#00ff00]" />
                        <span className="text-white text-xs flex-1">{file.name}</span>
                        {file.icon === 'audio' && (
                          <Play className="w-3 h-3 text-[#00ff00]" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={handleCreateHelpDesk}
                    className="bg-black border border-[#00ff00] text-[#00ff00] px-3 py-2 text-xs hover:bg-[#00ff00] hover:text-black transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-3 h-3" />
                    HelpDesk
                  </button>
                  <button 
                    onClick={handleCreateCopy}
                    className="bg-black border border-[#00ff00] text-[#00ff00] px-3 py-2 text-xs hover:bg-[#00ff00] hover:text-black transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText className="w-3 h-3" />
                    Копия
                  </button>
                </div>
              </div>
            </div>

            {/* Response Template */}
            <div className="bg-[#1a1a1a] border border-[#00ff00] rounded">
              <div className="border-b border-[#00ff00] px-3 py-2">
                <div className="text-[#00ff00] text-xs font-bold">Подготовка решения</div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <div className="text-gray-500 mb-1 text-xs">Шаблон решения</div>
                  <select 
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full bg-black border border-[#00ff00] text-[#00ff00] px-2 py-1 text-xs"
                  >
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="text-gray-500 mb-1 text-xs">Текст решения</div>
                  <textarea 
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={6}
                    className="w-full bg-black border border-[#00ff00] text-white px-3 py-2 text-xs resize-none"
                    placeholder="Введите текст решения..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={handleSaveDraft}
                    className="bg-black border border-[#00ff00] text-[#00ff00] px-3 py-2 text-xs hover:bg-[#00ff00] hover:text-black transition-colors"
                  >
                    Черновик
                  </button>
                  <button 
                    onClick={handleOpenEditor}
                    className="bg-black border border-[#00ff00] text-[#00ff00] px-3 py-2 text-xs hover:bg-[#00ff00] hover:text-black transition-colors"
                  >
                    Редактор
                  </button>
                  <button 
                    onClick={handlePublishDecision}
                    className="bg-[#00ff00] border border-[#00ff00] text-black px-3 py-2 text-xs font-bold hover:bg-white transition-colors"
                  >
                    Опубликовать
                  </button>
                </div>

                <button 
                  onClick={handleSignUKEP}
                  className="w-full bg-black border border-[#ff6600] text-[#ff6600] px-3 py-2 text-xs hover:bg-[#ff6600] hover:text-black transition-colors flex items-center justify-center gap-2"
                >
                  <Award className="w-3 h-3" />
                  Подписать УКЭП
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - CRM & Context (25%) */}
          <div className="col-span-3 space-y-3 overflow-y-auto">
            {/* CRM Comments */}
            <div className="bg-[#1a1a1a] border border-[#00ff00] rounded">
              <div className="border-b border-[#00ff00] px-3 py-2">
                <div className="text-[#00ff00] text-xs font-bold">CRM История</div>
              </div>
              <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
                {appealData.crmComments.map((comment) => (
                  <div key={comment.id} className="bg-black border border-gray-700 p-2 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[#00ff00] font-bold">{comment.author}</span>
                      {comment.time && <span className="text-gray-500">{comment.time}</span>}
                    </div>
                    <div className="text-white mb-1">{comment.text}</div>
                    <div className="text-gray-500 text-xs">{comment.dept}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Comment */}
            <div className="bg-[#1a1a1a] border border-[#00ff00] rounded">
              <div className="border-b border-[#00ff00] px-3 py-2">
                <div className="text-[#00ff00] text-xs font-bold">Добавить комментарий</div>
              </div>
              <div className="p-3 space-y-2">
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full bg-black border border-[#00ff00] text-white px-2 py-1 text-xs resize-none"
                  placeholder="Ваш комментарий..."
                />
                <button 
                  onClick={handleSendComment}
                  className="w-full bg-black border border-[#00ff00] text-[#00ff00] px-3 py-2 text-xs hover:bg-[#00ff00] hover:text-black transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3 h-3" />
                  Отправить в CRM
                </button>
              </div>
            </div>

            {/* Attachments List */}
            <div className="bg-[#1a1a1a] border border-[#00ff00] rounded">
              <div className="border-b border-[#00ff00] px-3 py-2">
                <div className="text-[#00ff00] text-xs font-bold">PLAYLIST</div>
              </div>
              <div className="p-2 space-y-1">
                {appealData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 px-2 py-1 hover:bg-[#00ff00] hover:bg-opacity-10 transition-colors cursor-pointer">
                    <div className="text-gray-500 text-xs">{index + 1}.</div>
                    <FileText className="w-3 h-3 text-[#00ff00]" />
                    <span className="text-white text-xs flex-1">{file.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Keybindings */}
            <div className="bg-[#1a1a1a] border border-[#00ff00] rounded p-2">
              <div className="text-[#00ff00] text-xs mb-2">KEYBINDINGS</div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">SPC</span>
                  <span className="text-white">Play/Stop</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">M</span>
                  <span className="text-white">Mute</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">K</span>
                  <span className="text-white">Keyboard</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">C</span>
                  <span className="text-white">Cafe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#1a1a1a] border-t border-[#00ff00] px-4 py-2">
        <div className="flex items-center justify-between text-[#00ff00] text-xs">
          <div>~/dev/processing</div>
          <div className="flex items-center gap-2">
            <span>made by @bossnation, Design by kaichuhovskij</span>
            <Bell className="w-3 h-3" />
            <span className="text-gray-500">git (main) ≡ nothing to commit</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main ProcessingPage Component
export function ProcessingPage() {
  const [selectedAppeal, setSelectedAppeal] = useState<string | null>(null);
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

  // If an appeal is selected, show the processing card
  if (selectedAppeal) {
    const appeal = mockAppeals.find(a => a.id === selectedAppeal);
    if (appeal) {
      return <ProcessingCard appeal={appeal} onBack={() => setSelectedAppeal(null)} />;
    }
  }

  // Otherwise, show the appeals list (Cabinet)
  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a]" style={{ fontFamily: 'Courier New, monospace' }}>
      {/* Winamp-style header */}
      <div className="bg-[#1a1a1a] border-b border-[#00ff00] px-4 py-2">
        <div className="flex items-center justify-between text-[#00ff00] text-sm">
          <div className="flex items-center gap-4">
            <span>$ /usr/bin/ответственный</span>
            <span className="text-gray-500"># Кабинет ответственного - Список обращений</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500">v3.0.4</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col p-4">
        {/* Title */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-[#00ff00]">Мои обращения</h1>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск..."
              className="w-full bg-black border border-[#00ff00] text-white pl-10 pr-4 py-2 text-sm rounded"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 flex gap-2 flex-wrap">
          {['Физлицо', 'Юрлицо', 'Все обращения', 'Мои обращения'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-xs border transition-colors ${
                activeFilter === filter
                  ? 'bg-[#00ff00] text-black border-[#00ff00] font-bold'
                  : 'bg-black text-[#00ff00] border-[#00ff00] hover:bg-[#00ff00] hover:bg-opacity-10'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto border border-[#00ff00] bg-[#1a1a1a]">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-[#1a1a1a] border-b border-[#00ff00]">
              <tr className="text-[#00ff00]">
                <th className="text-left p-2 border-r border-gray-700">Номер</th>
                <th className="text-left p-2 border-r border-gray-700">Дата регистрации</th>
                <th className="text-left p-2 border-r border-gray-700">Категория</th>
                <th className="text-left p-2 border-r border-gray-700">Статус</th>
                <th className="text-left p-2 border-r border-gray-700">Дедлайн</th>
                <th className="text-left p-2 border-r border-gray-700">Ответственный</th>
                <th className="text-left p-2 border-r border-gray-700">ФИО заявителя</th>
                <th className="text-left p-2 border-r border-gray-700">Наименование ООО</th>
                <th className="text-left p-2 border-r border-gray-700">Адрес регистрации</th>
                <th className="text-left p-2">ЦБС</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppeals.map((appeal) => (
                <tr
                  key={appeal.id}
                  onClick={() => setSelectedAppeal(appeal.id)}
                  className="border-b border-gray-800 hover:bg-[#00ff00] hover:bg-opacity-10 cursor-pointer transition-colors text-white"
                >
                  <td className="p-2 border-r border-gray-800">
                    <div className="text-[#00ff00] font-bold">{appeal.id}</div>
                  </td>
                  <td className="p-2 border-r border-gray-800">{appeal.regDate}</td>
                  <td className="p-2 border-r border-gray-800">{appeal.category}</td>
                  <td className="p-2 border-r border-gray-800">
                    <span className={`px-2 py-1 text-xs ${
                      appeal.status === 'В работе' 
                        ? 'bg-[#00ff00] bg-opacity-20 text-[#00ff00]' 
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {appeal.status}
                    </span>
                  </td>
                  <td className="p-2 border-r border-gray-800 text-[#ff6600]">{appeal.deadline}</td>
                  <td className="p-2 border-r border-gray-800">{appeal.responsible}</td>
                  <td className="p-2 border-r border-gray-800">{appeal.applicantName}</td>
                  <td className="p-2 border-r border-gray-800">{appeal.organizationName}</td>
                  <td className="p-2 border-r border-gray-800 text-xs">{appeal.address}</td>
                  <td className="p-2">{appeal.cbs}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty state */}
          {filteredAppeals.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Обращения не найдены</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#1a1a1a] border-t border-[#00ff00] px-4 py-2">
        <div className="flex items-center justify-between text-[#00ff00] text-xs">
          <div>~/dev/processing-cabinet</div>
          <div className="flex items-center gap-2">
            <span>Всего обращений: {filteredAppeals.length}</span>
            <span className="text-gray-500">|</span>
            <span>made by @bossnation, Design by kaichuhovskij</span>
            <Bell className="w-3 h-3" />
            <span className="text-gray-500">git (main) ≡ nothing to commit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
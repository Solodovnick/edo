import { useState } from 'react';
import { X, FileText, Lock, Users, Tag, Paperclip, Save } from 'lucide-react';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: NoteData) => void;
  application: {
    number: string;
    client: string;
    subject: string;
  };
}

interface NoteData {
  noteType: string;
  visibility: string;
  noteText: string;
  tags: string[];
  attachments: string[];
  isPinned: boolean;
}

export function AddNoteModal({ isOpen, onClose, onConfirm, application }: AddNoteModalProps) {
  const [noteType, setNoteType] = useState('general');
  const [visibility, setVisibility] = useState('all');
  const [noteText, setNoteText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const noteTypes = [
    { value: 'general', label: '📝 Общая заметка', icon: '📝', color: 'blue' },
    { value: 'call', label: '📞 Звонок клиенту', icon: '📞', color: 'green' },
    { value: 'meeting', label: '👥 Встреча/совещание', icon: '👥', color: 'purple' },
    { value: 'analysis', label: '🔍 Анализ ситуации', icon: '🔍', color: 'orange' },
    { value: 'decision', label: '⚖️ Принятое решение', icon: '⚖️', color: 'indigo' },
    { value: 'reminder', label: '⏰ Напоминание', icon: '⏰', color: 'yellow' },
  ];

  const availableTags = [
    'Важно',
    'Срочно', 
    'Требует внимания',
    'Согласовано',
    'Ожидает ответа',
    'Проблема решена',
    'Нужна помощь',
    'Клиент доволен',
    'Клиент недоволен',
    'Технический вопрос',
    'Финансовый вопрос',
    'Юридический вопрос',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleSubmit = () => {
    // Валидация
    const newErrors: Record<string, string> = {};
    if (!noteText.trim()) newErrors.noteText = 'Введите текст заметки';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data: NoteData = {
      noteType,
      visibility,
      noteText,
      tags: selectedTags,
      attachments: [],
      isPinned,
    };
    
    onConfirm(data);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setNoteType('general');
    setVisibility('all');
    setNoteText('');
    setSelectedTags([]);
    setCustomTag('');
    setIsPinned(false);
    setErrors({});
  };

  const getTypeColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'border-blue-500 bg-blue-50',
      green: 'border-green-500 bg-green-50',
      purple: 'border-purple-500 bg-purple-50',
      orange: 'border-orange-500 bg-orange-50',
      indigo: 'border-indigo-500 bg-indigo-50',
      yellow: 'border-yellow-500 bg-yellow-50',
    };
    return colors[color] || colors.blue;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden m-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#0051BA]" />
              Добавить заметку
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-5">
            {/* Информация об обращении */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Обращение №</div>
              <div className="font-mono font-bold text-gray-800 mb-2">#{application.number}</div>
              <div className="text-sm font-medium text-gray-800 mb-1">{application.client}</div>
              <div className="text-xs text-gray-700">{application.subject}</div>
            </div>

            {/* Тип заметки */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип заметки
              </label>
              <div className="grid grid-cols-2 gap-2">
                {noteTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      noteType === type.value
                        ? `${getTypeColor(type.color)}`
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="noteType"
                      value={type.value}
                      checked={noteType === type.value}
                      onChange={(e) => setNoteType(e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-2xl">{type.icon}</span>
                    <span className="text-sm font-medium text-gray-800">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Видимость */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-1" />
                Кто может видеть заметку
              </label>
              <div className="space-y-2">
                <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  visibility === 'all'
                    ? 'border-[#0051BA] bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="visibility"
                    value="all"
                    checked={visibility === 'all'}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="w-4 h-4 text-[#0051BA]"
                  />
                  <Users className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">Все сотрудники</div>
                    <div className="text-xs text-gray-600">Заметка видна всем, кто имеет доступ к обращению</div>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  visibility === 'department'
                    ? 'border-[#0051BA] bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="visibility"
                    value="department"
                    checked={visibility === 'department'}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="w-4 h-4 text-[#0051BA]"
                  />
                  <Users className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">Только мое подразделение</div>
                    <div className="text-xs text-gray-600">Ограниченный доступ для текущего подразделения</div>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  visibility === 'private'
                    ? 'border-[#0051BA] bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={visibility === 'private'}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="w-4 h-4 text-[#0051BA]"
                  />
                  <Lock className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">Только я</div>
                    <div className="text-xs text-gray-600">Личная заметка, видна только вам</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Текст заметки */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Текст заметки *
              </label>
              <textarea
                value={noteText}
                onChange={(e) => {
                  setNoteText(e.target.value);
                  setErrors({ ...errors, noteText: '' });
                }}
                rows={6}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent ${
                  errors.noteText ? 'border-[#DD0000]' : 'border-gray-300'
                }`}
                placeholder="Введите текст заметки. Можно использовать форматирование Markdown..."
              />
              {errors.noteText && (
                <p className="text-xs text-[#DD0000] mt-1">{errors.noteText}</p>
              )}
              <div className="flex items-center justify-between mt-1">
                <div className="text-xs text-gray-500">
                  {noteText.length} / 2000 символов
                </div>
                <div className="flex gap-2">
                  <button className="text-xs text-[#0051BA] hover:underline">Жирный</button>
                  <button className="text-xs text-[#0051BA] hover:underline">Курсив</button>
                  <button className="text-xs text-[#0051BA] hover:underline">Список</button>
                </div>
              </div>
            </div>

            {/* Теги */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Теги (можно выбрать несколько)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-[#0051BA] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Добавить свой тег */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
                  placeholder="Добавить свой тег..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
                />
                <button
                  onClick={addCustomTag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Добавить
                </button>
              </div>

              {/* Выбранные теги */}
              {selectedTags.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-xs text-gray-600 mb-2">Выбранные теги ({selectedTags.length}):</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-[#0051BA] text-white rounded-full text-xs"
                      >
                        {tag}
                        <button
                          onClick={() => toggleTag(tag)}
                          className="hover:bg-blue-700 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Прикрепить файлы */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Paperclip className="w-4 h-4 inline mr-1" />
                Прикрепить файлы
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#0051BA] transition-colors cursor-pointer">
                <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-600 mb-1">Перетащите файлы или нажмите для выбора</div>
                <div className="text-xs text-gray-500">Максимум 5 файлов, до 10 МБ каждый</div>
              </div>
            </div>

            {/* Закрепить заметку */}
            <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#0051BA] transition-colors">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-5 h-5 mt-0.5 text-[#0051BA] rounded"
              />
              <div className="flex-1">
                <div className="text-sm font-bold text-gray-800 mb-1 flex items-center gap-2">
                  📌 Закрепить заметку наверху
                </div>
                <div className="text-xs text-gray-600">
                  Закрепленная заметка будет всегда отображаться в начале истории обращения
                </div>
              </div>
            </label>

            {/* Предпросмотр */}
            {noteText && (
              <div className="border-t border-gray-200 pt-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Предпросмотр:</div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 bg-[#0051BA] rounded-full flex items-center justify-center text-white text-xs font-bold">
                      ИИ
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-800">Иванов И.И.</span>
                        <span className="text-xs text-gray-500">Сейчас</span>
                        {isPinned && <span className="text-xs">📌</span>}
                      </div>
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs mb-2">
                        {noteTypes.find(t => t.value === noteType)?.icon} {noteTypes.find(t => t.value === noteType)?.label}
                      </div>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">{noteText}</div>
                      {selectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {selectedTags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Отменить
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003d8f] transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Сохранить заметку
          </button>
        </div>
      </div>
    </div>
  );
}

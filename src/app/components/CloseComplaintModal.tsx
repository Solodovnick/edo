import { useState } from 'react';
import { X, CheckCircle, FileText, Upload, AlertCircle } from 'lucide-react';

interface CloseComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: CloseData) => void;
  complaint?: {
    id: string;
    icon: string;
    client: string;
    subject: string;
    remaining?: string;
    status: string;
  } | null;
}

interface CloseData {
  resolution: string;
  resolutionDetails: string;
  clientSatisfaction: string;
  sendNotification: boolean;
  attachments: string[];
  rootCause: string;
  preventiveMeasures: string;
}

export function CloseComplaintModal({ isOpen, onClose, onConfirm, complaint }: CloseComplaintModalProps) {
  const [resolution, setResolution] = useState('');
  const [resolutionDetails, setResolutionDetails] = useState('');
  const [clientSatisfaction, setClientSatisfaction] = useState('');
  const [sendNotification, setSendNotification] = useState(true);
  const [rootCause, setRootCause] = useState('');
  const [preventiveMeasures, setPreventiveMeasures] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleClose = () => {
    // Валидация
    const newErrors: Record<string, string> = {};
    if (!resolution) newErrors.resolution = 'Обязательное поле';
    if (!resolutionDetails.trim()) newErrors.resolutionDetails = 'Обязательное поле';
    if (!clientSatisfaction) newErrors.clientSatisfaction = 'Обязательное поле';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data: CloseData = {
      resolution,
      resolutionDetails,
      clientSatisfaction,
      sendNotification,
      attachments: [],
      rootCause,
      preventiveMeasures,
    };
    onConfirm(data);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setResolution('');
    setResolutionDetails('');
    setClientSatisfaction('');
    setSendNotification(true);
    setRootCause('');
    setPreventiveMeasures('');
    setErrors({});
  };

  if (!isOpen || !complaint) return null;

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
              <CheckCircle className="w-5 h-5 text-[#00AA44]" />
              Закрыть обращение
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
              <div className="flex items-start gap-3">
                <span className="text-2xl">{complaint.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-xs text-gray-600">Обращение №</div>
                      <div className="font-mono font-bold text-gray-800">#{complaint.id}</div>
                    </div>
                    <div className="text-xs">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-medium">
                        {complaint.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-800 mb-1">{complaint.client}</div>
                  <div className="text-xs text-gray-700">{complaint.subject}</div>
                </div>
              </div>
            </div>

            {/* Результат рассмотрения */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Результат рассмотрения *
              </label>
              <select
                value={resolution}
                onChange={(e) => {
                  setResolution(e.target.value);
                  setErrors({ ...errors, resolution: '' });
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent ${
                  errors.resolution ? 'border-[#DD0000]' : 'border-gray-300'
                }`}
              >
                <option value="">Выберите результат</option>
                <option value="resolved_positive">✅ Решено положительно (в пользу клиента)</option>
                <option value="resolved_negative">❌ Решено отрицательно (отказ клиенту)</option>
                <option value="resolved_partial">🔄 Частичное удовлетворение</option>
                <option value="withdrawn">📝 Клиент отозвал обращение</option>
                <option value="duplicate">🔗 Дубликат обращения</option>
                <option value="redirected">➡️ Перенаправлено в другое подразделение</option>
                <option value="info_provided">ℹ️ Предоставлена информация (консультация)</option>
              </select>
              {errors.resolution && (
                <p className="text-xs text-[#DD0000] mt-1">{errors.resolution}</p>
              )}
            </div>

            {/* Детальное описание решения */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Детальное описание решения *
              </label>
              <textarea
                value={resolutionDetails}
                onChange={(e) => {
                  setResolutionDetails(e.target.value);
                  setErrors({ ...errors, resolutionDetails: '' });
                }}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent ${
                  errors.resolutionDetails ? 'border-[#DD0000]' : 'border-gray-300'
                }`}
                placeholder="Опишите детали решения, принятые меры, результаты..."
              />
              {errors.resolutionDetails && (
                <p className="text-xs text-[#DD0000] mt-1">{errors.resolutionDetails}</p>
              )}
            </div>

            {/* Удовлетворенность клиента */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Удовлетворенность клиента *
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { value: 'very_satisfied', emoji: '😊', label: 'Очень доволен', color: 'border-[#00AA44] bg-green-50' },
                  { value: 'satisfied', emoji: '🙂', label: 'Доволен', color: 'border-green-400 bg-green-50' },
                  { value: 'neutral', emoji: '😐', label: 'Нейтрально', color: 'border-gray-400 bg-gray-50' },
                  { value: 'dissatisfied', emoji: '😞', label: 'Недоволен', color: 'border-yellow-400 bg-yellow-50' },
                  { value: 'very_dissatisfied', emoji: '😠', label: 'Очень недоволен', color: 'border-[#DD0000] bg-red-50' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      clientSatisfaction === option.value
                        ? option.color
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="satisfaction"
                      value={option.value}
                      checked={clientSatisfaction === option.value}
                      onChange={(e) => {
                        setClientSatisfaction(e.target.value);
                        setErrors({ ...errors, clientSatisfaction: '' });
                      }}
                      className="sr-only"
                    />
                    <div className="text-3xl mb-1">{option.emoji}</div>
                    <div className="text-xs text-center font-medium text-gray-700">{option.label}</div>
                  </label>
                ))}
              </div>
              {errors.clientSatisfaction && (
                <p className="text-xs text-[#DD0000] mt-1">{errors.clientSatisfaction}</p>
              )}
            </div>

            {/* Анализ первопричины (для улучшения процессов) */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-bold text-gray-700">Анализ для улучшения процессов</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Первопричина проблемы (Root Cause)
                  </label>
                  <select
                    value={rootCause}
                    onChange={(e) => setRootCause(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
                  >
                    <option value="">Не указано</option>
                    <option value="process_error">Ошибка в процессе</option>
                    <option value="system_error">Техническая ошибка системы</option>
                    <option value="human_error">Человеческий фактор</option>
                    <option value="lack_of_info">Недостаток информации у клиента</option>
                    <option value="policy_issue">Проблема с политиками/регламентами</option>
                    <option value="external_factor">Внешние факторы</option>
                    <option value="service_quality">Качество обслуживания</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Превентивные меры (чтобы избежать в будущем)
                  </label>
                  <textarea
                    value={preventiveMeasures}
                    onChange={(e) => setPreventiveMeasures(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
                    placeholder="Какие меры нужно предпринять, чтобы подобные ситуации не повторялись..."
                  />
                </div>
              </div>
            </div>

            {/* Вложения */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FileText className="w-4 h-4 inline mr-1" />
                Прикрепить документы
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0051BA] transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-600 mb-1">Перетащите файлы или нажмите для выбора</div>
                <div className="text-xs text-gray-500">Поддерживаемые форматы: PDF, DOC, JPG, PNG (макс. 10 МБ)</div>
              </div>
            </div>

            {/* Уведомить клиента */}
            <label className="flex items-center gap-3 p-4 border-2 border-[#0051BA] bg-blue-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={sendNotification}
                onChange={(e) => setSendNotification(e.target.checked)}
                className="w-5 h-5 text-[#0051BA] rounded"
              />
              <div className="flex-1">
                <div className="text-sm font-bold text-gray-800 mb-1">
                  ✉️ Отправить уведомление клиенту о закрытии обращения
                </div>
                <div className="text-xs text-gray-600">
                  Клиент получит email с описанием решения и результатом рассмотрения
                </div>
              </div>
            </label>

            {/* Что произойдет */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00AA44]" />
                Что произойдет после закрытия:
              </div>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>✅ Статус обращения изменится на "Закрыто"</li>
                <li>✅ Обращение будет удалено из активной очереди</li>
                {sendNotification && <li>✅ Клиент получит уведомление на email</li>}
                <li>✅ Данные будут сохранены в архиве</li>
                <li>✅ Обновится статистика SLA</li>
                <li>✅ Освободится место в очереди исполнителя</li>
              </ul>
            </div>
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
            onClick={handleClose}
            className="flex-1 px-4 py-2 bg-[#00AA44] text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Закрыть обращение
          </button>
        </div>
      </div>
    </div>
  );
}

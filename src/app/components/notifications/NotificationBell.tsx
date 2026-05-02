import { useState, useEffect, useRef } from 'react';
import { Bell, X, Mail, Phone, Check, Trash2, AlertCircle, Clock, Users, FileCheck, AlertTriangle } from 'lucide-react';
import { notificationService, Notification, UserRole, NotificationType } from '../../../services/notificationService';
import { toast } from 'sonner';

interface NotificationBellProps {
  variant?: 'cabinet' | 'card' | 'header';
  role?: UserRole;
  onNotificationClick?: (appealId: string) => void;
}

export function NotificationBell({ variant = 'cabinet', role = 'registrar', onNotificationClick }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const previousCountRef = useRef(0);

  // Load notifications
  const loadNotifications = () => {
    const allNotifications = notificationService.getNotifications(role);
    setNotifications(allNotifications);
    const newUnreadCount = notificationService.getUnreadCount(role);
    
    // Show toast if new notification arrived
    if (newUnreadCount > previousCountRef.current && previousCountRef.current > 0) {
      const latestNotification = allNotifications.find(n => !n.isRead);
      if (latestNotification) {
        const icon = getPriorityIcon(latestNotification.priority);
        toast.info(latestNotification.title, {
          duration: 5000,
          icon,
          description: latestNotification.message,
        });
      }
    }
    
    previousCountRef.current = newUnreadCount;
    setUnreadCount(newUnreadCount);
  };

  useEffect(() => {
    loadNotifications();

    // Reload every 3 seconds
    const interval = setInterval(loadNotifications, 3000);

    return () => clearInterval(interval);
  }, [role]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(role, id);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead(role);
    loadNotifications();
    toast.success('Все уведомления отмечены как прочитанные');
  };

  const handleDelete = (id: string) => {
    notificationService.deleteNotification(role, id);
    loadNotifications();
    toast.success('Уведомление удалено');
  };

  const handleClearAll = () => {
    notificationService.clearAll(role);
    loadNotifications();
    setIsOpen(false);
    toast.success('Все уведомления удалены');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays === 1) return 'вчера';
    if (diffDays < 7) return `${diffDays} дн назад`;
    
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  const getPriorityIcon = (priority: Notification['priority']) => {
    switch (priority) {
      case 'critical':
        return '🔴';
      case 'high':
        return '⚠️';
      case 'normal':
        return '📋';
      case 'low':
        return '📌';
      default:
        return '📋';
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    // Registrar
    if (type === 'new_written_appeal') return <Mail className="w-4 h-4 text-blue-700" />;
    if (type === 'incoming_call') return <Phone className="w-4 h-4 text-red-700" />;
    if (type === 'appeal_returned_from_pool') return <AlertCircle className="w-4 h-4 text-orange-700" />;
    if (type === 'additional_info_required') return <FileCheck className="w-4 h-4 text-purple-700" />;

    // Responsible
    if (type === 'new_appeal_assigned') return <Users className="w-4 h-4 text-purple-700" />;
    if (type === 'deadline_approaching_1day') return <Clock className="w-4 h-4 text-yellow-700" />;
    if (type === 'deadline_approaching_3hours') return <AlertTriangle className="w-4 h-4 text-red-700" />;
    if (type === 'deadline_expired') return <AlertCircle className="w-4 h-4 text-red-700" />;
    if (type === 'department_response_received') return <Mail className="w-4 h-4 text-green-700" />;
    if (type === 'appeal_returned_from_audit') return <FileCheck className="w-4 h-4 text-orange-700" />;

    // Manager
    if (type === 'sla_violation_critical') return <AlertTriangle className="w-4 h-4 text-red-700" />;
    if (type === 'regulator_appeal_attention') return <AlertCircle className="w-4 h-4 text-red-700" />;
    if (type === 'appeal_escalated') return <AlertTriangle className="w-4 h-4 text-orange-700" />;
    if (type === 'processing_time_exceeded') return <Clock className="w-4 h-4 text-yellow-700" />;
    if (type === 'daily_department_summary') return <FileCheck className="w-4 h-4 text-blue-700" />;

    // Auditor
    if (type === 'new_appeal_for_audit') return <FileCheck className="w-4 h-4 text-purple-700" />;
    if (type === 'appeal_waiting_2hours') return <Clock className="w-4 h-4 text-orange-700" />;
    if (type === 'audit_completed') return <Check className="w-4 h-4 text-green-700" />;
    if (type === 'critical_appeal_urgent') return <AlertTriangle className="w-4 h-4 text-red-700" />;
    if (type === 'new_audit_task') return <FileCheck className="w-4 h-4 text-purple-700" />;

    return <Bell className="w-4 h-4 text-gray-700" />;
  };

  const getNotificationBgColor = (type: NotificationType) => {
    // Registrar
    if (type === 'incoming_call') return 'bg-red-100';
    if (type === 'new_written_appeal') return 'bg-blue-100';
    if (type === 'appeal_returned_from_pool') return 'bg-orange-100';
    if (type === 'additional_info_required') return 'bg-purple-100';

    // Responsible
    if (type === 'new_appeal_assigned') return 'bg-purple-100';
    if (type === 'deadline_approaching_1day') return 'bg-yellow-100';
    if (type === 'deadline_approaching_3hours') return 'bg-red-100';
    if (type === 'deadline_expired') return 'bg-red-100';
    if (type === 'department_response_received') return 'bg-green-100';
    if (type === 'appeal_returned_from_audit') return 'bg-orange-100';

    // Manager
    if (type === 'sla_violation_critical') return 'bg-red-100';
    if (type === 'regulator_appeal_attention') return 'bg-red-100';
    if (type === 'appeal_escalated') return 'bg-orange-100';
    if (type === 'processing_time_exceeded') return 'bg-yellow-100';
    if (type === 'daily_department_summary') return 'bg-blue-100';

    // Auditor
    if (type === 'new_appeal_for_audit') return 'bg-purple-100';
    if (type === 'appeal_waiting_2hours') return 'bg-orange-100';
    if (type === 'audit_completed') return 'bg-green-100';
    if (type === 'critical_appeal_urgent') return 'bg-red-100';
    if (type === 'new_audit_task') return 'bg-purple-100';

    // Secretary
    if (type === 'new_commission_request') return 'bg-purple-100';
    if (type === 'commission_meeting_scheduled') return 'bg-blue-100';
    if (type === 'decision_ready_for_signing') return 'bg-orange-100';
    if (type === 'decision_signed') return 'bg-green-100';
    if (type === 'protocol_approval_required') return 'bg-red-100';

    return 'bg-gray-100';
  };

  // Test notifications for each role
  const getTestNotifications = () => {
    switch (role) {
      case 'registrar':
        return [
          {
            label: '📞 Звонок',
            type: 'incoming_call' as NotificationType,
            color: 'bg-red-600 hover:bg-red-700',
          },
          {
            label: '✉️ Письменное',
            type: 'new_written_appeal' as NotificationType,
            color: 'bg-blue-600 hover:bg-blue-700',
          },
          {
            label: '🔄 Возврат',
            type: 'appeal_returned_from_pool' as NotificationType,
            color: 'bg-orange-600 hover:bg-orange-700',
          },
        ];

      case 'responsible':
        return [
          {
            label: '📋 Назначено',
            type: 'new_appeal_assigned' as NotificationType,
            color: 'bg-purple-600 hover:bg-purple-700',
          },
          {
            label: '⏰ Дедлайн 1д',
            type: 'deadline_approaching_1day' as NotificationType,
            color: 'bg-yellow-600 hover:bg-yellow-700',
          },
          {
            label: '🔴 Просрочено',
            type: 'deadline_expired' as NotificationType,
            color: 'bg-red-600 hover:bg-red-700',
          },
        ];

      case 'manager':
        return [
          {
            label: '🚨 Нарушение SLA',
            type: 'sla_violation_critical' as NotificationType,
            color: 'bg-red-600 hover:bg-red-700',
          },
          {
            label: '⚡ Регулятор',
            type: 'regulator_appeal_attention' as NotificationType,
            color: 'bg-orange-600 hover:bg-orange-700',
          },
          {
            label: '📊 Сводка',
            type: 'daily_department_summary' as NotificationType,
            color: 'bg-blue-600 hover:bg-blue-700',
          },
        ];

      case 'auditor':
        return [
          {
            label: '📝 На аудит',
            type: 'new_appeal_for_audit' as NotificationType,
            color: 'bg-purple-600 hover:bg-purple-700',
          },
          {
            label: '⏱️ Ожидает 2ч',
            type: 'appeal_waiting_2hours' as NotificationType,
            color: 'bg-orange-600 hover:bg-orange-700',
          },
          {
            label: '🔥 Срочно',
            type: 'critical_appeal_urgent' as NotificationType,
            color: 'bg-red-600 hover:bg-red-700',
          },
          {
            label: '📝 Новая задача',
            type: 'new_audit_task' as NotificationType,
            color: 'bg-purple-600 hover:bg-purple-700',
          },
        ];

      case 'secretary':
        return [
          {
            label: '✉️ Запрос на комиссию',
            type: 'new_commission_request' as NotificationType,
            color: 'bg-purple-600 hover:bg-purple-700',
          },
          {
            label: '📝 Готово к подписи',
            type: 'decision_ready_for_signing' as NotificationType,
            color: 'bg-orange-600 hover:bg-orange-700',
          },
          {
            label: '⚠️ Протокол',
            type: 'protocol_approval_required' as NotificationType,
            color: 'bg-red-600 hover:bg-red-700',
          },
        ];

      default:
        return [];
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className={`relative p-2 rounded-lg transition-all ${
          variant === 'cabinet'
            ? 'bg-white/10 hover:bg-white/20 text-white'
            : variant === 'header'
            ? 'hover:bg-gray-100 text-gray-600'
            : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
        }`}
        title="Уведомления"
      >
        <Bell className="w-5 h-5" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
          style={{ maxHeight: '600px' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-purple-50">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-700" />
              <h3 className="font-semibold text-gray-800">
                Уведомления {unreadCount > 0 && `(${unreadCount})`}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-purple-700 hover:text-purple-900 font-medium"
                    title="Отметить все как прочитанные"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-red-600 hover:text-red-800 font-medium"
                    title="Очистить все"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Нет уведомлений</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => {
                    if (notification.appealId && onNotificationClick) {
                      onNotificationClick(notification.appealId);
                      handleMarkAsRead(notification.id);
                      setIsOpen(false);
                    }
                  }}
                  className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-purple-50/30' : ''
                  } ${notification.appealId && onNotificationClick ? 'cursor-pointer' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getNotificationBgColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium mb-0.5 ${
                            !notification.isRead ? 'text-purple-700' : 'text-gray-600'
                          }`}>
                            {notification.title}
                          </p>
                          <p className={`text-sm ${
                            !notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.message}
                          </p>
                          
                          {/* Appeal ID link for auditor */}
                          {role === 'auditor' && notification.appealId && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('[NotificationBell] Link clicked for appeal:', notification.appealId);
                                if (onNotificationClick) {
                                  console.log('[NotificationBell] Calling onNotificationClick');
                                  onNotificationClick(notification.appealId!);
                                  handleMarkAsRead(notification.id);
                                  setIsOpen(false);
                                } else {
                                  console.warn('[NotificationBell] No onNotificationClick handler provided');
                                }
                              }}
                              className="mt-1 text-xs text-purple-600 hover:text-purple-800 font-medium underline"
                            >
                              открыть карточку обращения №{notification.appealId}
                            </button>
                          )}
                        </div>
                        
                        {/* Delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                          className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                          title="Удалить"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-1.5 gap-2">
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-500">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                          
                          {/* Priority badge */}
                          {notification.priority === 'critical' && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                              Критично
                            </span>
                          )}
                          {notification.priority === 'high' && !notification.isRead && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                              Срочно
                            </span>
                          )}
                        </div>
                        
                        {!notification.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                          >
                            Прочитано
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer - Test Actions - Only for non-auditor roles */}
          {role !== 'auditor' && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-600 mb-2 font-medium">
                Тестирование ({role === 'registrar' ? 'Регистратор' : role === 'responsible' ? 'Ответственный' : role === 'manager' ? 'Руководитель' : role === 'secretary' ? 'Секретарь' : 'Аудитор'}):
              </p>
              <div className="grid gap-2 grid-cols-3">
                {getTestNotifications().map((testNotif, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const metadata: Record<string, any> = {
                        appealId: Math.floor(Math.random() * 100000).toString(),
                      };

                      // Add role-specific metadata
                      if (role === 'responsible') {
                        metadata.category = 'Тестовая категория';
                        if (testNotif.type === 'deadline_expired') {
                          metadata.overdueDays = 2;
                        }
                      } else if (role === 'manager') {
                        metadata.department = 'Тестовое подразделение';
                        if (testNotif.type === 'sla_violation_critical') {
                          metadata.violationCount = 5;
                        } else if (testNotif.type === 'daily_department_summary') {
                          metadata.processed = 15;
                          metadata.inProgress = 8;
                          metadata.overdue = 2;
                        }
                      } else if (role === 'secretary') {
                        if (testNotif.type === 'commission_meeting_scheduled') {
                          metadata.meetingDate = '15.03.2026';
                        } else if (testNotif.type === 'decision_signed') {
                          metadata.signerName = 'Иванов А.П.';
                        } else if (testNotif.type === 'protocol_approval_required') {
                          metadata.protocolDate = '13.03.2026';
                        }
                      }

                      notificationService.addNotification(role, testNotif.type, { metadata });
                      loadNotifications();
                      toast.success('Тестовое уведомление добавлено');
                    }}
                    className={`px-2 py-1.5 text-white text-xs rounded font-medium transition-colors ${testNotif.color}`}
                  >
                    {testNotif.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
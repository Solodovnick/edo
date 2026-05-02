// Service for managing notifications for all user roles
export type UserRole = 'registrar' | 'responsible' | 'manager' | 'auditor';

export type NotificationType = 
  // Registrar notifications
  | 'new_written_appeal'
  | 'incoming_call'
  | 'appeal_returned_from_pool'
  | 'additional_info_required'
  
  // Responsible notifications
  | 'new_appeal_assigned'
  | 'deadline_approaching_1day'
  | 'deadline_approaching_3hours'
  | 'deadline_expired'
  | 'department_response_received'
  | 'appeal_returned_from_audit'
  
  // Manager notifications
  | 'sla_violation_critical'
  | 'regulator_appeal_attention'
  | 'appeal_escalated'
  | 'processing_time_exceeded'
  | 'daily_department_summary'
  
  // Auditor notifications
  | 'new_appeal_for_audit'
  | 'appeal_waiting_2hours'
  | 'audit_completed'
  | 'critical_appeal_urgent'
  | 'new_audit_task';

export interface Notification {
  id: string;
  role: UserRole;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'critical' | 'high' | 'normal' | 'low';
  appealId?: string;
  metadata?: Record<string, any>;
}

const STORAGE_KEY_PREFIX = 'edo_notifications_';

class NotificationService {
  // Get storage key for specific role
  private getStorageKey(role: UserRole): string {
    return `${STORAGE_KEY_PREFIX}${role}`;
  }

  // Get all notifications for a role
  getNotifications(role: UserRole): Notification[] {
    try {
      const data = localStorage.getItem(this.getStorageKey(role));
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading notifications:', error);
      return [];
    }
  }

  // Add new notification
  addNotification(
    role: UserRole,
    type: NotificationType,
    options?: {
      appealId?: string;
      metadata?: Record<string, any>;
    }
  ): Notification {
    const notifications = this.getNotifications(role);
    
    const { title, message, priority } = this.getNotificationContent(type, options?.metadata);
    
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      isRead: false,
      priority,
      appealId: options?.appealId,
      metadata: options?.metadata,
    };

    notifications.unshift(notification);
    
    // Keep only last 100 notifications
    const trimmed = notifications.slice(0, 100);
    
    try {
      localStorage.setItem(this.getStorageKey(role), JSON.stringify(trimmed));
    } catch (error) {
      console.error('Error saving notification:', error);
    }

    return notification;
  }

  // Get notification content based on type
  private getNotificationContent(
    type: NotificationType,
    metadata?: Record<string, any>
  ): { title: string; message: string; priority: Notification['priority'] } {
    const templates: Record<NotificationType, { title: string; message: string; priority: Notification['priority'] }> = {
      // Registrar
      new_written_appeal: {
        title: 'Новое письменное обращение',
        message: 'получено новое письменное обращение для регистрации',
        priority: 'normal',
      },
      incoming_call: {
        title: 'Входящий звонок',
        message: 'звонок, выполните регистрацию обращения',
        priority: 'high',
      },
      appeal_returned_from_pool: {
        title: 'Обращение вернулось',
        message: `обращение №${metadata?.appealId || 'N/A'} вернулось из пула - ответственный отказался`,
        priority: 'high',
      },
      additional_info_required: {
        title: 'Требуется информация',
        message: `обращение №${metadata?.appealId || 'N/A'} требует дополнительной информации от клиента`,
        priority: 'normal',
      },
      
      // Responsible
      new_appeal_assigned: {
        title: 'Назначено обращение',
        message: `вам назначено обращение №${metadata?.appealId || 'N/A'} - ${metadata?.category || 'категория не указана'}`,
        priority: 'high',
      },
      deadline_approaching_1day: {
        title: 'Истекает срок',
        message: `обращение №${metadata?.appealId || 'N/A'} - до дедлайна остался 1 день`,
        priority: 'high',
      },
      deadline_approaching_3hours: {
        title: '⚠️ Срочно! 3 часа до дедлайна',
        message: `обращение №${metadata?.appealId || 'N/A'} - до дедлайна осталось 3 часа!`,
        priority: 'critical',
      },
      deadline_expired: {
        title: '🔴 Просрочено!',
        message: `обращение №${metadata?.appealId || 'N/A'} просрочено на ${metadata?.overdueDays || 0} дн.`,
        priority: 'critical',
      },
      department_response_received: {
        title: 'Получен ответ',
        message: `${metadata?.department || 'Подразделение'} ответило по обращению №${metadata?.appealId || 'N/A'}`,
        priority: 'normal',
      },
      appeal_returned_from_audit: {
        title: 'Возврат с аудита',
        message: `обращение №${metadata?.appealId || 'N/A'} возвращено на доработку - ${metadata?.reason || 'см. комментарий'}`,
        priority: 'high',
      },
      
      // Manager
      sla_violation_critical: {
        title: '🚨 Критическое нарушение SLA',
        message: `в подразделении "${metadata?.department || 'N/A'}" ${metadata?.violationCount || 0} просроченных обращений`,
        priority: 'critical',
      },
      regulator_appeal_attention: {
        title: '⚡ Обращение от регулятора',
        message: `обращение №${metadata?.appealId || 'N/A'} от ${metadata?.regulator || 'ЦБ РФ'} требует внимания руководителя`,
        priority: 'critical',
      },
      appeal_escalated: {
        title: 'Эскалация обращения',
        message: `обращение №${metadata?.appealId || 'N/A'} эскалировано - ${metadata?.reason || 'требуется решение'}`,
        priority: 'high',
      },
      processing_time_exceeded: {
        title: 'Превышение времени',
        message: `среднее время обработки в "${metadata?.department || 'подразделении'}" превышено на ${metadata?.excessPercent || 0}%`,
        priority: 'high',
      },
      daily_department_summary: {
        title: 'Ежедневная сводка',
        message: `подразделение "${metadata?.department || 'N/A'}": обработано ${metadata?.processed || 0}, в работе ${metadata?.inProgress || 0}, просрочено ${metadata?.overdue || 0}`,
        priority: 'low',
      },
      
      // Auditor
      new_appeal_for_audit: {
        title: 'Новая задача на аудит',
        message: `поступила задача номер ${metadata?.appealId || 'N/A'}`,
        priority: 'normal',
      },
      appeal_waiting_2hours: {
        title: 'Обращение ожидает',
        message: `поступила задача номер ${metadata?.appealId || 'N/A'}`,
        priority: 'high',
      },
      audit_completed: {
        title: 'Аудит завершен',
        message: `поступила задача номер ${metadata?.appealId || 'N/A'}`,
        priority: 'normal',
      },
      critical_appeal_urgent: {
        title: 'Срочная задача на аудит',
        message: `поступила задача номер ${metadata?.appealId || 'N/A'}`,
        priority: 'critical',
      },
      
      new_audit_task: {
        title: 'Новая задача на аудит',
        message: `поступила задача номер ${metadata?.appealId || 'N/A'}`,
        priority: 'high',
      },
      
      // Secretary
      new_commission_request: {
        title: 'Новый запрос на комиссию',
        message: `обращение №${metadata?.appealId || 'N/A'} направлено на претензионную комиссию`,
        priority: 'high',
      },
      commission_meeting_scheduled: {
        title: 'Запланирована встреча комиссии',
        message: `встреча комиссии назначена на ${metadata?.meetingDate || 'дату не указана'}`,
        priority: 'normal',
      },
      decision_ready_for_signing: {
        title: 'Решение готово к подписанию',
        message: `решение по обращению №${metadata?.appealId || 'N/A'} готово к подписанию`,
        priority: 'high',
      },
      decision_signed: {
        title: 'Решение подписано',
        message: `решение по обращению №${metadata?.appealId || 'N/A'} подписано ${metadata?.signerName || 'руководителем'}`,
        priority: 'normal',
      },
      protocol_approval_required: {
        title: 'Требуется утверждение протокола',
        message: `протокол заседания от ${metadata?.protocolDate || 'дата не указана'} требует утверждения`,
        priority: 'high',
      },
    };

    return templates[type] || {
      title: 'Уведомление',
      message: 'новое уведомление',
      priority: 'normal',
    };
  }

  // Mark notification as read
  markAsRead(role: UserRole, id: string): boolean {
    const notifications = this.getNotifications(role);
    const notification = notifications.find(n => n.id === id);
    
    if (notification) {
      notification.isRead = true;
      try {
        localStorage.setItem(this.getStorageKey(role), JSON.stringify(notifications));
        return true;
      } catch (error) {
        console.error('Error updating notification:', error);
        return false;
      }
    }
    
    return false;
  }

  // Mark all as read
  markAllAsRead(role: UserRole): boolean {
    const notifications = this.getNotifications(role);
    notifications.forEach(n => n.isRead = true);
    
    try {
      localStorage.setItem(this.getStorageKey(role), JSON.stringify(notifications));
      return true;
    } catch (error) {
      console.error('Error updating notifications:', error);
      return false;
    }
  }

  // Delete notification
  deleteNotification(role: UserRole, id: string): boolean {
    const notifications = this.getNotifications(role);
    const filtered = notifications.filter(n => n.id !== id);
    
    try {
      localStorage.setItem(this.getStorageKey(role), JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  // Clear all notifications
  clearAll(role: UserRole): boolean {
    try {
      localStorage.setItem(this.getStorageKey(role), JSON.stringify([]));
      return true;
    } catch (error) {
      console.error('Error clearing notifications:', error);
      return false;
    }
  }

  // Get unread count
  getUnreadCount(role: UserRole): number {
    return this.getNotifications(role).filter(n => !n.isRead).length;
  }
}

export const notificationService = new NotificationService();
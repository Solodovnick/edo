import { notificationService } from '../services/notificationService';

// Initialize with some test notifications on first load
export function initializeTestNotifications() {
  const INIT_KEY = 'notifications_initialized_v4'; // Increased version to reinitialize
  
  // Check if already initialized
  if (localStorage.getItem(INIT_KEY)) {
    return;
  }

  // Clear old notifications (from previous versions)
  notificationService.clearAll('auditor');

  // Add initial test notifications for each role
  
  // REGISTRAR - 2 notifications
  notificationService.addNotification('registrar', 'incoming_call', {
    appealId: '12345',
    metadata: { appealId: '12345' }
  });
  
  notificationService.addNotification('registrar', 'new_written_appeal', {
    appealId: '12346',
    metadata: { appealId: '12346' }
  });

  // RESPONSIBLE - 2 notifications
  notificationService.addNotification('responsible', 'new_appeal_assigned', {
    appealId: '12347',
    metadata: { appealId: '12347', category: 'Кредиты' }
  });
  
  notificationService.addNotification('responsible', 'deadline_approaching_1day', {
    appealId: '12348',
    metadata: { appealId: '12348' }
  });

  // MANAGER - 2 notifications
  notificationService.addNotification('manager', 'sla_violation_critical', {
    metadata: { department: 'Отдел розничных продуктов', violationCount: 3 }
  });
  
  notificationService.addNotification('manager', 'regulator_appeal_attention', {
    appealId: '12349',
    metadata: { appealId: '12349', regulator: 'ЦБ РФ' }
  });

  // AUDITOR - 4 notifications with proper appealId
  notificationService.addNotification('auditor', 'new_audit_task', {
    appealId: '347823',
    metadata: { appealId: '347823' }
  });
  
  notificationService.addNotification('auditor', 'new_audit_task', {
    appealId: '347856',
    metadata: { appealId: '347856' }
  });

  notificationService.addNotification('auditor', 'new_appeal_for_audit', {
    appealId: '347890',
    metadata: { appealId: '347890' }
  });
  
  notificationService.addNotification('auditor', 'appeal_waiting_2hours', {
    appealId: '347901',
    metadata: { appealId: '347901' }
  });

  // SECRETARY - 2 notifications
  notificationService.addNotification('secretary', 'new_commission_request', {
    appealId: '12352',
    metadata: { appealId: '12352' }
  });
  
  notificationService.addNotification('secretary', 'decision_ready_for_signing', {
    appealId: '12353',
    metadata: { appealId: '12353' }
  });
  
  // Mark as initialized
  localStorage.setItem(INIT_KEY, 'true');
}
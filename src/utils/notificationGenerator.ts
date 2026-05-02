import { notificationService } from '../services/notificationService';

// Generate random notification for testing
export function generateRandomNotification() {
  const types: ('письменное' | 'звонок')[] = ['письменное', 'звонок'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  
  return notificationService.addNotification(randomType);
}

// Start automatic notification generation (for demo purposes)
export function startNotificationSimulator(intervalMs: number = 30000) {
  const interval = setInterval(() => {
    // Random chance (30%) to generate notification
    if (Math.random() < 0.3) {
      generateRandomNotification();
    }
  }, intervalMs);

  return () => clearInterval(interval);
}

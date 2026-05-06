// Service for managing appeals in LocalStorage

export interface Appeal {
  id: string;
  regDate: string;
  category: string;
  subcategory?: string;
  status: string;
  deadline: string;
  responsible: string;
  applicantName: string;
  organizationName: string;
  address: string;
  cbs: string;
  type: 'Физ лицо' | 'Юр лицо' | 'Физлицо' | 'Юрлицо';
  isMine: boolean;
  content: string;
  solution: string;
  response: string;
  phone?: string;
  email?: string;
  /** ИНН юрлица — уходит в POST /appeals при наличии */
  inn?: string;
  appealType?: 'Устное' | 'Письменное' | 'Регулятор';
  createdBy?: string;
  updatedAt?: string;
}

const STORAGE_KEY = 'edo_appeals';

class AppealStorageService {
  // Get all appeals
  getAllAppeals(): Appeal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const appeals = data ? JSON.parse(data) : [];
      
      // Миграция данных: исправляем некорректные типы заявителей
      let needsSave = false;
      const migratedAppeals = appeals.map((appeal: any) => {
        if (appeal.type === 'Регулятор' || appeal.type === 'регулятор') {
          // Если тип заявителя был "Регулятор", меняем на "Юр лицо"
          // так как регуляторные обращения обычно от юридических лиц
          console.warn(`Migrating appeal ${appeal.id}: changing type from "${appeal.type}" to "Юр лицо"`);
          needsSave = true;
          return { ...appeal, type: 'Юр лицо' };
        }
        return appeal;
      });
      
      // Сохраняем исправленные данные обратно в localStorage
      if (needsSave) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedAppeals));
      }
      
      return migratedAppeals;
    } catch (error) {
      console.error('Error reading appeals from localStorage:', error);
      return [];
    }
  }

  // Get appeal by ID
  getAppealById(id: string): Appeal | undefined {
    const appeals = this.getAllAppeals();
    return appeals.find(appeal => appeal.id === id);
  }

  // Save new appeal
  saveAppeal(appeal: Appeal): boolean {
    try {
      const appeals = this.getAllAppeals();
      const existingIndex = appeals.findIndex(a => a.id === appeal.id);
      
      if (existingIndex !== -1) {
        // Update existing appeal
        appeals[existingIndex] = {
          ...appeal,
          updatedAt: new Date().toISOString()
        };
      } else {
        // Add new appeal
        appeals.push({
          ...appeal,
          updatedAt: new Date().toISOString()
        });
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appeals));
      return true;
    } catch (error) {
      console.error('Error saving appeal to localStorage:', error);
      return false;
    }
  }

  // Update appeal
  updateAppeal(id: string, updates: Partial<Appeal>): boolean {
    try {
      const appeals = this.getAllAppeals();
      const index = appeals.findIndex(a => a.id === id);
      
      if (index !== -1) {
        appeals[index] = {
          ...appeals[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appeals));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating appeal:', error);
      return false;
    }
  }

  // Delete appeal
  deleteAppeal(id: string): boolean {
    try {
      const appeals = this.getAllAppeals();
      const filtered = appeals.filter(a => a.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting appeal:', error);
      return false;
    }
  }

  // Generate unique ID
  generateId(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return timestamp.slice(-6) + random;
  }

  // Clear all appeals (for testing)
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  // Get appeals count
  getAppealsCount(): number {
    return this.getAllAppeals().length;
  }

  // Get appeals by responsible person
  getAppealsByResponsible(responsible: string): Appeal[] {
    const appeals = this.getAllAppeals();
    return appeals.filter(a => a.responsible === responsible);
  }

  // Get my appeals (isMine = true)
  getMyAppeals(): Appeal[] {
    const appeals = this.getAllAppeals();
    return appeals.filter(a => a.isMine === true);
  }

  // Get appeals by type
  getAppealsByType(type: string): Appeal[] {
    if (type === 'Все обращения') {
      return this.getAllAppeals();
    }
    const appeals = this.getAllAppeals();
    return appeals.filter(a => a.type === type);
  }

  // Search appeals
  searchAppeals(query: string): Appeal[] {
    const appeals = this.getAllAppeals();
    const lowerQuery = query.toLowerCase();
    
    return appeals.filter(appeal => 
      appeal.id.toLowerCase().includes(lowerQuery) ||
      appeal.applicantName.toLowerCase().includes(lowerQuery) ||
      appeal.organizationName.toLowerCase().includes(lowerQuery) ||
      appeal.content.toLowerCase().includes(lowerQuery) ||
      appeal.status.toLowerCase().includes(lowerQuery)
    );
  }

  // Calculate deadline in days
  calculateDeadlineDays(deadlineStr: string): number {
    try {
      const [day, month, year] = deadlineStr.split('/');
      const deadline = new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day));
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    } catch {
      return 0;
    }
  }
}

export const appealStorage = new AppealStorageService();
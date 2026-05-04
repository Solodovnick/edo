import { Bell, User, Plus, ClipboardCheck, CheckCircle, Shield, Archive, XCircle, Briefcase, FileEdit } from 'lucide-react';
import { NotificationBell } from './notifications/NotificationBell';
import { UserRole } from '../../services/notificationService';
import type { ApiDbStatus } from '../../services/apiHealth';

interface HeaderProps {
  activeTab: string | null;
  onTabChange: (tab: string) => void;
  slaViolations: number;
  onLogoClick: () => void;
  onNotificationClick?: (appealId: string) => void;
  /** Состояние API + PostgreSQL (`/api/health`) */
  dbApiStatus?: ApiDbStatus;
}

export function Header({ activeTab, onTabChange, slaViolations, onLogoClick, onNotificationClick, dbApiStatus }: HeaderProps) {
  // Map activeTab to UserRole
  const getRoleFromTab = (tab: string | null): UserRole => {
    switch (tab) {
      case 'start':
        return 'registrar'; // Для старта используем registrar
      case 'create':
        return 'registrar';
      case 'process':
        return 'responsible';
      case 'secretary':
        return 'secretary';
      case 'manager':
        return 'manager';
      case 'audit':
        return 'auditor';
      default:
        return 'registrar';
    }
  };

  const currentRole = getRoleFromTab(activeTab);

  const workflowTabs = [
    { id: 'create', line1: 'Регистратор', line2: null, icon: Plus },
    { id: 'process', line1: 'Ответственный', line2: null, icon: ClipboardCheck },
    { id: 'secretary', line1: 'Секретарь', line2: null, icon: FileEdit },
    { id: 'manager', line1: 'Руководитель', line2: null, icon: Briefcase },
    { id: 'audit', line1: 'Аудит', line2: null, icon: Shield },
  ];

  return (
    <header className="h-[60px] bg-white border-b border-gray-200 flex items-center px-6 gap-4">
      {/* Логотип */}
      <button 
        onClick={onLogoClick}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <div className="w-10 h-10 bg-[#0051BA] rounded flex items-center justify-center">
          <span className="text-white font-bold text-lg">Б</span>
        </div>
        <span className="font-bold text-lg text-gray-800">ЭДО Банк</span>
      </button>

      {/* Вкладки жизненного цикла */}
      <nav className="flex min-w-0 gap-2 overflow-x-auto py-0.5 [scrollbar-width:thin]">
        {workflowTabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          // Единый фиолетовый цвет для всех вкладок
          const activeColor = '#673AB7';
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              type="button"
              className={`flex shrink-0 items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                isActive
                  ? 'text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
              style={isActive ? { backgroundColor: activeColor } : {}}
            >
              <IconComponent className="w-4 h-4 flex-shrink-0" />
              <div className="flex flex-col items-start leading-tight">
                <span>{tab.line1}</span>
                {tab.line2 && <span>{tab.line2}</span>}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Иконки справа */}
      <div className="flex items-center gap-4">
        {dbApiStatus && (
          <span
            className="flex items-center gap-1.5 text-[11px] text-gray-500 max-sm:hidden"
            title="Состояние API и PostgreSQL"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                dbApiStatus === "online"
                  ? "bg-emerald-500"
                  : dbApiStatus === "loading"
                    ? "bg-amber-400 animate-pulse"
                    : "bg-red-500"
              }`}
            />
            <span className="whitespace-nowrap">
              {dbApiStatus === "online"
                ? "PostgreSQL"
                : dbApiStatus === "loading"
                  ? "БД…"
                  : "БД offline"}
            </span>
          </span>
        )}
        <NotificationBell variant="header" role={currentRole} onNotificationClick={onNotificationClick} />
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <User className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </header>
  );
}
import { Settings, Users, FileText, Clock, Tag, Mail, Bell, Shield } from 'lucide-react';

interface AdministrationSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AdministrationSidebar({ activeSection, onSectionChange }: AdministrationSidebarProps) {
  const sections = [
    { id: 'routing', label: 'Маршруты и правила', icon: Settings },
    { id: 'users', label: 'Пользователи и роли', icon: Users },
    { id: 'templates', label: 'Шаблоны ответов', icon: FileText },
    { id: 'sla', label: 'SLA Правила', icon: Clock },
    { id: 'categories', label: 'Категории обращений', icon: Tag },
    { id: 'email', label: 'Email интеграция', icon: Mail },
    { id: 'notifications', label: 'Уведомления и алерты', icon: Bell },
    { id: 'audit', label: 'Логирование и аудит', icon: Shield },
  ];

  return (
    <aside className="w-[240px] bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
          Разделы
        </h3>
        <div className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === section.id
                    ? 'bg-[#0051BA] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-left flex-1">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

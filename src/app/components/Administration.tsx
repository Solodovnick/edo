import { useState } from 'react';
import { AdministrationSidebar } from './AdministrationSidebar';
import { RoutingRules } from './admin/RoutingRules';
import { UsersAndRoles } from './admin/UsersAndRoles';
import { SLARules } from './admin/SLARules';
import { EmailIntegration } from './admin/EmailIntegration';
import { AuditLog } from './admin/AuditLog';

export function Administration() {
  const [activeSection, setActiveSection] = useState('routing');

  const renderSection = () => {
    switch (activeSection) {
      case 'routing':
        return <RoutingRules />;
      case 'users':
        return <UsersAndRoles />;
      case 'sla':
        return <SLARules />;
      case 'email':
        return <EmailIntegration />;
      case 'audit':
        return <AuditLog />;
      case 'templates':
      case 'categories':
      case 'notifications':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Раздел в разработке
              </h2>
              <p className="text-gray-600">
                Этот раздел находится в процессе разработки
              </p>
            </div>
          </div>
        );
      default:
        return <RoutingRules />;
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <AdministrationSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      {renderSection()}
    </div>
  );
}
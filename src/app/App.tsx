import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Applications } from './components/Applications';
import { Analytics } from './components/Analytics';
import { Administration } from './components/Administration';
import { Help } from './components/Help';
import { StartPage } from './components/StartPage';
import {
  RegistrationPage,
  ProcessingPage,
  SecretaryOfficePage,
  AuditPage,
  ManagerCabinetPage,
  ArchivePage,
} from './components/lifecycle';
import { ApiDocsPage } from './components/ApiDocsPage';
import { initializeTestNotifications } from '../utils/initializeNotifications';
import { fetchApiHealth, type ApiDbStatus } from '../services/apiHealth';

export default function App() {
  const [activeTab, setActiveTab] = useState('create');
  const [activeNavTab, setActiveNavTab] = useState<string | null>('create');
  const [pendingAppealId, setPendingAppealId] = useState<string | null>(null);
  const [dbApiStatus, setDbApiStatus] = useState<ApiDbStatus>('loading');

  // Initialize test notifications on first load
  useEffect(() => {
    initializeTestNotifications();
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchApiHealth().then(({ status }) => {
      if (!cancelled) setDbApiStatus(status);
    });
    const id = window.setInterval(() => {
      fetchApiHealth().then(({ status }) => {
        if (!cancelled) setDbApiStatus(status);
      });
    }, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const slaViolations = 2;

  const handleTabChange = (tab: string) => {
    const workflowTabs = ['start', 'create', 'process', 'secretary', 'manager', 'audit', 'archive', 'api-docs'];
    
    if (workflowTabs.includes(tab)) {
      setActiveTab(tab);
      setActiveNavTab(tab);
      return;
    }

    setActiveNavTab(tab);
    if (tab === 'Обращения') {
      setActiveTab('applications');
    } else if (tab === 'Аналитика') {
      setActiveTab('analytics');
    } else if (tab === 'Администрирование') {
      setActiveTab('administration');
    } else if (tab === 'Справка') {
      setActiveTab('help');
    }
  };

  const handleLogoClick = () => {
    setActiveTab('create');
    setActiveNavTab('create');
  };

  const handleNotificationClick = (appealId: string) => {
    console.log('[App] Notification clicked for appeal:', appealId);
    setActiveTab('audit');
    setActiveNavTab('audit');
    setPendingAppealId(appealId);
  };

  // Effect to open appeal when AuditPage is mounted and pendingAppealId is set
  useEffect(() => {
    if (activeTab === 'audit' && pendingAppealId) {
      console.log('[App] Attempting to open appeal:', pendingAppealId);
      const timer = setTimeout(() => {
        const auditPageHandler = (window as any).__auditPageOpenAppeal;
        if (auditPageHandler) {
          console.log('[App] Opening appeal with handler:', pendingAppealId);
          auditPageHandler(pendingAppealId);
          setPendingAppealId(null);
        } else {
          console.warn('[App] No audit page handler found');
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [activeTab, pendingAppealId]);

  const renderContent = () => {
    switch (activeTab) {
      case 'start':
        return <StartPage />;
      case 'create':
        return <RegistrationPage />;
      case 'process':
        return <ProcessingPage />;
      case 'secretary':
        return <SecretaryOfficePage />;
      case 'audit':
        return <AuditPage />;
      case 'archive':
        return <ArchivePage />;
      case 'api-docs':
        return <ApiDocsPage />;
      case 'manager':
        return <ManagerCabinetPage />;
      case 'applications':
        return <Applications />;
      case 'analytics':
        return <Analytics />;
      case 'administration':
        return <Administration />;
      case 'help':
        return <Help />;
      default:
        return <RegistrationPage />;
    }
  };

  return (
    <div className="flex flex-col">
      <Header
        activeTab={activeNavTab}
        onTabChange={handleTabChange}
        slaViolations={slaViolations}
        onLogoClick={handleLogoClick}
        onNotificationClick={handleNotificationClick}
        dbApiStatus={dbApiStatus}
      />
      {renderContent()}
    </div>
  );
}

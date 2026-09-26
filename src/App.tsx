/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { LocationPickerModal } from './components/common/LocationPickerModal';
import { AuthModal } from './components/common/AuthModal';
import { ReportModal } from './components/common/ReportModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { AdminLoginPortalModal } from './components/admin/AdminLoginPortalModal';
import { AdminDedicatedPortalView } from './components/admin/AdminDedicatedPortalView';
import { PlayStorePublishModal } from './components/common/PlayStorePublishModal';
import { PostJobModal } from './components/jobs/PostJobModal';
import { JobDetailModal } from './components/jobs/JobDetailModal';
import { WorkerDetailModal } from './components/workers/WorkerDetailModal';
import { HomeView } from './components/home/HomeView';
import { SearchView } from './components/search/SearchView';
import { ChatView } from './components/chat/ChatView';
import { DashboardView } from './components/dashboard/DashboardView';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    selectedJobForDetail,
    setSelectedJobForDetail,
    selectedWorkerForDetail,
    setSelectedWorkerForDetail,
    isDedicatedAdminPortal,
    isAdminAuthenticated,
  } = useApp();

  // If in Standalone Dedicated Admin Portal mode, render the separate Admin App!
  if (isDedicatedAdminPortal && isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
        <OfflineIndicator />
        <AdminDedicatedPortalView />
        <ReportModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Offline Toast */}
      <OfflineIndicator />

      {/* Header */}
      <Header />

      {/* Main Tab Content */}
      <main className="flex-1 w-full">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'search' && <SearchView />}
        {activeTab === 'chat' && <ChatView />}
        {activeTab === 'dashboard' && <DashboardView />}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Modals */}
      <LocationPickerModal />
      <PostJobModal />
      <AuthModal />
      <ReportModal />
      <AdminLoginPortalModal />
      <AdminDashboardModal />
      <PlayStorePublishModal />

      {/* Detail Modals */}
      {selectedJobForDetail && (
        <JobDetailModal
          job={selectedJobForDetail}
          onClose={() => setSelectedJobForDetail(null)}
        />
      )}

      {selectedWorkerForDetail && (
        <WorkerDetailModal
          worker={selectedWorkerForDetail}
          onClose={() => setSelectedWorkerForDetail(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

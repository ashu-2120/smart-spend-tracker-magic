
import React, { useEffect } from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import DashboardHome from '@/components/dashboard/DashboardHome';
import DashboardExpenseSummary from '@/components/dashboard/DashboardExpenseSummary';
import DashboardExpenseHistory from '@/components/dashboard/DashboardExpenseHistory';
import DashboardExpenseAnalyser from '@/components/dashboard/DashboardExpenseAnalyser';
import DashboardProfile from '@/components/dashboard/DashboardProfile';
import DashboardSettings from '@/components/dashboard/DashboardSettings';
import DashboardInviteFriends from '@/components/dashboard/DashboardInviteFriends';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      
      {/* Main content with top padding for fixed navbar */}
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/expense-summary" element={<DashboardExpenseSummary />} />
          <Route path="/expense-history" element={<DashboardExpenseHistory />} />
          <Route path="/expense-analyser" element={<DashboardExpenseAnalyser />} />
          <Route path="/profile" element={<DashboardProfile />} />
          <Route path="/settings" element={<DashboardSettings />} />
          <Route path="/invite-friends" element={<DashboardInviteFriends />} />
          {/* Legacy redirects for old paths */}
          <Route path="/spends" element={<Navigate to="/dashboard/expense-summary" replace />} />
          <Route path="/analyse" element={<Navigate to="/dashboard/expense-analyser" replace />} />
          {/* Redirect /dashboard to /dashboard/ */}
          <Route path="*" element={<Navigate to="/dashboard/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;

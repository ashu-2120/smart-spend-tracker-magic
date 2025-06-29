
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import DashboardHome from '@/components/dashboard/DashboardHome';
import DashboardSpends from '@/components/dashboard/DashboardSpends';
import DashboardAnalyse from '@/components/dashboard/DashboardAnalyse';
import AuthGuard from '@/components/AuthGuard';

const Dashboard = () => {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
        <DashboardNavbar />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/spends" element={<DashboardSpends />} />
            <Route path="/analyse" element={<DashboardAnalyse />} />
          </Routes>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Dashboard;

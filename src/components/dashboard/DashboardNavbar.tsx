
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plus, Home, DollarSign, BarChart3, Menu, X, History } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AddExpenseModal from './AddExpenseModal';
import ProfileAvatar from './ProfileAvatar';

const DashboardNavbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/dashboard' || path === '/dashboard/') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/dashboard/expense-summary', icon: DollarSign, label: 'Expense Summary' },
    { path: '/dashboard/expense-history', icon: History, label: 'Expense History' },
    { path: '/dashboard/expense-analyser', icon: BarChart3, label: 'Expense Analyser' },
  ];

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/dashboard" className="text-xl font-bold text-green-600">
                ExpenseTracker
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                onClick={() => setShowAddExpenseModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
              
              <ProfileAvatar />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-green-600 bg-green-50'
                        : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => {
                      setShowAddExpenseModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white mb-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expense
                  </Button>
                  
                  <div className="flex items-center justify-between px-3">
                    <span className="text-sm text-gray-700">
                      {user?.email}
                    </span>
                    <ProfileAvatar />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <AddExpenseModal
        open={showAddExpenseModal}
        onOpenChange={setShowAddExpenseModal}
      />
    </>
  );
};

export default DashboardNavbar;


import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, X, User, Settings, LogOut, Plus, Upload, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation as useLocationContext } from "@/contexts/LocationContext";
import { Link, useLocation } from "react-router-dom";
import AddExpenseModal from "./AddExpenseModal";

const DashboardNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { selectedCountry, countries, setSelectedCountry } = useLocationContext();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/dashboard">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Fintrack
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                to="/dashboard"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/dashboard') && location.pathname === '/dashboard'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Home
              </Link>
              <Link
                to="/dashboard/spends"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/dashboard/spends')
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Spends
              </Link>
              <Link
                to="/dashboard/analyse"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/dashboard/analyse')
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Analyse
              </Link>
            </div>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              {/* Location Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                    <MapPin className="h-4 w-4 mr-2" />
                    {selectedCountry.code} ({selectedCountry.symbol})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 max-h-64 overflow-y-auto">
                  {countries.map((country) => (
                    <DropdownMenuItem
                      key={country.code}
                      onClick={() => setSelectedCountry(country)}
                      className={`cursor-pointer ${
                        selectedCountry.code === country.code ? 'bg-green-50 text-green-700' : ''
                      }`}
                    >
                      <div className="flex justify-between w-full">
                        <span>{country.name}</span>
                        <span className="text-sm text-gray-500">{country.symbol}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={() => setIsAddExpenseOpen(true)}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
              <Button
                variant="outline"
                className="border-green-200 text-green-700 hover:bg-green-50"
                size="sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Receipt
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt="User avatar" />
                      <AvatarFallback className="bg-green-100 text-green-700">
                        {user?.email?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{user?.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Dashboard
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-green-100">
              <Link
                to="/dashboard"
                className={`block px-3 py-2 text-base font-medium ${
                  isActive('/dashboard') && location.pathname === '/dashboard'
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-700 hover:text-green-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/dashboard/spends"
                className={`block px-3 py-2 text-base font-medium ${
                  isActive('/dashboard/spends')
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-700 hover:text-green-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Spends
              </Link>
              <Link
                to="/dashboard/analyse"
                className={`block px-3 py-2 text-base font-medium ${
                  isActive('/dashboard/analyse')
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-700 hover:text-green-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Analyse
              </Link>
              
              <div className="pt-4 pb-3 border-t border-green-100">
                {/* Mobile Location Selector */}
                <div className="px-3 mb-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-start border-green-200 text-green-700 hover:bg-green-50">
                        <MapPin className="mr-2 h-4 w-4" />
                        {selectedCountry.name} ({selectedCountry.symbol})
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 max-h-64 overflow-y-auto">
                      {countries.map((country) => (
                        <DropdownMenuItem
                          key={country.code}
                          onClick={() => setSelectedCountry(country)}
                          className={`cursor-pointer ${
                            selectedCountry.code === country.code ? 'bg-green-50 text-green-700' : ''
                          }`}
                        >
                          <div className="flex justify-between w-full">
                            <span>{country.name}</span>
                            <span className="text-sm text-gray-500">{country.symbol}</span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center px-3 mb-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-green-100 text-green-700 text-sm">
                      {user?.email?.charAt(0).toUpperCase() || <User className="h-3 w-3" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      setIsAddExpenseOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Expense
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-green-200 text-green-700 hover:bg-green-50"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Receipt
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to="/profile">
                      <Settings className="mr-2 h-4 w-4" />
                      Profile Settings
                    </Link>
                  </Button>
                  <Button onClick={signOut} variant="outline" className="w-full justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AddExpenseModal 
        open={isAddExpenseOpen} 
        onOpenChange={setIsAddExpenseOpen}
      />
    </nav>
  );
};

export default DashboardNavbar;

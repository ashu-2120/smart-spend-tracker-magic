
import React, { createContext, useContext, useEffect, useState } from 'react';

interface Country {
  code: string;
  name: string;
  currency: string;
  symbol: string;
}

interface LocationContextType {
  selectedCountry: Country;
  countries: Country[];
  setSelectedCountry: (country: Country) => void;
  formatCurrency: (amount: number) => string;
}

const countries: Country[] = [
  { code: 'US', name: 'United States', currency: 'USD', symbol: '$' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', symbol: '£' },
  { code: 'IN', name: 'India', currency: 'INR', symbol: '₹' },
  { code: 'DE', name: 'Germany', currency: 'EUR', symbol: '€' },
  { code: 'FR', name: 'France', currency: 'EUR', symbol: '€' },
  { code: 'JP', name: 'Japan', currency: 'JPY', symbol: '¥' },
  { code: 'AU', name: 'Australia', currency: 'AUD', symbol: 'A$' },
  { code: 'CA', name: 'Canada', currency: 'CAD', symbol: 'C$' },
  { code: 'CN', name: 'China', currency: 'CNY', symbol: '¥' },
  { code: 'BR', name: 'Brazil', currency: 'BRL', symbol: 'R$' },
  { code: 'MX', name: 'Mexico', currency: 'MXN', symbol: '$' },
  { code: 'KR', name: 'South Korea', currency: 'KRW', symbol: '₩' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', symbol: 'S$' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF', symbol: 'CHF' },
  { code: 'SE', name: 'Sweden', currency: 'SEK', symbol: 'kr' },
];

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCountry, setSelectedCountryState] = useState<Country>(countries[0]); // Default to US

  useEffect(() => {
    // Load saved country from localStorage
    const savedCountry = localStorage.getItem('selectedCountry');
    if (savedCountry) {
      const country = JSON.parse(savedCountry);
      setSelectedCountryState(country);
    }
  }, []);

  const setSelectedCountry = (country: Country) => {
    setSelectedCountryState(country);
    localStorage.setItem('selectedCountry', JSON.stringify(country));
  };

  const formatCurrency = (amount: number): string => {
    return `${selectedCountry.symbol}${amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const value = {
    selectedCountry,
    countries,
    setSelectedCountry,
    formatCurrency,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

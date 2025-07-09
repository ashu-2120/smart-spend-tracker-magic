
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Save, Loader2, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserSettings {
  id: string;
  user_id: string;
  currency: string;
  monthly_budget: number;
  theme: string;
  notifications_enabled: boolean;
  budget_alerts: boolean;
}

const DashboardSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      // Use the custom function to get user settings
      const { data, error } = await supabase.rpc('get_user_settings', { 
        user_uuid: user?.id 
      });

      if (error) throw error;

      if (data && data.length > 0) {
        setSettings(data[0] as UserSettings);
      } else {
        // Create default settings if they don't exist
        const { data: newSettings, error: createError } = await supabase.rpc('upsert_user_settings', {
          user_uuid: user?.id
        });
        
        if (createError) throw createError;
        
        if (newSettings && newSettings.length > 0) {
          setSettings({
            ...newSettings[0],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as UserSettings);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      
      // Create default settings if fetch fails
      const defaultSettings: UserSettings = {
        id: crypto.randomUUID(),
        user_id: user?.id || '',
        currency: 'USD',
        monthly_budget: 0,
        theme: 'light',
        notifications_enabled: true,
        budget_alerts: true
      };
      setSettings(defaultSettings);
      
      toast({
        title: "Info",
        description: "Using default settings. Save to persist your preferences.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings || !user) return;

    setSaving(true);
    try {
      // Use the custom function to save user settings
      const { data, error } = await supabase.rpc('upsert_user_settings', {
        user_uuid: user.id,
        p_currency: settings.currency,
        p_monthly_budget: settings.monthly_budget,
        p_theme: settings.theme,
        p_notifications_enabled: settings.notifications_enabled,
        p_budget_alerts: settings.budget_alerts
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      setIsPasswordModalOpen(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Settings not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Financial Preferences</CardTitle>
          <CardDescription>Configure your financial settings and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select
                value={settings.currency}
                onValueChange={(value) => setSettings({ ...settings, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                  <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget">Monthly Budget</Label>
              <Input
                id="budget"
                type="number"
                value={settings.monthly_budget}
                onChange={(e) => setSettings({ ...settings, monthly_budget: parseFloat(e.target.value) || 0 })}
                placeholder="Enter your monthly budget"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={settings.theme}
              onValueChange={(value) => setSettings({ ...settings, theme: value })}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Enable Notifications</Label>
              <p className="text-sm text-gray-500">Receive general notifications about your expenses</p>
            </div>
            <Switch
              id="notifications"
              checked={settings.notifications_enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, notifications_enabled: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="budget-alerts">Budget Alerts</Label>
              <p className="text-sm text-gray-500">Get notified when approaching your monthly budget limit</p>
            </div>
            <Switch
              id="budget-alerts"
              checked={settings.budget_alerts}
              onCheckedChange={(checked) => setSettings({ ...settings, budget_alerts: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Manage your account security settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Key className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>
                  Enter your new password below. Make sure it's at least 6 characters long.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsPasswordModalOpen(false)}
                    disabled={updatingPassword}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePasswordUpdate}
                    disabled={updatingPassword}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {updatingPassword ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DashboardSettings;

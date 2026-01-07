'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { useToast } from '@/lib/context/ToastContext';
import * as adminApi from '@/lib/api/admin';

export const SystemSettingsForm: React.FC = () => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    MAX_WITHDRAWALS_PER_DAY: '3',
    MAX_WITHDRAWAL_VOLUME_PER_DAY: '500000',
    REFERRAL_THRESHOLD_USD: '300',
    REFERRAL_REWARD_NGN: '5000',
    MAINTENANCE_MODE: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await adminApi.getSystemSettings();
      setSettings({
        MAX_WITHDRAWALS_PER_DAY: data.MAX_WITHDRAWALS_PER_DAY?.toString() || '3',
        MAX_WITHDRAWAL_VOLUME_PER_DAY: data.MAX_WITHDRAWAL_VOLUME_PER_DAY?.toString() || '500000',
        REFERRAL_THRESHOLD_USD: data.REFERRAL_THRESHOLD_USD?.toString() || '300',
        REFERRAL_REWARD_NGN: data.REFERRAL_REWARD_NGN?.toString() || '5000',
        MAINTENANCE_MODE: data.MAINTENANCE_MODE === 'true' || data.MAINTENANCE_MODE === true,
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await adminApi.updateSystemSettings({
        MAX_WITHDRAWALS_PER_DAY: parseInt(settings.MAX_WITHDRAWALS_PER_DAY),
        MAX_WITHDRAWAL_VOLUME_PER_DAY: parseFloat(settings.MAX_WITHDRAWAL_VOLUME_PER_DAY),
        REFERRAL_THRESHOLD_USD: parseFloat(settings.REFERRAL_THRESHOLD_USD),
        REFERRAL_REWARD_NGN: parseFloat(settings.REFERRAL_REWARD_NGN),
        MAINTENANCE_MODE: settings.MAINTENANCE_MODE,
      });

      showToast('Settings updated successfully!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to update settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Card className="animate-pulse"><div className="h-64 bg-secondary-gray-200 rounded"></div></Card>;
  }

  return (
    <Card>
      <h2 className="text-2xl font-semibold mb-6">System Settings</h2>
      
      <div className="space-y-6">
        {/* Withdrawal Limits */}
        <div>
          <h3 className="text-lg font-medium mb-4">Withdrawal Limits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Max Withdrawals Per Day"
              type="number"
              value={settings.MAX_WITHDRAWALS_PER_DAY}
              onChange={(e) =>
                setSettings({ ...settings, MAX_WITHDRAWALS_PER_DAY: e.target.value })
              }
              min="1"
              helperText="Maximum number of withdrawal requests per user per day"
            />
            <Input
              label="Max Withdrawal Volume Per Day (NGN)"
              type="number"
              value={settings.MAX_WITHDRAWAL_VOLUME_PER_DAY}
              onChange={(e) =>
                setSettings({ ...settings, MAX_WITHDRAWAL_VOLUME_PER_DAY: e.target.value })
              }
              min="0"
              step="1000"
              helperText="Maximum total withdrawal amount per user per day"
            />
          </div>
        </div>

        {/* Referral Settings */}
        <div>
          <h3 className="text-lg font-medium mb-4">Referral Program</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Referral Threshold (USD)"
              type="number"
              value={settings.REFERRAL_THRESHOLD_USD}
              onChange={(e) =>
                setSettings({ ...settings, REFERRAL_THRESHOLD_USD: e.target.value })
              }
              min="0"
              step="1"
              helperText="USD value referred user must trade to trigger reward"
            />
            <Input
              label="Referral Reward (NGN)"
              type="number"
              value={settings.REFERRAL_REWARD_NGN}
              onChange={(e) =>
                setSettings({ ...settings, REFERRAL_REWARD_NGN: e.target.value })
              }
              min="0"
              step="100"
              helperText="Amount credited to referrer when threshold is met"
            />
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="border-t border-secondary-gray-200 pt-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={settings.MAINTENANCE_MODE}
              onChange={(e) =>
                setSettings({ ...settings, MAINTENANCE_MODE: e.target.checked })
              }
              className="w-4 h-4 text-primary rounded focus:ring-primary"
            />
            <label htmlFor="maintenanceMode" className="text-sm font-medium text-secondary-gray-700">
              Enable Maintenance Mode
            </label>
          </div>
          <p className="text-sm text-secondary-gray-500 mt-2">
            When enabled, new user submissions are blocked. Existing transactions can still be processed.
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={isSaving}
            size="lg"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </Card>
  );
};
import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  CreditCard,
  Bell,
  Save,
  Lock
} from 'lucide-react';
import OrgLayout from '../../components/organization/OrgLayout';
import { useToast } from '../../components/common/Toast';

export default function Settings() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('general');

  const [settings, setSettings] = useState({
    autoApproveEnrollments: true,
    emailAlerts: true,
    royaltyAlerts: true,
    weeklyDigest: false,
    requireTwoFactor: true,
    defaultCurrency: 'USD',
    defaultAccessType: 'Paid Masterclass'
  });

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Organization policy & configuration settings saved!', 'success');
  };

  return (
    <OrgLayout breadcrumbs={[{ label: 'Organization Settings' }]}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Organization Governance & Configuration</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Manage institutional access controls, automated enrollment rules, and gateway configurations.
          </p>
        </div>

        <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
          {[
            { id: 'general', label: 'General Policy', icon: SettingsIcon },
            { id: 'security', label: 'Security & 2FA', icon: Lock },
            { id: 'billing', label: 'Gateway Settlement', icon: CreditCard },
            { id: 'notifications', label: 'Notification Channels', icon: Bell }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#255ea6] text-white shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSave} className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 md:p-8 shadow-elevation-1 space-y-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-on-surface pb-3 border-b border-outline-variant">
                Academic & Enrollment Policies
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60">
                  <div>
                    <h3 className="font-bold text-xs text-on-surface">Instant Seat Auto-Provisioning</h3>
                    <p className="text-[11px] text-outline">Automatically unlock course tracks upon valid transaction authorization</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoApproveEnrollments}
                    onChange={(e) => setSettings({ ...settings, autoApproveEnrollments: e.target.checked })}
                    className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1.5">Default Tuition Currency</label>
                    <select
                      value={settings.defaultCurrency}
                      onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
                    >
                      <option value="USD">USD ($ - United States Dollar)</option>
                      <option value="EUR">EUR (€ - Euro)</option>
                      <option value="GBP">GBP (£ - British Pound)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1.5">Default Course Access Model</label>
                    <select
                      value={settings.defaultAccessType}
                      onChange={(e) => setSettings({ ...settings, defaultAccessType: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
                    >
                      <option>Paid Masterclass (One-time)</option>
                      <option>Institutional Cohort License</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-on-surface pb-3 border-b border-outline-variant">
                Authentication Controls
              </h2>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60">
                <div>
                  <h3 className="font-bold text-xs text-on-surface">Mandatory Faculty 2FA</h3>
                  <p className="text-[11px] text-outline">Enforce hardware key or TOTP code verification</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.requireTwoFactor}
                  onChange={(e) => setSettings({ ...settings, requireTwoFactor: e.target.checked })}
                  className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-on-surface pb-3 border-b border-outline-variant">
                NexusPay Gateway Settlement
              </h2>
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-2">
                <p className="text-xs font-bold text-on-surface">Primary Settlement Destination</p>
                <p className="text-xs text-outline font-mono">Chase Commercial Checking •••• 9812 (USD)</p>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-on-surface pb-3 border-b border-outline-variant">
                Broadcast Channels
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-low">
                  <span className="text-xs font-semibold text-on-surface">Email Administrative Alerts</span>
                  <input
                    type="checkbox"
                    checked={settings.emailAlerts}
                    onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })}
                    className="w-4 h-4 rounded text-primary"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant/60">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#255ea6] hover:bg-[#356ea8] text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </OrgLayout>
  );
}

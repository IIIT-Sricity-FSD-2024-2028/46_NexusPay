import React, { useState } from 'react';
import {
  Building2,
  Mail,
  MapPin,
  Globe,
  ShieldCheck,
  Upload,
  Save
} from 'lucide-react';
import OrgLayout from '../../components/organization/OrgLayout';
import { orgData } from '../../data/orgData';
import { useToast } from '../../components/common/Toast';

export default function OrgProfile() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({ ...orgData.info });

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast('Organization profile & branding updated successfully!', 'success');
  };

  return (
    <OrgLayout breadcrumbs={[{ label: 'Organization Profile' }]}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 md:p-8 shadow-elevation-1 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#255ea6] to-[#4585d8] text-white flex items-center justify-center font-black text-3xl shadow-elevation-2 flex-shrink-0">
            <Building2 className="w-12 h-12" />
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <h1 className="text-xl md:text-2xl font-bold text-on-surface">{formData.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{formData.status}</span>
              </span>
            </div>
            <p className="text-xs text-on-surface-variant max-w-xl">{formData.tagline}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-outline pt-1">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {formData.location}</span>
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {formData.email}</span>
              <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {formData.website}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 md:p-8 shadow-elevation-1 space-y-6">
          <h2 className="text-base font-bold text-on-surface pb-3 border-b border-outline-variant">
            Organization Identity & Legal Entity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-on-surface block mb-1.5">Organization Legal Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface block mb-1.5">Official Administrative Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface block mb-1.5">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface block mb-1.5">Public Portal URL</label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-on-surface block mb-1.5">Registered Physical Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2.5 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#255ea6] hover:bg-[#356ea8] text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </OrgLayout>
  );
}

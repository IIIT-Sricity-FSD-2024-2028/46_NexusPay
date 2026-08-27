import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Plus,
  ChevronRight,
  ShieldCheck,
  Building2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { orgData } from '../../data/orgData';
import { useToast } from '../common/Toast';

export default function OrgTopNav({ breadcrumbs = [], actions }) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadNotifications = orgData.notifications.filter(n => !n.read);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addToast(`Searching organization database for "${searchQuery}"...`, 'info');
      navigate(`/org/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-surface/95 backdrop-blur-md border-b border-outline-variant/60 sticky top-0 z-20 px-6 py-3.5 flex items-center justify-between shadow-ambient">
      
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-medium text-outline">
        <Link to="/org/dashboard" className="hover:text-primary transition-colors flex items-center gap-1.5 font-bold text-on-surface">
          <Building2 className="w-3.5 h-3.5 text-primary" />
          <span>Organization</span>
        </Link>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-outline-variant" />
            {crumb.path ? (
              <Link to={crumb.path} className="hover:text-primary transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-primary font-bold">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Center Search Input */}
      <form onSubmit={handleSearch} className="hidden md:flex items-center relative max-w-md w-full mx-6">
        <Search className="w-4 h-4 text-outline absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          placeholder="Search instructors, courses, students, invoices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs bg-surface-container-low border border-outline-variant/80 rounded-full focus:outline-none focus:border-primary focus:bg-white text-on-surface font-medium transition-all shadow-xs"
        />
      </form>

      {/* Right: Quick Action Buttons & Notifications */}
      <div className="flex items-center gap-3">
        
        {/* Custom Actions (e.g. Add Course, Export CSV) */}
        {actions}

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors relative border border-outline-variant/40"
            title="Organization Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-2xl shadow-elevation-3 border border-outline-variant p-3.5 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
                <span className="font-bold text-xs text-on-surface">Organization Alerts ({unreadNotifications.length})</span>
                <Link
                  to="/org/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] text-primary font-semibold hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="py-2 divide-y divide-outline-variant/40 max-h-64 overflow-y-auto">
                {orgData.notifications.slice(0, 4).map((n) => (
                  <div key={n.id} className="py-2 flex items-start gap-2">
                    <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${n.read ? 'bg-outline-variant' : 'bg-primary'}`} />
                    <div className="flex-1 text-[11px]">
                      <p className="font-bold text-on-surface leading-snug">{n.title}</p>
                      <p className="text-[10px] text-on-surface-variant line-clamp-1 mt-0.5">{n.desc}</p>
                      <p className="text-[9px] text-outline mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Active Organization</span>
        </div>

      </div>

    </header>
  );
}

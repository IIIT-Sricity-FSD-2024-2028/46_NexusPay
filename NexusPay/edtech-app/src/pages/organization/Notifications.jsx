import React, { useState } from 'react';
import { Check } from 'lucide-react';
import OrgLayout from '../../components/organization/OrgLayout';
import { orgData } from '../../data/orgData';
import { useToast } from '../../components/common/Toast';

export default function Notifications() {
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState(orgData.notifications);
  const [filter, setFilter] = useState('All');

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'Unread') return !n.read;
    if (filter !== 'All') return n.category === filter;
    return true;
  });

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('All notifications marked as read', 'info');
  };

  const handleToggleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  return (
    <OrgLayout
      breadcrumbs={[{ label: 'Notifications' }]}
      actions={
        <button
          onClick={handleMarkAllRead}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary text-xs font-bold transition-all border border-outline-variant"
        >
          <Check className="w-4 h-4" />
          <span>Mark All as Read</span>
        </button>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Organization Notifications & Broadcasts</h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Live updates on student enrollments, faculty requests, and system events.
            </p>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {['All', 'Unread', 'Instructor', 'Course', 'Financial', 'System'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  filter === tab
                    ? 'bg-[#255ea6] text-white shadow-xs'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-elevation-1 space-y-3">
          {filteredNotifs.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggleRead(item.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                item.read
                  ? 'bg-surface-container-lowest border-outline-variant/50 hover:bg-surface-container-low/40'
                  : 'bg-primary/5 border-primary/20 ring-1 ring-primary/10 shadow-xs'
              }`}
            >
              <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                item.color === 'green' ? 'bg-emerald-500' :
                item.color === 'amber' ? 'bg-amber-500' :
                item.color === 'red' ? 'bg-red-500' : 'bg-primary'
              }`} />
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <h3 className={`text-xs ${item.read ? 'font-semibold text-on-surface' : 'font-extrabold text-on-surface'}`}>
                    {item.title}
                  </h3>
                  <span className="text-[10px] text-outline">{item.time}</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</p>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-surface-container text-[10px] font-bold text-outline uppercase">
                {item.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </OrgLayout>
  );
}

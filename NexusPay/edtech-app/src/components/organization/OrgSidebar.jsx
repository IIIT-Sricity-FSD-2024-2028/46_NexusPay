import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  UserPlus,
  CreditCard,
  Receipt,
  FileText,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Building2,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowUpRight,
  Mail
} from 'lucide-react';
import { useOrg } from '../../context/OrgContext';
import { useToast } from '../common/Toast';

export default function OrgSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { stats, info } = useOrg();

  const navGroups = [
    {
      group: "Core Administration",
      items: [
        { name: 'Dashboard', path: '/org/dashboard', icon: LayoutDashboard },
        { name: 'Instructors', path: '/org/instructors', icon: GraduationCap },
        { name: 'Course Teaching Requests', path: '/org/instructor-requests', icon: BookOpen, badge: stats.pendingRequests },
        { name: 'Learners', path: '/org/learners', icon: Users },
      ]
    },
    {
      group: "Academic Catalog",
      items: [
        { name: 'Courses', path: '/org/courses', icon: BookOpen },
        { name: 'Enrollments', path: '/org/enrollments', icon: Layers },
        { name: 'Assign Courses', path: '/org/assign-courses', icon: UserPlus },
      ]
    },
    {
      group: "Financials & Analytics",
      items: [
        { name: 'Payments & Revenue', path: '/org/payments', icon: CreditCard },
        { name: 'Transactions', path: '/org/transactions', icon: Receipt },
        { name: 'Reports & Exports', path: '/org/reports', icon: FileText },
        { name: 'Analytics', path: '/org/analytics', icon: BarChart3 },
      ]
    },
    {
      group: "System & Governance",
      items: [
        { name: 'Notifications', path: '/org/notifications', icon: Bell, unread: stats.unreadNotifications },
        { name: 'Organization Settings', path: '/org/settings', icon: Settings },
        { name: 'Org Profile', path: '/org/profile', icon: Building2 },
      ]
    }
  ];

  const isActive = (path) => {
    if (path === '/org/dashboard' && (location.pathname === '/' || location.pathname === '/org' || location.pathname === '/org/dashboard' || location.pathname === '/dashboard')) return true;
    if (path === '/org/courses' && (location.pathname === '/courses' || location.pathname === '/org/courses')) return true;
    if (path === '/org/instructors' && (location.pathname === '/instructors' || location.pathname === '/org/instructors')) return true;
    if (path === '/org/instructor-requests' && (location.pathname === '/instructor-requests' || location.pathname === '/org/instructor-requests')) return true;
    if (path === '/org/learners' && (location.pathname === '/learners' || location.pathname === '/org/learners')) return true;
    if (path === '/org/enrollments' && (location.pathname === '/enrollments' || location.pathname === '/org/enrollments')) return true;
    if (path === '/org/assign-courses' && (location.pathname === '/assign-courses' || location.pathname === '/org/assign-courses')) return true;
    if (path === '/org/payments' && (location.pathname === '/payments' || location.pathname === '/org/payments')) return true;
    if (path === '/org/transactions' && (location.pathname === '/transactions' || location.pathname === '/org/transactions')) return true;
    if (path === '/org/reports' && (location.pathname === '/reports' || location.pathname === '/org/reports')) return true;
    if (path === '/org/analytics' && (location.pathname === '/analytics' || location.pathname === '/org/analytics')) return true;
    if (path === '/org/notifications' && (location.pathname === '/notifications' || location.pathname === '/org/notifications')) return true;
    if (path === '/org/settings' && (location.pathname === '/settings' || location.pathname === '/org/settings')) return true;
    if (path === '/org/profile' && (location.pathname === '/org/profile' || location.pathname === '/profile')) return true;
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-[#0B1E36] text-white flex flex-col justify-between h-screen sticky top-0 flex-shrink-0 z-30 shadow-2xl border-r border-white/10 select-none">
      
      {/* Sidebar Header / Org Brand */}
      <div>
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link to="/org/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#255ea6] to-[#4585d8] flex items-center justify-center text-white font-black text-sm shadow-md group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm tracking-tight text-white leading-none">
                {info.name ? info.name.split(' ')[0] : 'NexusPay'} <span className="text-[#bcd3f2] font-semibold text-xs block mt-0.5">Enterprise Admin</span>
              </h2>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-4 max-h-[calc(100vh-170px)] overflow-y-auto custom-scrollbar">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider px-3 py-1 block">
                {group.group}
              </span>
              {group.items.map((item, idx) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={idx}
                    to={item.path}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      active
                        ? 'bg-[#255ea6] text-white shadow-sm font-bold ring-1 ring-white/20'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-white/70 group-hover:text-white'}`} />
                      <span>{item.name}</span>
                    </div>

                    {/* Numeric Badge (e.g. Pending Invitations) */}
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-400 text-amber-950 rounded-full shadow-xs">
                        {item.badge}
                      </span>
                    )}

                    {/* Unread Alert Dot */}
                    {item.unread !== undefined && item.unread > 0 && (
                      <span className="w-2 h-2 rounded-full bg-red-400 ring-2 ring-[#0B1E36]" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer / Admin Identity */}
      <div className="p-3 border-t border-white/10 bg-white/2">
        <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
              NP
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate leading-none">{info.name || 'NexusPay Academy'}</p>
              <p className="text-[10px] text-white/50 truncate mt-0.5">{info.email || 'admin@nexuspay.edu'}</p>
            </div>
          </div>
          <button
            onClick={() => addToast('Administrative session active & verified.', 'info')}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            title="Account Status"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </aside>
  );
}

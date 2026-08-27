import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
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
  ArrowUpRight
} from 'lucide-react';
import { orgData } from '../../data/orgData';
import { useToast } from '../common/Toast';

export default function OrgSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const navGroups = [
    {
      group: "Core Administration",
      items: [
        { name: 'Dashboard', path: '/org/dashboard', icon: LayoutDashboard },
        { name: 'Instructors', path: '/org/instructors', icon: GraduationCap },
        { name: 'Instructor Requests', path: '/org/instructor-requests', icon: UserCheck, badge: orgData.stats.pendingRequests },
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
      group: "System & Settings",
      items: [
        { name: 'Notifications', path: '/org/notifications', icon: Bell, unread: 3 },
        { name: 'Organization Settings', path: '/org/settings', icon: Settings },
        { name: 'Org Profile', path: '/org/profile', icon: Building2 },
      ]
    }
  ];

  const isActive = (path) => {
    if (path === '/org/dashboard' && (location.pathname === '/org' || location.pathname === '/org/dashboard' || location.pathname === '/organization')) return true;
    return location.pathname === path || (path !== '/org/dashboard' && location.pathname.startsWith(path));
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
                NexusPay <span className="text-[#bcd3f2] font-semibold text-xs block mt-0.5">Enterprise Admin</span>
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
                      <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-white/60 group-hover:text-white'}`} />
                      <span className="truncate">{item.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge !== undefined && (
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-500/30 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                          {item.badge}
                        </span>
                      )}
                      {item.unread !== undefined && (
                        <span className="w-2 h-2 rounded-full bg-[#356ea8]"></span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer User Card */}
      <div className="p-3 border-t border-white/10 bg-black/20">
        <div className="flex items-center justify-between p-2 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-bold text-xs text-white flex-shrink-0 shadow-xs">
              OA
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">Org Admin</p>
              <p className="text-[10px] text-white/50 truncate">admin@nexuspay.edu</p>
            </div>
          </div>

          <button
            onClick={() => {
              addToast('Signed out from Organization Admin session', 'info');
              navigate('/');
            }}
            title="Sign Out"
            className="p-1.5 rounded-xl hover:bg-red-500/20 text-white/60 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

    </aside>
  );
}

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Code, 
  Briefcase, 
  FileText, 
  Sparkles, 
  Settings, 
  LogOut,
  Sparkle,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { authApi } from '../../services/api';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard/analysis', label: 'GitHub Analysis', icon: Code },
  { path: '/dashboard/portfolio', label: 'Portfolio Builder', icon: Briefcase },
  { path: '/dashboard/resume', label: 'Resume Builder', icon: FileText },
  { path: '/dashboard/insights', label: 'AI Insights', icon: Sparkles },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = authApi.getCurrentUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  const handleLogout = () => {
    authApi.logout();
    navigate('/');
  };

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem('sidebar_collapsed', String(nextState));
  };

  // ── Desktop Sidebar ─────────────────────────────────────────────────────────
  const DesktopSidebar = () => (
    <aside className={`hidden lg:flex ${isCollapsed ? 'w-20' : 'w-64'} h-[calc(100vh-2rem)] sticky top-4 left-4 flex-col glass-panel p-4 m-4 select-none shrink-0 transition-all duration-300 ease-in-out`}>
      {/* Brand logo & collapse button */}
      <div className="flex items-center justify-between px-2 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
            <Sparkle className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <span className="font-bold text-lg text-white leading-tight block">Devfolio</span>
              <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">AI Platform</span>
            </div>
          )}
        </div>
        <button
          onClick={toggleCollapse}
          title={isCollapsed ? 'Expand panel' : 'Collapse panel'}
          className={`p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer ${isCollapsed ? 'hidden' : 'block'}`}
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={isCollapsed ? item.label : undefined}
              className={`relative flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-xl text-sm font-medium transition-colors duration-200 group ${
                isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-indicator-desktop"
                  className="absolute inset-0 bg-orange-500/10 border border-orange-500/20 rounded-xl"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className={`w-4 h-4 z-10 transition-transform group-hover:scale-110 ${
                isActive ? 'text-amber-400' : 'text-gray-400 group-hover:text-white'
              }`} />
              {!isCollapsed && <span className="z-10">{item.label}</span>}
            </Link>
          );
        })}
        {isCollapsed && (
          <div className="flex justify-center pt-2">
            <button
              onClick={toggleCollapse}
              title="Expand panel"
              className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-amber-400 hover:bg-orange-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronsRight className="w-4.5 h-4.5 animate-pulse" />
            </button>
          </div>
        )}
      </nav>

      {/* User info & Logout */}
      <div className="border-t border-white/10 pt-4 mt-4 space-y-4">
        {user && (
          <div className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-2'}`}>
            <img
              src={user.avatarUrl}
              alt={user.name}
              title={isCollapsed ? user.name : undefined}
              className="w-9 h-9 rounded-full border border-white/20 shrink-0"
            />
            {!isCollapsed && (
              <div className="overflow-hidden">
                <span className="block text-sm font-semibold text-white truncate">{user.name}</span>
                <span className="block text-[11px] text-gray-400 truncate">@{user.username}</span>
              </div>
            )}
          </div>
        )}
        <button
          onClick={handleLogout}
          title={isCollapsed ? 'Logout' : undefined}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors duration-200`}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
  // ── Mobile Top Bar ──────────────────────────────────────────────────────────
  const MobileTopBar = () => (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/8">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-md shadow-orange-500/20">
          <Sparkle className="w-4 h-4 text-white" />
        </div>
        <div>
          <span className="font-bold text-white text-sm leading-tight">Devfolio</span>
          <span className="text-[9px] text-amber-400 font-semibold tracking-wider uppercase block">AI Platform</span>
        </div>
      </div>

      {/* User + Toggle Button */}
      <div className="flex items-center gap-2">
        {user && (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-7 h-7 rounded-full border border-white/20"
          />
        )}
        <button
          onClick={() => setMobileMenuOpen(prev => !prev)}
          title={mobileMenuOpen ? 'Hide Menu' : 'Show Menu'}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 active:bg-white/10 transition-all cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
  // ── Mobile Slide-over Menu ──────────────────────────────────────────────────
  const MobileDrawerMenu = () => (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer panel */}
          <motion.div
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0E0E0E] border-r border-white/10 flex flex-col p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
                  <Sparkle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-bold text-lg text-white leading-tight block">Devfolio</span>
                  <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">AI Platform</span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                title="Close menu"
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white active:bg-white/10 transition-all cursor-pointer"
              >
                <ChevronsLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 space-y-1.5">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-white bg-orange-500/10 border border-orange-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-amber-400' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User info & logout */}
            <div className="border-t border-white/10 pt-4 mt-4 space-y-4">
              {user && (
                <div className="flex items-center gap-3 px-2">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border border-white/20 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <span className="block text-sm font-semibold text-white truncate">{user.name}</span>
                    <span className="block text-[11px] text-gray-400 truncate">@{user.username}</span>
                  </div>
                </div>
              )}
              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // ── Mobile Bottom Tab Bar ───────────────────────────────────────────────────
  const MobileBottomNav = () => {
    // Show only 5 most-used items in bottom bar
    const bottomItems = menuItems.slice(0, 5);
    return (
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/8 px-2 py-2 safe-area-pb">
        <div className="flex items-center justify-around">
          {bottomItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all active:scale-95"
              >
                <div className={`p-1.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-orange-500/15 text-amber-400'
                    : 'text-gray-500'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[9px] font-semibold truncate max-w-[52px] text-center leading-tight ${
                  isActive ? 'text-amber-400' : 'text-gray-500'
                }`}>
                  {item.label.split(' ')[0]}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <DesktopSidebar />
      <MobileTopBar />
      <MobileDrawerMenu />
      <MobileBottomNav />
    </>
  );
}

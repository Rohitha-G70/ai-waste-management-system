import React from 'react';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  Truck,
  Award,
  Sparkles,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationPanelProps {
  notifications: AppNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onNavigateTab: (tab: string) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkRead,
  onMarkAllRead,
  onClearAll,
  onNavigateTab,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'bin_alert':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'route':
        return <Truck className="w-4 h-4 text-sky-600" />;
      case 'reward':
        return <Award className="w-4 h-4 text-emerald-600" />;
      case 'request':
        return <CheckCircle2 className="w-4 h-4 text-amber-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] mt-16 sm:mt-20">
        {/* Panel Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Bell className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-white flex items-center gap-2">
                <span>System Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.2 rounded-full">
                    {unreadCount} New
                  </span>
                )}
              </h3>
              <p className="text-[10px] text-emerald-200">
                Real-time alerts, logistics updates &amp; rewards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="text-[11px] text-emerald-200 hover:text-white px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                Mark Read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 bg-slate-50/50">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto opacity-40 text-slate-400" />
              <p className="text-xs font-medium">No notifications yet</p>
              <p className="text-[11px] text-slate-400">
                You'll be notified when bins fill, requests update, or points are awarded.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  onMarkRead(notif.id);
                  if (notif.linkTab) {
                    onNavigateTab(notif.linkTab);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer flex items-start gap-3 my-1 border ${
                  !notif.read
                    ? 'bg-white border-emerald-200 shadow-2xs'
                    : 'bg-white/60 hover:bg-white border-slate-100 opacity-80'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                    notif.type === 'bin_alert'
                      ? 'bg-rose-50 border border-rose-200'
                      : notif.type === 'route'
                      ? 'bg-sky-50 border border-sky-200'
                      : notif.type === 'reward'
                      ? 'bg-emerald-50 border border-emerald-200'
                      : 'bg-amber-50 border border-amber-200'
                  }`}
                >
                  {getNotificationIcon(notif.type)}
                </div>

                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 line-clamp-1">
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{notif.timestamp}</span>
                    {notif.linkTab && (
                      <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                        <span>Open {notif.linkTab}</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Panel Footer */}
        {notifications.length > 0 && (
          <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500">
              {notifications.length} total notifications logged
            </span>
            <button
              onClick={onClearAll}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

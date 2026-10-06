import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NotificationItem } from '../../types';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Award, 
  FolderCheck,
  Send,
  ExternalLink
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (projectId: string) => void;
  initialMode?: 'in-portal' | 'emails';
}

export const NotificationDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectProject,
  initialMode = 'in-portal'
}) => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    currentUser 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'in-portal' | 'emails'>(initialMode);
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null);

  if (!isOpen) return null;

  const userRole = currentUser?.role || 'public';
  // Filter notifications relevant to current role (or show all for demo if public/admin)
  const visibleNotifications = notifications.filter(n => {
    if (!currentUser || userRole === 'superadmin' || userRole === 'collector') return true;
    return n.recipientRole === userRole || !n.recipientRole;
  });

  const getIconForType = (type: NotificationItem['type']) => {
    switch (type) {
      case 'Project Assigned':
        return <FolderCheck className="w-4 h-4 text-sky-600" />;
      case 'Milestone Approved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'Milestone Rejected':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      case 'Deadline Approaching':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'Certificate Generated':
        return <Award className="w-4 h-4 text-purple-600" />;
      case 'Registration Pending':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'Registration Approved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'Registration Rejected':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      case 'System Alert':
        return <Bell className="w-4 h-4 text-sky-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200"
      >
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-sky-600" />
            <h2 className="text-base font-bold text-slate-900">
              Notification Center (SRS Section 17 & 18)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: In-Portal Notifications vs Resend Email Dispatch Log */}
        <div className="flex items-center border-b border-slate-200 text-xs font-semibold px-4 pt-2">
          <button
            onClick={() => {
              setActiveTab('in-portal');
              setSelectedNotif(null);
            }}
            className={`pb-2 px-3 border-b-2 transition-colors ${
              activeTab === 'in-portal'
                ? 'border-sky-600 text-sky-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            In-Portal Alerts ({visibleNotifications.filter(n => !n.read).length} Unread)
          </button>
          <button
            onClick={() => {
              setActiveTab('emails');
              setSelectedNotif(null);
            }}
            className={`pb-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'emails'
                ? 'border-sky-600 text-sky-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-indigo-500" />
            <span>Dispatched Resend Emails</span>
          </button>
        </div>

        {/* Action bar for In-Portal */}
        {activeTab === 'in-portal' && (
          <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between text-xs bg-white">
            <span className="text-slate-500">
              Showing alerts for {currentUser ? currentUser.role : 'all roles'}
            </span>
            <button
              onClick={markAllNotificationsAsRead}
              className="text-sky-700 hover:text-sky-900 font-medium flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
          </div>
        )}

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          
          {/* TAB 1: In-Portal Notifications List */}
          {activeTab === 'in-portal' && (
            visibleNotifications.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>No notifications at this time.</p>
              </div>
            ) : (
              visibleNotifications.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    markNotificationAsRead(item.id);
                    if (item.projectId && onSelectProject) {
                      onSelectProject(item.projectId);
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    item.read
                      ? 'bg-white border-slate-200 text-slate-600'
                      : 'bg-sky-50/60 border-sky-300 text-slate-900 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-md bg-white border border-slate-200 shrink-0 mt-0.5">
                      {getIconForType(item.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          {item.title}
                        </span>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-sky-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {item.message}
                      </p>
                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-mono">
                        <span>{item.type}</span>
                        <span>{item.createdAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )
          )}

          {/* TAB 2: Resend Dispatched Transactional Emails (SRS Section 1: "Transactional emails sent via Resend") */}
          {activeTab === 'emails' && (
            <div className="space-y-3 text-xs">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-[11px] text-indigo-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Resend Integration Simulation</span>
                </div>
                <p>
                  Per SRS Section 1 & Section 18: All notifications are dispatched via email through Resend in addition to in-portal display.
                </p>
              </div>

              {selectedNotif ? (
                <div className="bg-white border border-slate-300 rounded-xl p-4 space-y-3">
                  <button
                    onClick={() => setSelectedNotif(null)}
                    className="text-xs text-sky-700 font-semibold underline mb-1"
                  >
                    ← Back to Email Log
                  </button>

                  <div className="border-b border-slate-200 pb-2 space-y-1 font-mono text-[11px]">
                    <div><strong>From:</strong> notifications@triplehelix.tn.gov.in (via Resend)</div>
                    <div><strong>To:</strong> {currentUser?.email || 'coordinator@psgtech.ac.in'}</div>
                    <div><strong>Subject:</strong> [Triple Helix Portal] {selectedNotif.title}</div>
                    <div className="text-slate-400">Date: {selectedNotif.createdAt} UTC</div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3 font-sans text-xs">
                    <div className="font-bold text-slate-900">
                      Dear Registered Institution / Team Leader,
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedNotif.message}
                    </p>
                    <div className="pt-2 border-t border-slate-200 text-slate-500 text-[11px]">
                      Access your dashboard: https://triplehelix.tn.gov.in/dashboard
                    </div>
                  </div>
                </div>
              ) : (
                notifications.map(item => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedNotif(item)}
                    className="p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-400 cursor-pointer transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs truncate max-w-[240px]">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-mono bg-emerald-50 px-1.5 py-0.5 rounded">
                        Delivered
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] truncate">
                      {item.message}
                    </p>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Via Resend API · {item.createdAt}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

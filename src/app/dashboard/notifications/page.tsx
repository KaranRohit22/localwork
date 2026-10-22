"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { mockNotifications } from "@/lib/data/mock-data";

export default function CustomerNotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const markSingleAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Notifications</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Stay updated on responses, appointments, and project status changes.
          </p>
        </div>

        {notifications.some((n) => !n.is_read) && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markSingleAsRead(notif.id)}
              className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                notif.is_read
                  ? "bg-white border-border opacity-85"
                  : "bg-primary-light/20 border-primary/30 shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    notif.is_read
                      ? "bg-input-bg text-text-muted"
                      : "bg-primary text-white"
                  }`}
                >
                  <Bell className="h-4 w-4" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-text">{notif.title}</h3>
                    {!notif.is_read && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-[11px] text-text-muted block mt-2">
                    {new Date(notif.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {notif.link && (
                <Link
                  href={notif.link}
                  className="shrink-0 p-2 text-text-muted hover:text-primary transition-colors"
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="We&apos;ll notify you here when professionals accept requests or update job statuses."
        />
      )}
    </div>
  );
}

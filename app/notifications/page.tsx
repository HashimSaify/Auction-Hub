"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  // Poll for notifications every 30 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout;
    function fetchNotifications() {
      fetch("/api/notifications")
        .then(res => res.json())
        .then(data => setNotifications(data.notifications || []))
        .finally(() => setLoading(false));
    }
    fetchNotifications();
    interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    setMarking(true);
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" } });
    setNotifications((prev: any) => prev.map((n: any) => ({ ...n, read: true })));
    setMarking(false);
  };

  // Mark single notification as read
  const handleMarkAsRead = async (id: string) => {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setNotifications((prev: any) => prev.map((n: any) => n._id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="container py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Notifications</CardTitle>
          <Button size="sm" variant="outline" onClick={handleMarkAllAsRead} disabled={marking || notifications.every((n: any) => n.read)}>
            Mark all as read
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No notifications yet.</div>
          ) : (
            <div className="space-y-4">
              {notifications.map((n: any, idx: number) => (
                <div
                  key={n._id || n.id || idx}
                  className={`rounded-md border px-4 py-3 flex items-center gap-4 cursor-pointer transition-opacity ${n.read ? 'bg-muted opacity-70' : 'bg-muted/50 hover:opacity-90'}`}
                  onClick={() => !n.read && handleMarkAsRead(n._id)}
                >
                  <div className="flex-1">
                    <div className="font-medium">{n.message}</div>
                    <div className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                  {!n.read && <Badge className="text-xs" variant="secondary">New</Badge>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

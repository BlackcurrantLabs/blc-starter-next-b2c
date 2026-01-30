import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: "Welcome to User Portal",
      message: "Get started by setting up your profile.",
      time: "1 day ago",
      read: false,
    },
    {
      id: 2,
      title: "Maintenance Scheduled",
      message: "System maintenance scheduled for Sunday at 2 AM.",
      time: "3 days ago",
      read: true,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
      <div className="grid gap-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={notification.read ? "bg-muted/40" : ""}>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <Bell className={`h-5 w-5 ${notification.read ? "text-muted-foreground" : "text-primary"}`} />
              <div className="space-y-1">
                <CardTitle className="text-base">{notification.title}</CardTitle>
                <CardDescription>{notification.time}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

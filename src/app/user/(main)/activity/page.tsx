import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ActivityPage() {
  const activities = [
    {
      id: 1,
      action: "Logged in",
      date: "Just now",
      details: "Successful login from Chrome on macOS",
    },
    {
      id: 2,
      action: "Updated profile",
      date: "2 hours ago",
      details: "Changed display name",
    },
    {
      id: 3,
      action: "Project created",
      date: "Yesterday",
      details: "Created new project 'Alpha'",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>View your recent actions and events.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.details} • {activity.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

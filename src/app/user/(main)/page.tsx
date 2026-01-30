import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function UserDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Welcome Back!</CardTitle>
          <CardDescription>Here's what's happening with your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            You have 3 unread notifications and 2 pending tasks.
          </p>
          <Button asChild>
            <Link href="/user/activity">View Activity</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you can perform.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          <Button variant="outline" className="w-full justify-start">
            Create New Project
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Update Profile
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
          <CardDescription>Your usage overview.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">85%</div>
          <p className="text-xs text-muted-foreground">
            +2.5% from last month
          </p>
          <div className="mt-4 h-[80px] w-full bg-muted rounded-md flex items-center justify-center text-muted-foreground text-xs">
            [Chart Placeholder]
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

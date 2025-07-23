"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { notify } from "@/lib/helpers";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Shield,
  Settings,
  Bell,
  Activity,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAppStore();

  const handleNotification = () => {
    notify.success("This is a protected page notification! 🎉");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.firstName}! Here&apos;s your account overview.
        </p>
      </div>

      {/* User Profile Card */}
      <Card className="card-elevated-high">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl">
                {user?.firstName} {user?.lastName}
              </CardTitle>
              <CardDescription className="flex items-center space-x-2">
                <Badge
                  variant="secondary"
                  className="bg-success/10 text-success"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
                <span>
                  Member since{" "}
                  {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
                </span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-2xl">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Phone Number</p>
                <p className="text-sm text-muted-foreground">
                  {user?.phoneNumber || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-2xl">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">
                  {user?.email || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Account Status
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">Active</div>
            <p className="text-xs text-muted-foreground">
              Your account is verified and active
            </p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Unread notifications
            </p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Today</div>
            <p className="text-xs text-muted-foreground">
              Last seen: {new Date().toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your account and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="flex items-center space-x-2 h-auto p-4"
            >
              <Settings className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Settings</div>
                <div className="text-xs text-muted-foreground">
                  Account preferences
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex items-center space-x-2 h-auto p-4"
            >
              <User className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Profile</div>
                <div className="text-xs text-muted-foreground">
                  Update your info
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex items-center space-x-2 h-auto p-4"
            >
              <Bell className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Notifications</div>
                <div className="text-xs text-muted-foreground">
                  Manage alerts
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex items-center space-x-2 h-auto p-4"
              onClick={handleNotification}
            >
              <Activity className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Test Toast</div>
                <div className="text-xs text-muted-foreground">
                  Show notification
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest account activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-muted/30 rounded-2xl">
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Account verified successfully
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.createdAt
                    ? formatDate(user.createdAt)
                    : formatDate(new Date())}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-muted/30 rounded-2xl">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Profile created</p>
                <p className="text-xs text-muted-foreground">
                  {user?.createdAt
                    ? formatDate(user.createdAt)
                    : formatDate(new Date())}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-muted/30 rounded-2xl">
              <div className="w-8 h-8 bg-info/10 rounded-full flex items-center justify-center">
                <Phone className="h-4 w-4 text-info" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Phone number verified</p>
                <p className="text-xs text-muted-foreground">
                  {user?.createdAt
                    ? formatDate(user.createdAt)
                    : formatDate(new Date())}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Settings, Bell, Shield, Globe, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>General Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="app-name">Application Name</Label>
                <Input id="app-name" type="text" defaultValue="Papawis" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Time Zone</Label>
                <Select defaultValue="utc-8">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc-8">UTC-8 (Pacific Time)</SelectItem>
                    <SelectItem value="utc-5">UTC-5 (Eastern Time)</SelectItem>
                    <SelectItem value="utc+0">
                      UTC+0 (Greenwich Mean Time)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-duration">
                  Default Booking Duration
                </Label>
                <Select defaultValue="60">
                  <SelectTrigger id="booking-duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Bell className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle>Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: "email-notifications",
                  name: "Email Notifications",
                  description: "Receive email updates for bookings",
                },
                {
                  id: "sms-notifications",
                  name: "SMS Notifications",
                  description: "Get SMS alerts for urgent updates",
                },
                {
                  id: "desktop-notifications",
                  name: "Desktop Notifications",
                  description: "Show browser notifications",
                },
                {
                  id: "weekly-reports",
                  name: "Weekly Reports",
                  description: "Receive weekly usage reports",
                },
              ].map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between space-x-2"
                >
                  <Label
                    htmlFor={setting.id}
                    className="flex flex-col space-y-1 cursor-pointer"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {setting.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {setting.description}
                    </span>
                  </Label>
                  <Switch id={setting.id} defaultChecked />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <CardTitle>Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout</Label>
                <Select defaultValue="30">
                  <SelectTrigger id="session-timeout">
                    <SelectValue placeholder="Select timeout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Two-Factor Authentication
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Add an extra layer of security
                  </p>
                </div>
                <Button variant="outline" size="sm" className="text-primary">
                  Enable
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Login Audit
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Track login attempts and history
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View Logs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Palette className="h-5 w-5 text-purple-600" />
              </div>
              <CardTitle>Appearance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["Light", "Dark", "Auto"].map((theme) => (
                    <Button
                      key={theme}
                      variant={theme === "Light" ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                    >
                      {theme}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="english">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}

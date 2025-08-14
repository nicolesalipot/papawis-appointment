import { Settings, Bell, Shield, Globe, Palette } from "lucide-react";

export function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="mt-2 text-slate-600">
          Manage your application settings and preferences.
        </p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              General Settings
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Application Name
              </label>
              <input
                type="text"
                defaultValue="SportsFacility"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Time Zone
              </label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>UTC-8 (Pacific Time)</option>
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC+0 (Greenwich Mean Time)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Default Booking Duration
              </label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>30 minutes</option>
                <option>60 minutes</option>
                <option>90 minutes</option>
                <option>120 minutes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <Bell className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Notifications
            </h3>
          </div>

          <div className="space-y-4">
            {[
              {
                name: "Email Notifications",
                description: "Receive email updates for bookings",
              },
              {
                name: "SMS Notifications",
                description: "Get SMS alerts for urgent updates",
              },
              {
                name: "Desktop Notifications",
                description: "Show browser notifications",
              },
              {
                name: "Weekly Reports",
                description: "Receive weekly usage reports",
              },
            ].map((setting) => (
              <div
                key={setting.name}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {setting.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {setting.description}
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
              <Shield className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Security</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Session Timeout
              </label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>4 hours</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Two-Factor Authentication
                </p>
                <p className="text-xs text-slate-500">
                  Add an extra layer of security
                </p>
              </div>
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                Enable
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Login Audit
                </p>
                <p className="text-xs text-slate-500">
                  Track login attempts and history
                </p>
              </div>
              <button className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                View Logs
              </button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <Palette className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Appearance</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Light", "Dark", "Auto"].map((theme) => (
                  <button
                    key={theme}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      theme === "Light"
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Language
              </label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
          Save Changes
        </button>
      </div>
    </div>
  );
}

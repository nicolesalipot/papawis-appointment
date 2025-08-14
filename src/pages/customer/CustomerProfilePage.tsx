import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Settings,
  Bell,
  Shield,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  X,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";
import { format } from "date-fns";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  preferences: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export function CustomerProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user, updateProfile, logout } = useAuthStore();
  const { bookings } = useBookingStore();
  const navigate = useNavigate();

  // Filter customer bookings for stats
  const customerBookings = bookings.filter(
    (booking) =>
      booking.customerId === user?.id || booking.customerEmail === user?.email
  );

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      dateOfBirth: user?.dateOfBirth || "",
      emergencyContact: user?.emergencyContact || "",
      emergencyPhone: user?.emergencyPhone || "",
      preferences: user?.preferences || "",
    },
    mode: "onChange",
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const result = await updateProfile({
        ...user,
        ...data,
      });

      if (result.success) {
        setSuccess("Profile updated successfully!");
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate password change
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, this would verify current password and update
      setSuccess("Password changed successfully!");
      passwordForm.reset();
    } catch (err) {
      setError("Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const recentBookings = customerBookings
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    )
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/customer/dashboard")}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Account Settings
                </h1>
                <p className="text-sm text-gray-500">
                  Manage your profile and preferences
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="text-red-600 hover:text-red-700 hover:border-red-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="bg-black rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                  <Badge variant="outline" className="mt-2">
                    Customer
                  </Badge>
                </div>

                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === "profile"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab("security")}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === "security"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Shield className="h-4 w-4 mr-3" />
                    Security
                  </button>
                  <button
                    onClick={() => setActiveTab("notifications")}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === "notifications"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Bell className="h-4 w-4 mr-3" />
                    Notifications
                  </button>
                  <button
                    onClick={() => setActiveTab("activity")}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === "activity"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Calendar className="h-4 w-4 mr-3" />
                    Activity
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          {...profileForm.register("firstName")}
                        />
                        {profileForm.formState.errors.firstName && (
                          <p className="text-sm text-red-600 mt-1">
                            {profileForm.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          {...profileForm.register("lastName")}
                        />
                        {profileForm.formState.errors.lastName && (
                          <p className="text-sm text-red-600 mt-1">
                            {profileForm.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="email"
                            type="email"
                            className="pl-10"
                            {...profileForm.register("email")}
                          />
                        </div>
                        {profileForm.formState.errors.email && (
                          <p className="text-sm text-red-600 mt-1">
                            {profileForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="phone"
                            type="tel"
                            className="pl-10"
                            {...profileForm.register("phone")}
                          />
                        </div>
                        {profileForm.formState.errors.phone && (
                          <p className="text-sm text-red-600 mt-1">
                            {profileForm.formState.errors.phone.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          {...profileForm.register("dateOfBirth")}
                        />
                      </div>

                      <div>
                        <Label htmlFor="address">Address</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="address"
                            className="pl-10"
                            placeholder="Your address"
                            {...profileForm.register("address")}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="emergencyContact">
                          Emergency Contact
                        </Label>
                        <Input
                          id="emergencyContact"
                          placeholder="Emergency contact name"
                          {...profileForm.register("emergencyContact")}
                        />
                      </div>

                      <div>
                        <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                        <Input
                          id="emergencyPhone"
                          type="tel"
                          placeholder="Emergency contact phone"
                          {...profileForm.register("emergencyPhone")}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="preferences">Preferences & Notes</Label>
                      <Textarea
                        id="preferences"
                        placeholder="Any special preferences, dietary restrictions, or notes..."
                        rows={3}
                        {...profileForm.register("preferences")}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || !profileForm.formState.isValid}
                      className="bg-black hover:bg-gray-800 text-white"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </div>
                      ) : (
                        "Update Profile"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your password and security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                    className="space-y-6"
                  >
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          className="pr-10"
                          {...passwordForm.register("currentPassword")}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {passwordForm.formState.errors.currentPassword && (
                        <p className="text-sm text-red-600 mt-1">
                          {
                            passwordForm.formState.errors.currentPassword
                              .message
                          }
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          className="pr-10"
                          {...passwordForm.register("newPassword")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {passwordForm.formState.errors.newPassword && (
                        <p className="text-sm text-red-600 mt-1">
                          {passwordForm.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          className="pr-10"
                          {...passwordForm.register("confirmPassword")}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {passwordForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-600 mt-1">
                          {
                            passwordForm.formState.errors.confirmPassword
                              .message
                          }
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || !passwordForm.formState.isValid}
                      className="bg-black hover:bg-gray-800 text-white"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Changing Password...
                        </div>
                      ) : (
                        "Change Password"
                      )}
                    </Button>
                  </form>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h4 className="font-medium">Account Security</h4>
                    <div className="text-sm text-gray-600">
                      <p>
                        • Your account is protected with industry-standard
                        encryption
                      </p>
                      <p>• We recommend using a strong, unique password</p>
                      <p>
                        • Enable two-factor authentication for additional
                        security
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how you want to be notified about your bookings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Booking Confirmations</h4>
                        <p className="text-sm text-gray-600">
                          Get notified when your bookings are confirmed
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Booking Reminders</h4>
                        <p className="text-sm text-gray-600">
                          Receive reminders 24 hours before your booking
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Cancellation Alerts</h4>
                        <p className="text-sm text-gray-600">
                          Get notified if your booking is cancelled
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Promotional Updates</h4>
                        <p className="text-sm text-gray-600">
                          Receive updates about new facilities and special
                          offers
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                    </div>
                  </div>

                  <Button className="bg-black hover:bg-gray-800 text-white">
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Activity Tab */}
            {activeTab === "activity" && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your recent bookings and account activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentBookings.length > 0 ? (
                    <div className="space-y-4">
                      {recentBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium">{booking.title}</h4>
                            <p className="text-sm text-gray-600">
                              {booking.facilityName} •{" "}
                              {format(
                                new Date(booking.startTime),
                                "MMM dd, yyyy"
                              )}
                            </p>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No recent activity
                      </h3>
                      <p className="text-gray-600">
                        Your booking activity will appear here
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { User, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Avatar } from "@/components/ui/avatar";

export default function CustomerSettingsPage() {
  const [fullName, setFullName] = useState("Sarah Miller");
  const [email] = useState("sarah.miller@gmail.com");
  const [phone, setPhone] = useState("+1 (206) 555-9011");
  const [avatarUrl, setAvatarUrl] = useState(
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
  );
  const [profileSaved, setProfileSaved] = useState(false);

  // Password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }

    setPasswordSaved(true);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-text">Account Settings</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Manage your personal details, contact preferences, and password.
        </p>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-card">
        <h2 className="text-lg font-bold text-text mb-6 flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Personal Information
        </h2>

        {profileSaved && (
          <div className="mb-6 flex items-center gap-2 p-3.5 rounded-xl bg-success-light text-success text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            Profile details updated successfully!
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-5">
          <div className="flex items-center gap-5 pb-4 border-b border-border">
            <Avatar src={avatarUrl} alt={fullName} size="xl" />
            <div>
              <p className="text-sm font-semibold text-text">Profile Picture</p>
              <p className="text-xs text-text-muted mt-0.5">
                PNG, JPG or WebP up to 5MB
              </p>
              <div className="mt-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setAvatarUrl(
                      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
                    )
                  }
                >
                  Change Avatar
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Full Name" required>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Email Address" helper="Email address cannot be changed">
              <Input value={email} disabled className="bg-input-bg text-text-muted cursor-not-allowed" />
            </FormField>
          </div>

          <FormField label="Phone Number" helper="Used by pros to contact you regarding scheduled jobs">
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </FormField>

          <div className="pt-2">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>

      {/* Password Security Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-card">
        <h2 className="text-lg font-bold text-text mb-6 flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          Change Password
        </h2>

        {passwordSaved && (
          <div className="mb-6 flex items-center gap-2 p-3.5 rounded-xl bg-success-light text-success text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            Your password was successfully updated!
          </div>
        )}

        {passwordError && (
          <div className="mb-6 flex items-center gap-2 p-3.5 rounded-xl bg-error-light text-error text-xs font-semibold">
            <AlertCircle className="h-4 w-4" />
            {passwordError}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <FormField label="Current Password" required>
            <Input
              type="password"
              placeholder="••••••••"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="New Password" required>
              <Input
                type="password"
                placeholder="Min 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Confirm New Password" required>
              <Input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </FormField>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="outline">
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

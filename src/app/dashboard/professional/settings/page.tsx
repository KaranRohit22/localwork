"use client";

import { useState, useEffect } from "react";
import { User, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { getCurrentUserProfileAction, updateCurrentUserProfileAction } from "@/app/actions/auth";
import { updateUserPasswordAction } from "@/app/actions/services";

export default function ProfessionalSettingsPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    let isMounted = true;
    getCurrentUserProfileAction().then((res) => {
      if (isMounted) {
        if (res.authenticated && res.profile) {
          setFullName(res.profile.full_name || "");
          setEmail(res.profile.email || "");
          setPhone(res.profile.phone || "");
        } else if (res.user) {
          setEmail(res.user.email || "");
          setFullName(res.user.email?.split("@")[0] || "");
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);
  const [profileSaved, setProfileSaved] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    await updateCurrentUserProfileAction({
      full_name: fullName,
      phone: phone || null,
    });
    setIsUpdatingProfile(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }

    setIsUpdatingPassword(true);
    const res = await updateUserPasswordAction(newPassword);
    setIsUpdatingPassword(false);

    if (!res.success) {
      setPasswordError(res.error || "Failed to update password.");
      return;
    }

    setPasswordSaved(true);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSaved(false), 3500);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-text">Professional Account Settings</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Manage your login credentials, contact phone, and security settings.
        </p>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-card">
        <h2 className="text-lg font-bold text-text mb-6 flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Pro Account Details
        </h2>

        {profileSaved && (
          <div className="mb-6 flex items-center gap-2 p-3.5 rounded-xl bg-success-light text-success text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            Contact details updated successfully!
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Full Name / Representative" required>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Account Email" helper="Contact support to change account email">
              <Input
                value={email}
                disabled
                className="bg-input-bg text-text-muted cursor-not-allowed"
              />
            </FormField>
          </div>

          <FormField
            label="Direct Customer Contact Phone"
            helper="Customers with accepted requests will be provided this number for job coordination."
            required
          >
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </FormField>

          <div className="pt-2">
            <Button type="submit" disabled={isUpdatingProfile}>
              {isUpdatingProfile ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-card">
        <h2 className="text-lg font-bold text-text mb-6 flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          Update Password
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
            <Button type="submit" variant="outline" disabled={isUpdatingPassword}>
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

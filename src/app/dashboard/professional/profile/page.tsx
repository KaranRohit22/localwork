"use client";

import { useState, useEffect } from "react";
import { UserCheck, Plus, X, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import {
  getProfessionalProfileDataAction,
  updateProfessionalProfileDataAction,
} from "@/app/actions/services";

export default function ProfessionalProfileEditorPage() {
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [yearsExperience, setYearsExperience] = useState("1");
  const [hourlyRate, setHourlyRate] = useState("75");
  const [city, setCity] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getProfessionalProfileDataAction().then((res) => {
      if (isMounted && res.profile) {
        setHeadline(res.profile.headline || "");
        setBio(res.profile.bio || "");
        setYearsExperience(String(res.profile.years_experience || 1));
        setHourlyRate(res.profile.hourly_rate ? String(res.profile.hourly_rate) : "75");
        setCity(res.profile.city || "");
        setServiceArea(res.profile.service_area || "");
        setIsAvailable(res.profile.is_available !== false);
        setSkills(res.profile.skills || []);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    const res = await updateProfessionalProfileDataAction({
      headline,
      bio,
      years_experience: Number(yearsExperience) || 1,
      hourly_rate: hourlyRate ? Number(hourlyRate) : null,
      city: city || "Local",
      service_area: serviceArea || city || "Local Area",
      skills,
      is_available: isAvailable,
    });

    setIsSaving(false);
    if (!res.success) {
      setErrorMessage(res.error || "Failed to update professional profile.");
    } else {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-text">Edit Business Profile</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Keep your headline, hourly rate, coverage radius, and skills updated to rank well in search.
        </p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-success-light text-success text-sm font-semibold">
          <CheckCircle2 className="h-5 w-5" />
          Business profile changes saved successfully!
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-error-light text-error text-sm font-semibold">
          <AlertCircle className="h-5 w-5" />
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Core Info */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-card space-y-5">
          <h2 className="text-lg font-bold text-text flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            General Trade Details
          </h2>

          <FormField
            label="Professional Headline / Title"
            helper="e.g. Master Electrician & Smart Home Specialist"
            required
          >
            <Input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              required
            />
          </FormField>

          <FormField
            label="Professional Bio & Experience"
            helper="Tell clients about your background, training, guarantees, and what makes your craft exceptional."
            required
          >
            <Textarea
              rows={5}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Years of Professional Experience" required>
              <Input
                type="number"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Standard Hourly Rate ($)" helper="Leave empty if quote-only">
              <Input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Primary City" required>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Service Area / Radius Description" required>
              <Input
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
                required
              />
            </FormField>
          </div>
        </div>

        {/* Skills & Specialties */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-card space-y-4">
          <h2 className="text-lg font-bold text-text">Skills & Specialties</h2>
          <p className="text-xs text-text-secondary">
            Add tags for specific services you provide. Clients search by these keywords.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-input-bg border border-border text-xs sm:text-sm font-medium text-text"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-text-muted hover:text-error transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2 max-w-sm">
            <Input
              placeholder="e.g. Surge Protection"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill(e);
                }
              }}
            />
            <Button type="button" variant="outline" onClick={handleAddSkill}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-card flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-text">Accepting New Service Requests</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Turn off if you are fully booked or away on vacation.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAvailable(!isAvailable)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isAvailable ? "bg-success" : "bg-text-muted/40"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                isAvailable ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" size="lg" disabled={isSaving} className="font-semibold shadow-md">
            {isSaving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

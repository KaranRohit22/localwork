"use client";

import { useState } from "react";
import { UserCheck, Plus, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";

export default function ProfessionalProfileEditorPage() {
  const [headline, setHeadline] = useState("Master Electrician & Smart Home Specialist");
  const [bio, setBio] = useState(
    "Licensed master electrician with over 12 years of hands-on experience in residential and commercial wiring, panel upgrades, EV charger installations, and smart home automation. Dedicated to clean work and strict safety standards."
  );
  const [yearsExperience, setYearsExperience] = useState("12");
  const [hourlyRate, setHourlyRate] = useState("85");
  const [city, setCity] = useState("Seattle");
  const [serviceArea, setServiceArea] = useState("Greater Seattle, Bellevue, Redmond, Kirkland");
  const [isAvailable, setIsAvailable] = useState(true);

  // Skills chip management
  const [skills, setSkills] = useState([
    "Panel Upgrades",
    "EV Chargers",
    "Smart Lighting",
    "Rewiring",
    "Code Compliance",
    "Generators",
  ]);
  const [newSkill, setNewSkill] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
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
          <Button type="submit" size="lg" className="font-semibold shadow-md">
            Save All Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

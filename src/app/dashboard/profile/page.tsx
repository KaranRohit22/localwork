"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  ShieldCheck,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Briefcase,
  Star,
  CheckCircle2,
  ExternalLink,
  Edit3,
  Heart,
  DollarSign,
  Award,
  Filter,
  Sparkles,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mockRequests, mockReviews, mockProfessionals } from "@/lib/data/mock-data";
import { ServiceRequestWithDetails } from "@/types";

export default function SelfProfileActivityPage() {
  // Mode toggle: Customer view vs Professional view
  const [profileRole, setProfileRole] = useState<"customer" | "professional">("customer");

  // Active Tab
  const [activeTab, setActiveTab] = useState<"work" | "reviews" | "network" | "security">("work");
  const [workFilter, setWorkFilter] = useState<"all" | "completed" | "in_progress" | "pending">("all");

  // Profile data state
  const [fullName, setFullName] = useState("Sarah Miller");
  const [email] = useState("sarah.miller@gmail.com");
  const [phone, setPhone] = useState("+1 (206) 555-9011");
  const [location, setLocation] = useState("Seattle, WA (Ballard)");
  const [bio, setBio] = useState(
    "Homeowner in Ballard. Passionate about sustainable home renovations, craftsmanship, and working with verified local tradespeople."
  );
  const [avatarUrl] = useState(
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
  );

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempName, setTempName] = useState(fullName);
  const [tempPhone, setTempPhone] = useState(phone);
  const [tempLocation, setTempLocation] = useState(location);
  const [tempBio, setTempBio] = useState(bio);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Selected work item for detail modal
  const [selectedWork, setSelectedWork] = useState<ServiceRequestWithDetails | null>(null);

  // Filter requests
  const customerRequests = mockRequests;
  const filteredWork = customerRequests.filter((r) => {
    if (workFilter === "completed") return r.status === "completed";
    if (workFilter === "in_progress") return r.status === "in_progress" || r.status === "accepted";
    if (workFilter === "pending") return r.status === "pending";
    return true;
  });

  // Calculate metrics
  const completedCount = customerRequests.filter((r) => r.status === "completed").length;
  const activeCount = customerRequests.filter((r) => r.status === "pending" || r.status === "in_progress" || r.status === "accepted").length;
  const totalSpent = customerRequests.reduce((sum, r) => sum + (r.budget || 0), 0);
  const myReviews = mockReviews.filter((r) => r.customer_id === "cust-1" || r.customer.full_name === "Sarah Miller");

  // Handle Edit Submit
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setFullName(tempName);
    setPhone(tempPhone);
    setLocation(tempLocation);
    setBio(tempBio);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditModalOpen(false);
    }, 1200);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "in_progress":
        return <Badge variant="warning">In Progress</Badge>;
      case "accepted":
        return <Badge variant="default">Accepted</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* View Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/15 border border-primary/25 text-primary flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text">Self Profile & Activity Hub</h2>
            <p className="text-xs text-text-muted">Viewing your personal profile, records, and activity</p>
          </div>
        </div>

        {/* Perspective Toggle */}
        <div className="flex items-center gap-2 bg-input-bg p-1 rounded-xl border border-border">
          <button
            onClick={() => {
              setProfileRole("customer");
              setFullName("Sarah Miller");
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              profileRole === "customer"
                ? "bg-gradient-to-r from-primary to-teal text-white shadow-sm font-bold"
                : "text-text-muted hover:text-text"
            }`}
          >
            Customer Profile
          </button>
          <button
            onClick={() => {
              setProfileRole("professional");
              setFullName("Marcus Vance");
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              profileRole === "professional"
                ? "bg-gradient-to-r from-primary to-teal text-white shadow-sm font-bold"
                : "text-text-muted hover:text-text"
            }`}
          >
            Professional Profile
          </button>
        </div>
      </div>

      {/* Hero Profile Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card-elevated to-card border border-border/80 shadow-card">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/3 w-96 h-36 bg-primary/15 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute -bottom-10 right-10 w-72 h-32 bg-teal/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 p-6 sm:p-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* User Identity Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative group">
                <Avatar
                  src={
                    profileRole === "customer"
                      ? avatarUrl
                      : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                  }
                  alt={fullName}
                  size="xl"
                  className="ring-4 ring-primary/20 shadow-xl"
                />
                <div
                  className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-card"
                  title="Active Now"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
                    {profileRole === "customer" ? fullName : "Marcus Vance"}
                  </h1>
                  {profileRole === "customer" ? (
                    <Badge variant="default" className="gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      Verified Customer
                    </Badge>
                  ) : (
                    <Badge variant="success" className="gap-1">
                      <Award className="h-3 w-3" />
                      Verified Master Pro
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-text-muted max-w-xl leading-relaxed">
                  {profileRole === "customer"
                    ? bio
                    : "Licensed Master Electrician with 12+ years experience in Seattle. Panel upgrades, EV charging, and high-efficiency home wiring."}
                </p>

                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1 text-xs text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {profileRole === "customer" ? location : "Greater Seattle, WA"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-teal" />
                    Member since Jan 2024
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-amber" />
                    {profileRole === "customer" ? email : "marcus.vance@vanceelectric.com"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-emerald-400" />
                    {profileRole === "customer" ? phone : "+1 (206) 555-0142"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
              {profileRole === "customer" ? (
                <>
                  <Button
                    onClick={() => {
                      setTempName(fullName);
                      setTempPhone(phone);
                      setTempLocation(location);
                      setTempBio(bio);
                      setIsEditModalOpen(true);
                    }}
                    variant="outline"
                    className="flex-1 sm:flex-none gap-2 font-semibold"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Link href="/dashboard/settings" className="flex-1 sm:flex-none">
                    <Button variant="secondary" className="w-full gap-2 font-semibold">
                      Settings
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/professionals/pro-1">
                    <Button variant="outline" className="gap-2 font-semibold">
                      <ExternalLink className="h-4 w-4" />
                      Public View
                    </Button>
                  </Link>
                  <Link href="/dashboard/professional/profile">
                    <Button className="gap-2 font-semibold">
                      <Edit3 className="h-4 w-4" />
                      Edit Business
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Metric Activity Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {profileRole === "customer" ? (
          <>
            <Card className="p-5 border-border hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Work Requests
                </span>
                <div className="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                  <Briefcase className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-text">{customerRequests.length}</p>
              <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                <span className="text-emerald-400 font-semibold">{completedCount} completed</span> &bull; {activeCount} active
              </p>
            </Card>

            <Card className="p-5 border-border hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Total Invested
                </span>
                <div className="h-8 w-8 rounded-lg bg-teal/15 text-teal flex items-center justify-center">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-text">${totalSpent.toLocaleString()}</p>
              <p className="text-xs text-text-muted mt-1">Across verified jobs</p>
            </Card>

            <Card className="p-5 border-border hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Reviews Given
                </span>
                <div className="h-8 w-8 rounded-lg bg-amber/15 text-amber flex items-center justify-center">
                  <Star className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-text">{myReviews.length}</p>
              <p className="text-xs text-amber font-semibold mt-1 flex items-center gap-1">
                5.0 ★ average rating
              </p>
            </Card>

            <Card className="p-5 border-border hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Pros Hired
                </span>
                <div className="h-8 w-8 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center">
                  <Heart className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-text">3 Experts</p>
              <p className="text-xs text-text-muted mt-1">Direct local network</p>
            </Card>
          </>
        ) : (
          <>
            <Card className="p-5 border-border hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Completed Jobs
                </span>
                <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-text">142</p>
              <p className="text-xs text-emerald-400 font-semibold mt-1">100% verified work</p>
            </Card>

            <Card className="p-5 border-border hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Client Rating
                </span>
                <div className="h-8 w-8 rounded-lg bg-amber/15 text-amber flex items-center justify-center">
                  <Star className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-text">4.95 ★</p>
              <p className="text-xs text-text-muted mt-1">From 89 customer reviews</p>
            </Card>

            <Card className="p-5 border-border hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Hourly Rate
                </span>
                <div className="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-text">$85 / hr</p>
              <p className="text-xs text-text-muted mt-1">Direct client billing</p>
            </Card>

            <Card className="p-5 border-border hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Active Inquiries
                </span>
                <div className="h-8 w-8 rounded-lg bg-teal/15 text-teal flex items-center justify-center">
                  <MessageSquare className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-text">4 Active</p>
              <p className="text-xs text-teal font-semibold mt-1">Avg response &lt; 2 hrs</p>
            </Card>
          </>
        )}
      </div>

      {/* Interactive Tabs Header */}
      <div className="border-b border-border">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab("work")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "work"
                ? "border-primary text-primary"
                : "border-transparent text-text-muted hover:text-text hover:border-border"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            Work Activity & History
            <span className="px-2 py-0.5 text-[11px] rounded-full bg-primary/15 text-primary">
              {customerRequests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "reviews"
                ? "border-primary text-primary"
                : "border-transparent text-text-muted hover:text-text hover:border-border"
            }`}
          >
            <Star className="h-4 w-4" />
            Reviews & Ratings
            <span className="px-2 py-0.5 text-[11px] rounded-full bg-primary/15 text-primary">
              {profileRole === "customer" ? myReviews.length : 89}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("network")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "network"
                ? "border-primary text-primary"
                : "border-transparent text-text-muted hover:text-text hover:border-border"
            }`}
          >
            <Heart className="h-4 w-4" />
            {profileRole === "customer" ? "Hired Professionals" : "Client Network"}
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "security"
                ? "border-primary text-primary"
                : "border-transparent text-text-muted hover:text-text hover:border-border"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Account Verification
          </button>
        </div>
      </div>

      {/* Tab 1: Work Activity & History */}
      {activeTab === "work" && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-text-muted" />
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Filter History:
              </span>
              <div className="inline-flex p-1 bg-card rounded-xl border border-border">
                <button
                  onClick={() => setWorkFilter("all")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    workFilter === "all" ? "bg-primary text-white font-bold" : "text-text-muted hover:text-text"
                  }`}
                >
                  All ({customerRequests.length})
                </button>
                <button
                  onClick={() => setWorkFilter("completed")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    workFilter === "completed" ? "bg-primary text-white font-bold" : "text-text-muted hover:text-text"
                  }`}
                >
                  Completed ({completedCount})
                </button>
                <button
                  onClick={() => setWorkFilter("in_progress")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    workFilter === "in_progress" ? "bg-primary text-white font-bold" : "text-text-muted hover:text-text"
                  }`}
                >
                  In Progress ({activeCount})
                </button>
              </div>
            </div>

            <Link href="/professionals">
              <Button size="sm" className="gap-2 font-semibold">
                <Briefcase className="h-4 w-4" />
                New Service Request
              </Button>
            </Link>
          </div>

          {/* Work History List */}
          <div className="space-y-4">
            {filteredWork.length === 0 ? (
              <Card className="p-12 text-center border-border">
                <Briefcase className="h-10 w-10 text-text-muted mx-auto mb-3" />
                <h3 className="text-base font-bold text-text">No requests found</h3>
                <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                  No service requests match this filter. Start by browsing local professionals.
                </p>
              </Card>
            ) : (
              filteredWork.map((job) => (
                <Card
                  key={job.id}
                  className="p-6 border-border hover:border-border-hover transition-all duration-200 hover:shadow-card-hover group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {getStatusBadge(job.status)}
                        <Badge variant="outline">{job.category?.name || "Home Repair"}</Badge>
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Requested: {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-text-secondary line-clamp-2">
                        {job.description}
                      </p>

                      {/* Professional Involved */}
                      <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-text-muted">
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={job.professional?.avatar_url || undefined}
                            alt={job.professional?.full_name || "Professional"}
                            size="sm"
                          />
                          <span className="font-medium text-text">
                            Craftsman: {job.professional?.full_name}
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          {job.location}
                        </span>
                        {job.budget && (
                          <span className="flex items-center gap-1 font-semibold text-emerald-400">
                            Budget: ${job.budget.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedWork(job)}
                        className="font-semibold"
                      >
                        View Record
                      </Button>
                      <Link href={`/professionals/${job.professional_id}`}>
                        <Button size="sm" variant="secondary" className="gap-1 font-semibold">
                          Book Again
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Reviews & Ratings */}
      {activeTab === "reviews" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-text">
                {profileRole === "customer" ? "Reviews You Shared" : "Client Reviews Received"}
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Authentic feedback verified through completed platform bookings.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myReviews.map((rev) => (
              <Card key={rev.id} className="p-6 border-border space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={rev.professional?.avatar_url || undefined}
                      alt={rev.professional?.full_name || "Pro"}
                      size="md"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-text">{rev.professional?.full_name}</h4>
                      <p className="text-xs text-text-muted">Master Craftsman</p>
                    </div>
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    Verified Booking
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber text-sm">
                    {"★".repeat(rev.rating)}
                    {"☆".repeat(5 - rev.rating)}
                  </div>
                  <span className="text-xs text-text-muted">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed bg-input-bg p-3.5 rounded-xl border border-border/80 italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-text-muted flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    Inspection Approved
                  </span>
                  <Link
                    href={`/professionals/${rev.professional_id}`}
                    className="text-primary hover:underline font-semibold flex items-center gap-1"
                  >
                    View Pro Profile
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Network / Hired Professionals */}
      {activeTab === "network" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-text">
              {profileRole === "customer" ? "Craftsmen in Your Network" : "Clients Served"}
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Professionals you have previously hired and trusted with your home projects.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProfessionals.slice(0, 3).map((pro) => (
              <Card
                key={pro.id}
                className="p-6 border-border flex flex-col justify-between hover:border-border-hover transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar src={pro.profile.avatar_url || undefined} alt={pro.profile.full_name} size="lg" />
                    <div>
                      <h4 className="text-base font-bold text-text">{pro.profile.full_name}</h4>
                      <p className="text-xs text-primary font-semibold">{pro.headline || pro.categories[0]?.name || "Local Craftsman"}</p>
                      <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {pro.city || "Seattle, WA"}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {pro.bio}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
                    <span className="text-amber font-semibold flex items-center gap-1">
                      ★ {(pro.average_rating || 5.0).toFixed(1)} ({pro.review_count} reviews)
                    </span>
                    <span className="font-bold text-text">${pro.hourly_rate} / hr</span>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-2">
                  <Link href={`/professionals/${pro.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full font-semibold">
                      Profile
                    </Button>
                  </Link>
                  <Link href={`/professionals/${pro.id}`} className="flex-1">
                    <Button size="sm" className="w-full font-semibold">
                      Rehire
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Account & Security Profile */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <Card className="p-6 sm:p-8 border-border space-y-6">
            <div>
              <h3 className="text-lg font-bold text-text">Account Trust & Verification Badges</h3>
              <p className="text-xs text-text-muted mt-0.5">
                Verified information ensures safe interactions and faster job responses.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-input-bg border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text">Email Address</h4>
                    <p className="text-xs text-text-muted">{email}</p>
                  </div>
                </div>
                <Badge variant="success">Verified</Badge>
              </div>

              <div className="p-4 rounded-2xl bg-input-bg border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text">Phone Number</h4>
                    <p className="text-xs text-text-muted">{phone}</p>
                  </div>
                </div>
                <Badge variant="success">Verified</Badge>
              </div>

              <div className="p-4 rounded-2xl bg-input-bg border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text">Identity & Location</h4>
                    <p className="text-xs text-text-muted">{location}</p>
                  </div>
                </div>
                <Badge variant="success">Confirmed</Badge>
              </div>

              <div className="p-4 rounded-2xl bg-input-bg border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text">Community Standing</h4>
                    <p className="text-xs text-text-muted">Zero infractions &bull; High trust score</p>
                  </div>
                </div>
                <Badge variant="default">Excellent</Badge>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-text-muted">Need to update your password or security settings?</span>
              <Link href="/dashboard/settings">
                <Button variant="outline" size="sm" className="font-semibold">
                  Manage Account Settings
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Your Profile Information"
        description="Update your display name, location, contact number, and personal introduction."
      >
        {saveSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="h-14 w-14 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-lg font-bold text-text">Profile Updated Successfully!</h4>
            <p className="text-xs text-text-muted">Your latest profile details are now active.</p>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <FormField label="Full Name" required>
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                required
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Phone Number" required>
                <Input
                  value={tempPhone}
                  onChange={(e) => setTempPhone(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="City & Neighborhood" required>
                <Input
                  value={tempLocation}
                  onChange={(e) => setTempLocation(e.target.value)}
                  required
                />
              </FormField>
            </div>

            <FormField label="Personal Bio / Introduction">
              <Textarea
                rows={3}
                value={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                placeholder="Share a short summary about yourself..."
              />
            </FormField>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="font-semibold">
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Work Detail Modal */}
      {selectedWork && (
        <Modal
          isOpen={!!selectedWork}
          onClose={() => setSelectedWork(null)}
          title={selectedWork.title}
          description={`Service request history record #${selectedWork.id}`}
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              {getStatusBadge(selectedWork.status)}
              <Badge variant="outline">{selectedWork.category?.name}</Badge>
              {selectedWork.budget && (
                <Badge variant="default">${selectedWork.budget.toLocaleString()}</Badge>
              )}
            </div>

            <div className="p-4 rounded-xl bg-input-bg border border-border text-xs text-text-secondary leading-relaxed">
              {selectedWork.description}
            </div>

            <div className="space-y-3 text-xs text-text-muted">
              <div className="flex justify-between py-1.5 border-b border-border">
                <span>Location:</span>
                <span className="font-semibold text-text">{selectedWork.location}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border">
                <span>Preferred Date:</span>
                <span className="font-semibold text-text">{selectedWork.preferred_date}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border">
                <span>Assigned Pro:</span>
                <span className="font-semibold text-text">{selectedWork.professional?.full_name}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span>Status Note:</span>
                <span className="font-semibold text-text">{selectedWork.status_note || "Processed smoothly."}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setSelectedWork(null)}>
                Close Record
              </Button>
              <Link href={`/professionals/${selectedWork.professional_id}`}>
                <Button className="font-semibold">
                  View Craftsman Profile
                </Button>
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

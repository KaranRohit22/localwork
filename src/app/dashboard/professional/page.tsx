"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Inbox,
  Star,
  DollarSign,
  MapPin,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { mockRequests } from "@/lib/data/mock-data";
import { ServiceRequestWithDetails, RequestStatus } from "@/types";
import { getCurrentUserProfileAction } from "@/app/actions/auth";

export default function ProfessionalDashboardPage() {
  const [incomingRequests, setIncomingRequests] = useState<ServiceRequestWithDetails[]>(mockRequests);
  const [proName, setProName] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getCurrentUserProfileAction().then((res) => {
      if (isMounted && res.authenticated && res.profile?.full_name) {
        setProName(res.profile.full_name);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleStatusChange = (id: string, newStatus: RequestStatus) => {
    setIncomingRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const pendingRequests = incomingRequests.filter((r) => r.status === "pending");
  const acceptedRequests = incomingRequests.filter(
    (r) => r.status === "accepted" || r.status === "in_progress"
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome & Verification Banner */}
      <div className="bg-gradient-to-r from-navy via-navy-light to-navy rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-teal/20 text-teal text-xs font-semibold px-3 py-1 rounded-full mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified Marketplace Partner
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            {proName ? `Welcome back, ${proName.split(" ")[0]}!` : "Welcome to Pro Dashboard!"}
          </h1>
          <p className="text-white/70 text-sm mt-1 max-w-xl">
            You have <strong className="text-white">{pendingRequests.length} pending request</strong> awaiting review. Customers are browsing your electrical services in Greater Seattle.
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="/dashboard/professional/profile">
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
              Edit Profile
            </Button>
          </Link>
          <Link href="/dashboard/professional/requests">
            <Button className="font-semibold shadow-md">
              View All Inquiries
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase">Pending Inquiries</span>
            <div className="p-2 rounded-lg bg-primary-light text-primary">
              <Inbox className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-navy mt-3">{pendingRequests.length}</p>
          <p className="text-xs text-text-muted mt-1">Requires your response</p>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase">In Progress / Active</span>
            <div className="p-2 rounded-lg bg-teal-light text-teal">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-navy mt-3">{acceptedRequests.length}</p>
          <p className="text-xs text-text-muted mt-1">Scheduled or active</p>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase">Average Rating</span>
            <div className="p-2 rounded-lg bg-amber-light/40 text-amber">
              <Star className="h-4 w-4 fill-amber" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-navy mt-3">4.95</p>
          <p className="text-xs text-text-muted mt-1">From 48 verified clients</p>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase">Base Hourly Rate</span>
            <div className="p-2 rounded-lg bg-success-light text-success">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-navy mt-3">$85<span className="text-sm font-normal text-text-muted">/hr</span></p>
          <p className="text-xs text-text-muted mt-1">Public listing price</p>
        </Card>
      </div>

      {/* Pending Customer Requests Action Area */}
      <div className="bg-white rounded-2xl p-6 border border-border shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-text">Incoming Job Requests</h2>
            <p className="text-xs text-text-muted mt-0.5">
              Respond promptly to increase client conversion and ranking.
            </p>
          </div>
          <Link
            href="/dashboard/professional/requests"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            All Requests ({incomingRequests.length})
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="space-y-4">
          {incomingRequests.map((req) => (
            <div
              key={req.id}
              className="p-5 rounded-xl border border-border bg-input-bg/30 hover:bg-input-bg/60 transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <Avatar
                  src={req.customer.avatar_url}
                  alt={req.customer.full_name}
                  size="md"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-text text-base">{req.title}</h3>
                    {req.status === "pending" && <Badge variant="warning">New Request</Badge>}
                    {req.status === "accepted" && <Badge variant="default">Accepted</Badge>}
                    {req.status === "in_progress" && <Badge variant="secondary">In Progress</Badge>}
                    {req.status === "completed" && <Badge variant="success">Completed</Badge>}
                    {req.status === "rejected" && <Badge variant="destructive">Declined</Badge>}
                  </div>
                  <p className="text-xs text-text-secondary">
                    Client: <strong className="text-text">{req.customer.full_name}</strong> • Phone:{" "}
                    <span className="text-text-muted">{req.customer.phone || "+1 (206) 555-9011"}</span>
                  </p>
                  <p className="text-xs text-text-secondary line-clamp-2 max-w-xl">
                    {req.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-text-muted pt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {req.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {req.preferred_date ? new Date(req.preferred_date).toLocaleDateString() : "Flexible"}
                    </span>
                    {req.budget && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-text">Customer Budget: ${req.budget}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons for Pros */}
              <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                {req.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      className="bg-success text-white hover:bg-success/90"
                      onClick={() => handleStatusChange(req.id, "accepted")}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept Job
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-error border-error/20 hover:bg-error-light/40"
                      onClick={() => handleStatusChange(req.id, "rejected")}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                  </>
                )}

                {req.status === "accepted" && (
                  <Button
                    size="sm"
                    className="bg-primary text-white"
                    onClick={() => handleStatusChange(req.id, "in_progress")}
                  >
                    Start Work
                  </Button>
                )}

                {req.status === "in_progress" && (
                  <Button
                    size="sm"
                    className="bg-success text-white hover:bg-success/90"
                    onClick={() => handleStatusChange(req.id, "completed")}
                  >
                    Mark as Completed
                  </Button>
                )}

                <Link href="/dashboard/professional/requests">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

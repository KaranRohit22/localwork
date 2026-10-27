"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ClipboardList,
  CheckCircle2,
  Heart,
  Clock,
  ArrowRight,
  Search,
  MapPin,
  Calendar,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { mockRequests } from "@/lib/data/mock-data";
import { getCurrentUserProfileAction } from "@/app/actions/auth";
import { getCustomerDetailedRequestsAction, getUserFavoriteIdsAction } from "@/app/actions/services";
import { Profile, ServiceRequestWithDetails } from "@/types";

export default function CustomerDashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRequests, setUserRequests] = useState<ServiceRequestWithDetails[]>([]);
  const [favoriteCount, setFavoriteCount] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getCurrentUserProfileAction(),
      getCustomerDetailedRequestsAction(),
      getUserFavoriteIdsAction(),
    ]).then(([profileRes, requestsRes, favIds]) => {
      if (isMounted) {
        if (profileRes.profile) {
          setProfile(profileRes.profile);
          setIsAuthenticated(true);
        }
        if (requestsRes.authenticated && requestsRes.requests) {
          setUserRequests(requestsRes.requests);
        }
        setFavoriteCount(favIds.length);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Display user's own requests if authenticated, or mock requests in preview
  const displayedRequests = isAuthenticated
    ? userRequests
    : mockRequests;

  const activeRequests = displayedRequests.filter(
    (r) => r.status === "pending" || r.status === "accepted" || r.status === "in_progress"
  );
  const completedRequests = displayedRequests.filter((r) => r.status === "completed");
  const pendingReviewsCount = completedRequests.filter((r) => !r.review).length;

  const firstName = profile?.full_name?.trim()
    ? profile.full_name.trim().split(" ")[0]
    : null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "accepted":
        return <Badge variant="default">Accepted</Badge>;
      case "in_progress":
        return <Badge variant="warning">In Progress</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-r from-navy via-navy-light to-navy rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold text-teal uppercase tracking-wider">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            {firstName ? `Welcome back, ${firstName}!` : "Welcome to LocalWork!"}
          </h1>
          <p className="text-white/70 text-sm mt-1 max-w-xl">
            Track your ongoing service requests, connect with verified professionals, and review completed home projects.
          </p>
        </div>

        <Link href="/professionals">
          <Button size="lg" className="font-semibold shadow-md shrink-0">
            <Search className="h-4 w-4 mr-2" />
            Book a Professional
          </Button>
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase">Active Requests</span>
            <div className="p-2 rounded-lg bg-primary-light text-primary">
              <ClipboardList className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-navy mt-3">{activeRequests.length}</p>
          <p className="text-xs text-text-muted mt-1">
            {activeRequests.length === 1 ? "1 active job" : `${activeRequests.length} active jobs`}
          </p>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase">Completed Jobs</span>
            <div className="p-2 rounded-lg bg-success-light text-success">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-navy mt-3">{completedRequests.length}</p>
          <p className="text-xs text-text-muted mt-1">100% verified completed</p>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase">Saved Pros</span>
            <div className="p-2 rounded-lg bg-error-light text-error">
              <Heart className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-navy mt-3">
            {isAuthenticated ? favoriteCount : 3}
          </p>
          <p className="text-xs text-text-muted mt-1">Favorite experts</p>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase">Pending Reviews</span>
            <div className="p-2 rounded-lg bg-amber-light/40 text-amber">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-navy mt-3">
            {isAuthenticated ? pendingReviewsCount : 0}
          </p>
          <p className="text-xs text-text-muted mt-1">
            {pendingReviewsCount > 0 ? "Awaiting your feedback" : "All jobs reviewed"}
          </p>
        </Card>
      </div>

      {/* Active & Recent Requests */}
      <div className="bg-white rounded-2xl p-6 border border-border shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-text">Recent Service Requests</h2>
            <p className="text-xs text-text-muted mt-0.5">
              Overview of your recent job inquiries and bookings
            </p>
          </div>
          <Link
            href="/dashboard/requests"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            View All ({displayedRequests.length})
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="space-y-4">
          {displayedRequests.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No service requests yet"
              description="You don't have any service requests at the moment. Find a verified professional in your area to get started!"
              actionLabel="Find a Professional"
              actionHref="/professionals"
            />
          ) : (
            displayedRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 sm:p-5 rounded-xl border border-border bg-input-bg/30 hover:bg-input-bg/60 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <Avatar
                    src={req.professional?.avatar_url || undefined}
                    alt={req.professional?.full_name || "Pro"}
                    size="md"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-text text-sm sm:text-base">
                        {req.title}
                      </h3>
                      {getStatusBadge(req.status)}
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      Assigned Pro: <strong className="text-text">{req.professional?.full_name || "Local Pro"}</strong>
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-text-muted flex-wrap">
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
                          <span className="font-semibold text-text">
                            Est. Budget: ${req.budget}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-border">
                  <Link href="/dashboard/requests">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

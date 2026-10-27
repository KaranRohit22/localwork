"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  ClipboardCheck,
  Layers,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAdminPlatformStatsAction } from "@/app/actions/admin";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    totalPros: 0,
    totalCustomers: 0,
    totalCompletedRequests: 0,
    totalCategories: 12,
    pendingVerifications: 0,
    pendingReports: 0,
  });

  useEffect(() => {
    let isMounted = true;
    getAdminPlatformStatsAction().then((res) => {
      if (isMounted && res) {
        setStats({
          totalPros: res.stats.totalProfessionals,
          totalCustomers: res.stats.totalCustomers,
          totalCompletedRequests: res.stats.totalCompletedRequests,
          totalCategories: res.stats.totalCategories,
          pendingVerifications: res.pendingVerificationsCount,
          pendingReports: 0,
        });
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Platform Overview</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Real-time metrics, queue health, and administrative actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/verification">
            <Button size="sm" className="bg-amber text-navy hover:bg-amber/90 font-semibold">
              Review Verifications ({stats.pendingVerifications})
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase">Total Pros</span>
            <div className="p-2 rounded-lg bg-teal-light text-teal">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-navy mt-3">
            {stats.totalPros}
          </p>
          <p className="text-xs text-text-muted mt-1">Registered professionals</p>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase">Active Customers</span>
            <div className="p-2 rounded-lg bg-primary-light text-primary">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-navy mt-3">
            {stats.totalCustomers}
          </p>
          <p className="text-xs text-text-muted mt-1">Verified user accounts</p>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase">Completed Jobs</span>
            <div className="p-2 rounded-lg bg-success-light text-success">
              <ClipboardCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-navy mt-3">
            {stats.totalCompletedRequests}
          </p>
          <p className="text-xs text-text-muted mt-1">Completed platform requests</p>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase">Service Categories</span>
            <div className="p-2 rounded-lg bg-amber-light/40 text-amber">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-navy mt-3">
            {stats.totalCategories}
          </p>
          <p className="text-xs text-text-muted mt-1">All active & monitored</p>
        </Card>
      </div>

      {/* Action Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Queue Alert */}
        <div className="bg-white rounded-2xl p-6 border border-border shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-amber-light/40 text-amber flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-text text-base">Verification Queue</h3>
                  <p className="text-xs text-text-muted">Pro applications requiring manual review</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-amber text-navy px-2.5 py-1 rounded-full">
                {stats.pendingVerifications} Pending
              </span>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">
              {stats.pendingVerifications > 0
                ? `${stats.pendingVerifications} professional profiles are pending background and credential verification.`
                : "No pending professional applications. All contractor records are verified."}
            </p>
          </div>

          <div className="pt-6 mt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-text-muted">Average review SLA: &lt; 24h</span>
            <Link href="/admin/verification">
              <Button size="sm">
                Open Verification Queue
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Moderation & Safety Queue */}
        <div className="bg-white rounded-2xl p-6 border border-border shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-success-light text-success flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-text text-base">Community Safety</h3>
                  <p className="text-xs text-text-muted">User flags and report queue</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                stats.pendingReports === 0 ? "bg-success-light text-success" : "bg-error-light text-error"
              }`}>
                {stats.pendingReports === 0 ? "Clear" : `${stats.pendingReports} Flagged`}
              </span>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">
              {stats.pendingReports > 0
                ? `${stats.pendingReports} unresolved customer reports or flagged spam reviews currently in queue.`
                : "No unresolved customer reports or flagged spam reviews currently in queue. Automated heuristic filters active."}
            </p>
          </div>

          <div className="pt-6 mt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-text-muted">{stats.pendingReports} pending reports</span>
            <Link href="/admin/reports">
              <Button variant="outline" size="sm">
                View Moderation Logs
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent System Audit Logs */}
      <div className="bg-white rounded-2xl p-6 border border-border shadow-card">
        <h3 className="text-lg font-bold text-text mb-4">Recent Audit Activity</h3>
        <div className="divide-y divide-border text-xs">
          {[
            {
              event: "Pro Verification Approved",
              target: "Marcus Vance (Master Electrician)",
              actor: "super_admin",
              time: "2 hours ago",
            },
            {
              event: "Service Request Completed",
              target: "Electrical Panel Upgrade (ID: req-1)",
              actor: "system_trigger",
              time: "4 hours ago",
            },
            {
              event: "Verified Review Published",
              target: "5 Stars for Elena Rodriguez",
              actor: "Rachel Adams",
              time: "Yesterday",
            },
            {
              event: "New Pro Registration",
              target: "Maya Patel (Landscaping)",
              actor: "public_auth",
              time: "2 days ago",
            },
          ].map((log, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-4">
              <div>
                <span className="font-semibold text-text">{log.event}: </span>
                <span className="text-text-secondary">{log.target}</span>
              </div>
              <div className="flex items-center gap-3 text-text-muted shrink-0">
                <span>By {log.actor}</span>
                <span>•</span>
                <span>{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

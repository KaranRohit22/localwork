"use client";

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
import { mockPlatformStats, mockProfessionals } from "@/lib/data/mock-data";

export default function AdminOverviewPage() {
  const pendingPros = mockProfessionals.filter(
    (p) => p.verification_status === "pending"
  );

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
              Review Verifications ({pendingPros.length})
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
            {mockPlatformStats.totalProfessionals}
          </p>
          <p className="text-xs text-text-muted mt-1">+8 new this week</p>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase">Active Customers</span>
            <div className="p-2 rounded-lg bg-primary-light text-primary">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-navy mt-3">
            {mockPlatformStats.totalCustomers.toLocaleString()}
          </p>
          <p className="text-xs text-text-muted mt-1">Across 14 cities</p>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase">Completed Jobs</span>
            <div className="p-2 rounded-lg bg-success-light text-success">
              <ClipboardCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-navy mt-3">
            {mockPlatformStats.totalCompletedRequests.toLocaleString()}
          </p>
          <p className="text-xs text-text-muted mt-1">98.4% satisfaction score</p>
        </Card>

        <Card className="p-5 border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase">Service Categories</span>
            <div className="p-2 rounded-lg bg-amber-light/40 text-amber">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-navy mt-3">
            {mockPlatformStats.totalCategories}
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
                  <p className="text-xs text-text-muted">New pro applications requiring manual approval</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-amber text-navy px-2.5 py-1 rounded-full">
                {pendingPros.length} Pending
              </span>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">
              Maya Patel submitted identity documents and landscaping contractor credentials for verification in Portland.
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
              <span className="text-xs font-bold bg-success-light text-success px-2.5 py-1 rounded-full">
                Clear
              </span>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">
              No unresolved customer reports or flagged spam reviews currently in queue. Automated heuristic filters active.
            </p>
          </div>

          <div className="pt-6 mt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-text-muted">Zero pending reports</span>
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

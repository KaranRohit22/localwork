"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-background min-h-screen py-12 md:py-20">
      <div className="page-container max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-wider uppercase text-primary bg-primary-light px-3 py-1 rounded-full">
            We Are Here To Help
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-text mt-4">
            Get In Touch
          </h1>
          <p className="mt-4 text-base md:text-lg text-text-secondary">
            Have questions about finding a pro, verification, or partnerships? Our dedicated support team is available Monday through Saturday.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details */}
          <div className="lg:col-span-5 bg-navy text-white rounded-3xl p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold">Contact Details</h2>
              <p className="text-sm text-white/70 mt-1">
                Reach out to us directly through any of our official channels.
              </p>
            </div>

            <div className="space-y-6 text-sm">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-teal" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Email Support</h4>
                  <p className="text-white/60 text-xs mt-0.5">support@localwork.app</p>
                  <p className="text-white/60 text-xs">partnerships@localwork.app</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Telephone</h4>
                  <p className="text-white/60 text-xs mt-0.5">+1 (555) 123-4567</p>
                  <p className="text-white/40 text-[11px]">Mon-Fri: 8am - 6pm PST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-amber" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Headquarters</h4>
                  <p className="text-white/60 text-xs mt-0.5">
                    1201 3rd Ave, Suite 2200<br />
                    Seattle, WA 98101
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 text-xs text-white/60">
              Expected email response time is under 4 business hours.
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-border shadow-card">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="h-16 w-16 bg-success-light text-success rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-text">Message Received!</h3>
                <p className="text-sm text-text-secondary max-w-md mx-auto">
                  Thank you for reaching out, <strong>{name}</strong>. A support specialist has received your message and will reply to <strong>{email}</strong> shortly.
                </p>
                <div className="pt-4">
                  <Button variant="outline" onClick={() => setSubmitted(false)}>
                    Send Another Inquiry
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-xl font-bold text-text mb-4">Send Us a Message</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Your Full Name" required>
                    <Input
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </FormField>

                  <FormField label="Email Address" required>
                    <Input
                      type="email"
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </FormField>
                </div>

                <FormField label="Subject" required>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-lg border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="verification">Professional Verification Question</option>
                    <option value="booking">Help with a Service Request</option>
                    <option value="safety">Trust & Safety Issue</option>
                    <option value="partnerships">Media & Partnership Inquiry</option>
                  </select>
                </FormField>

                <FormField label="Your Message" required>
                  <Textarea
                    rows={5}
                    placeholder="Tell us what you need help with..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </FormField>

                <div className="pt-2">
                  <Button type="submit" size="lg" className="w-full sm:w-auto font-semibold">
                    Send Message
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

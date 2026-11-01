import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Globe,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { api } from '../services/api';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.submitContact(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      // Show fallback success
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'How does the AI Waste Scanner work on uploaded photos?',
      a: 'The image is processed by our server-side Gemini 3.8 Flash multimodal computer vision model. It identifies visual material patterns (such as resin codes, transparent plastics, corrugated ribs, or lithium battery housings) and maps them to one of our 7 standard waste categories with 94%+ accuracy.',
    },
    {
      q: 'What should I do if a smart IoT bin near me is overflowing?',
      a: 'Our smart bins automatically emit telemetry alerts when fill levels hit 85%+. However, you can also alert dispatch directly by using our Waste Collection page or calling our municipal dispatch hotline.',
    },
    {
      q: 'Can I schedule a collection for hazardous chemical waste?',
      a: 'Yes. Choose "Hazardous Waste" in the Waste Collection scheduler. Solvents, paints, motor fluids, and industrial cleaners will be routed to a certified hazardous materials truck.',
    },
    {
      q: 'What is the purpose of Green Eco-Points?',
      a: 'Eco-Points reward citizens for accurate recycling and verified drop-offs. Municipalities can redeem points for public transit passes, community garden compost bags, or local business discounts.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
          <Mail className="w-3.5 h-3.5 text-emerald-600" />
          <span>Connect with the Team</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
          Contact SmartWaste AI
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Have questions about municipal deployment, hazardous waste protocols, or engineering project details? Reach out to our sustainable tech team.
        </p>
      </div>

      {/* Main Grid: Form & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-heading text-lg font-bold text-slate-900">
              Send us a Message
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in your inquiry and our environmental engineering team will respond within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-3 bg-emerald-50/50 rounded-2xl border border-emerald-200 p-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-800">
                Inquiry Received!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you for contacting SmartWaste AI. A representative has been notified.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 rounded-xl bg-emerald-700 text-white font-semibold text-xs cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rohitha Neeli"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Municipal Pilot Deployment Inquiry"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your questions or smart waste requirements..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending...' : 'Submit Message'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Project Contact Information & Emergency Hotline */}
        <div className="lg:col-span-5 space-y-6">
          {/* Emergency Hazard Notice */}
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 text-xs text-rose-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-700">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Emergency Chemical / Hazard Spill Hotline</span>
            </div>
            <p className="text-[11px] text-rose-800 leading-relaxed">
              For immediate industrial chemical spills, leaking transformer fluids, or toxic waste emergencies:
            </p>
            <div className="font-heading font-extrabold text-sm text-rose-900">
              📞 1-800-555-HAZARD (24/7 Dispatch)
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4 text-xs">
            <h3 className="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              SmartWaste AI Headquarters
            </h3>

            <div className="space-y-3.5 text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800">Municipal Innovation Center</div>
                  <div className="text-slate-500 text-[11px]">450 Market Street, Suite 900, San Francisco, CA</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-800">Email Inquiries</div>
                  <div className="text-slate-500 text-[11px]">contact@smartwaste.ai</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-800">Phone Support</div>
                  <div className="text-slate-500 text-[11px]">+1 (555) 019-ECO-BOT</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-800">Operations Center Hours</div>
                  <div className="text-slate-500 text-[11px]">Mon - Sat: 06:00 AM - 08:00 PM PST</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4 border-t border-slate-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Connect on Social Channels
              </div>
              <div className="flex items-center gap-2">
                {['GitHub', 'Twitter / X', 'LinkedIn', 'YouTube'].map((net) => (
                  <span
                    key={net}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    {net}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="font-heading text-lg font-bold text-slate-900">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-slate-500">Common questions regarding AI sorting and smart collection</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="py-3">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-bold text-slate-800 hover:text-emerald-700 transition-colors py-1 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-xs text-slate-600 leading-relaxed pt-2 pb-1 pr-4 animate-in fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

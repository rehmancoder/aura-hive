"use server";

import { isProduction } from "@/lib/env";
import { site } from "@/lib/site";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
  values?: Record<string, string>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Handles the contact form. Enquiries are delivered in one or both of these ways
 * (set them in Vercel → Settings → Environment Variables):
 *
 * 1. Email through Resend (resend.com):
 *    RESEND_API_KEY, CONTACT_TO_EMAIL (your inbox) and optionally CONTACT_FROM_EMAIL
 *    (a sender on a domain you verified in Resend, e.g. "Aura Hive <website@aurahive.ae>").
 * 2. A webhook (Zapier, Make, n8n…) that forwards to email, WhatsApp or your CRM:
 *    CONTACT_WEBHOOK_URL.
 *
 * If neither is set, enquiries are only written to the server log; on the live site
 * the visitor is asked to email you instead, so no enquiry is silently lost.
 */
export async function sendEnquiry(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const thanks = { status: "success" as const, message: "Thanks, your enquiry is in." };

  // Spam protection: a hidden field people never fill in, and a minimum time on the page.
  if (get("company_website")) return thanks;
  const started = Number(get("started"));
  if (started && Date.now() - started < 2500) return thanks;

  const values = {
    name: get("name").slice(0, 120),
    email: get("email").slice(0, 160),
    phone: get("phone").slice(0, 40),
    company: get("company").slice(0, 120),
    service: get("service").slice(0, 120),
    budget: get("budget").slice(0, 60),
    message: get("message").slice(0, 4000),
  };

  const fieldErrors: ContactState["fieldErrors"] = {};
  if (values.name.length < 2) fieldErrors.name = "Enter your name.";
  if (!EMAIL_RE.test(values.email)) fieldErrors.email = "Enter an email address like name@company.com.";
  if (values.message.length < 10) fieldErrors.message = "Tell us a little about your goals (10 characters or more).";

  if (Object.keys(fieldErrors).length) {
    return { status: "error", message: "Check the highlighted fields and send again.", fieldErrors, values };
  }

  const payload = { ...values, source: "Website contact form", receivedAt: new Date().toISOString() };
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const hook = process.env.CONTACT_WEBHOOK_URL;

  try {
    let delivered = false;

    if (resendKey && toEmail) {
      const text = [
        `New enquiry from the ${site.name} website`,
        "",
        `Name: ${values.name}`,
        `Email: ${values.email}`,
        `Phone / WhatsApp: ${values.phone || "Not given"}`,
        `Company: ${values.company || "Not given"}`,
        `Service: ${values.service || "Not sure yet"}`,
        `Monthly budget: ${values.budget || "Prefer not to say"}`,
        "",
        "Goals:",
        values.message,
      ].join("\n");
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL || `${site.name} website <onboarding@resend.dev>`,
          to: toEmail.split(",").map((e) => e.trim()),
          reply_to: values.email,
          subject: `New enquiry: ${values.name}${values.service ? ` (${values.service})` : ""}`,
          text,
        }),
      });
      if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
      delivered = true;
    }

    if (hook) {
      const res = await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
      delivered = true;
    }

    if (!delivered) {
      console.warn("[contact] No delivery set up (RESEND_API_KEY + CONTACT_TO_EMAIL, or CONTACT_WEBHOOK_URL).", payload);
      if (isProduction) {
        return {
          status: "error",
          message: `The form isn't connected yet. Please email us at ${site.email} and we'll reply from there.`,
          values,
        };
      }
    }
  } catch (err) {
    console.error("[contact] Failed to deliver enquiry", err);
    return {
      status: "error",
      message: `Your enquiry couldn't be sent. Try again, or email us at ${site.email}.`,
      values,
    };
  }

  return {
    status: "success",
    message: `Thanks, ${values.name.split(" ")[0]}. Your enquiry is in, and we'll reply to ${values.email}.`,
  };
}

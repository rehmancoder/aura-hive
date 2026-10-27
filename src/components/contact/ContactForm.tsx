"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { sendEnquiry, type ContactState } from "@/app/actions";
import { services, servicesPage } from "@/lib/site";

const initial: ContactState = { status: "idle" };

const fieldBase =
  "w-full rounded-xl border border-wax/15 bg-ink/70 px-4 py-3.5 text-base text-wax placeholder:text-wax/35 outline-none transition-colors focus:border-honey focus-visible:outline-none aria-[invalid=true]:border-[#f0a58f]";

/**
 * The enquiry form. Links like /contact?service=google-ads or /contact?plan=leads
 * pre-select the service or describe the chosen combination.
 */
export function ContactForm() {
  const [state, action, pending] = useActionState(sendEnquiry, initial);
  const form = useRef<HTMLFormElement>(null);
  const openedAt = useRef(0);
  const v = state.values ?? {};
  const err = state.fieldErrors ?? {};

  // Pre-fill from the link the visitor came from, and note when the form was opened (spam check).
  useEffect(() => {
    const f = form.current;
    if (!f) return;
    // React resets the form after each submit, so write the time back every render.
    if (!openedAt.current) openedAt.current = Date.now();
    const started = f.elements.namedItem("started") as HTMLInputElement | null;
    if (started) started.value = String(openedAt.current);
    if (state.status !== "idle") return;

    const params = new URLSearchParams(window.location.search);
    const service = services.find((s) => s.slug === params.get("service"));
    const select = f.elements.namedItem("service") as HTMLSelectElement | null;
    if (service && select) select.value = service.title;

    const plan = servicesPage.combos.items.find((c) => c.id === params.get("plan"));
    const message = f.elements.namedItem("message") as HTMLTextAreaElement | null;
    if (plan && message && !message.value) {
      const names = plan.slugs.map((s) => services.find((x) => x.slug === s)!.title).join(", ");
      message.value = `I'm interested in "${plan.title}" (${names}). `;
    }
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-[28px] border border-honey/40 bg-comb/80 p-7 backdrop-blur-xl sm:p-10">
        <span aria-hidden className="flex h-8 items-end gap-[4px]">
          {[0.55, 1, 0.55].map((h, i) => (
            <span key={i} className="eq-bar w-[5px] rounded-full bg-honey" style={{ height: `${h * 100}%`, animationDelay: `${i * 0.15}s` }} />
          ))}
        </span>
        <p className="display mt-8 text-[clamp(2.75rem,6vw,4.5rem)] text-honey">Enquiry sent</p>
        <p className="mt-4 text-lg leading-relaxed text-wax/85">{state.message}</p>
        <p className="mt-2 text-base leading-relaxed text-wax/65">
          While you wait, you can read more about how we work.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/services" className="rounded-full bg-honey px-6 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-wax">
            Explore our services
          </Link>
          <Link
            href="/about"
            className="rounded-full border border-wax/20 px-6 py-3 text-[15px] font-medium text-wax transition-colors hover:border-honey hover:text-honey"
          >
            About Aura Hive
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={form}
      action={action}
      noValidate
      aria-labelledby="form-title"
      aria-describedby="form-status"
      className="relative rounded-[28px] border border-wax/12 bg-comb/60 p-6 backdrop-blur-md sm:p-8 md:p-10"
    >
      <h2 id="form-title" className="display text-[clamp(2.25rem,4vw,3.25rem)] text-wax">
        Tell us about your project
      </h2>
      <p className="mt-2 text-[15px] text-wax/65">Fields marked optional can be left empty.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" error={err.name}>
          <input id="name" name="name" autoComplete="name" required maxLength={120} defaultValue={v.name} className={fieldBase} aria-invalid={!!err.name} aria-describedby={err.name ? "name-error" : undefined} />
        </Field>
        <Field label="Email" name="email" error={err.email}>
          <input id="email" name="email" type="email" inputMode="email" autoComplete="email" required maxLength={160} defaultValue={v.email} className={fieldBase} aria-invalid={!!err.email} aria-describedby={err.email ? "email-error" : undefined} />
        </Field>
        <Field label="Phone or WhatsApp" name="phone" optional>
          <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={40} defaultValue={v.phone} placeholder="+971" className={fieldBase} />
        </Field>
        <Field label="Company or brand" name="company" optional>
          <input id="company" name="company" autoComplete="organization" maxLength={120} defaultValue={v.company} className={fieldBase} />
        </Field>
        <Field label="What do you need help with?" name="service">
          <select id="service" name="service" defaultValue={v.service ?? ""} className={`${fieldBase} select-caret appearance-none pr-10`}>
            <option value="">Not sure yet</option>
            {services.map((s) => (
              <option key={s.slug} value={s.title}>
                {s.title}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Monthly marketing budget" name="budget" optional>
          <select id="budget" name="budget" defaultValue={v.budget ?? ""} className={`${fieldBase} select-caret appearance-none pr-10`}>
            <option value="">Prefer not to say</option>
            <option>Under AED 10,000</option>
            <option>AED 10,000 to 30,000</option>
            <option>AED 30,000 to 75,000</option>
            <option>Over AED 75,000</option>
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Your goals" name="message" error={err.message}>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              maxLength={4000}
              defaultValue={v.message}
              placeholder="For example: we want more enquiries from Instagram and faster replies on WhatsApp."
              className={`${fieldBase} resize-y`}
              aria-invalid={!!err.message}
              aria-describedby={err.message ? "message-error" : undefined}
            />
          </Field>
        </div>
      </div>

      {/* Spam protection: bots fill the hidden field; "started" records when the form opened */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="company_website">Leave this empty</label>
        <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="started" defaultValue="" />

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id="form-status" role={state.status === "error" ? "alert" : undefined} className="text-[15px] text-[#f0a58f]">
          {state.status === "error" ? state.message : ""}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-full bg-honey px-8 py-4 text-base font-semibold text-ink transition-colors hover:bg-wax disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Sending enquiry…" : "Send enquiry"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  optional,
  error,
  children,
}: {
  label: string;
  name: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 flex items-baseline justify-between text-[15px] font-medium text-wax/90">
        {label}
        {optional ? <span className="text-[13px] font-normal text-wax/55">Optional</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="mt-2 text-sm text-[#f0a58f]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

"use client";

import { useState } from "react";

/** Shows the email address with a copy button (mail links don't open for every visitor). */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: select the text so the visitor can copy it themselves.
      const el = document.getElementById("contact-email");
      if (el) window.getSelection()?.selectAllChildren(el);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a id="contact-email" href={`mailto:${email}`} className="select-all break-all text-xl font-semibold text-wax transition-colors hover:text-honey sm:text-2xl">
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="rounded-full border border-wax/20 px-4 py-2 text-sm font-medium text-wax/85 transition-colors hover:border-honey hover:text-honey"
      >
        <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
      </button>
    </div>
  );
}

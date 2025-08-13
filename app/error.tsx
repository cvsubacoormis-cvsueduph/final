"use client";

import ErrorShell from "@/components/ErrorShell";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <ErrorShell
          variant="500"
          title="We’re having trouble right now"
          description="Our systems ran into an error. Please try again. If the problem continues, our support team can help."
          primaryHref="/"
          primaryLabel="Go to Dashboard"
          showRetry
          onRetry={reset}
          illustrationQuery="university%20server%20error%20system%20maintenance%20illustration"
        />
      </body>
    </html>
  );
}

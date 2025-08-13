"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ErrorShell from "@/components/ErrorShell";

export default function TooManyRequestsPage() {
  const [countdown, setCountdown] = useState(60);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <ErrorShell
      variant="429"
      title="Slow down there!"
      description={`You've made too many requests. Please wait ${countdown} seconds before trying again. This helps keep our systems running smoothly for everyone.`}
      primaryHref="/"
      primaryLabel="Go to Dashboard"
      secondaryHref="/help/rate-limits"
      secondaryLabel="About Rate Limits"
      extraHref="mailto:support@campus.example.edu"
      extraLabel="Contact Support"
      illustrationQuery="student%20portal%20rate%20limit%20clock%20waiting%20illustration"
    />
  );
}

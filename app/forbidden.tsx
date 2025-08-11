import ErrorShell from "@/components/ErrorShell";

export default function Forbidden() {
  return (
    <ErrorShell
      variant="403"
      title="You don’t have access to this resource"
      description="Your account doesn’t have the required permissions. If you need access, request it from your department."
      primaryHref="/"
      primaryLabel="Return to Portal"
      secondaryHref="/help/access"
      secondaryLabel="Request Access"
      extraHref="mailto:support@campus.example.edu"
      extraLabel="Contact Support"
      illustrationQuery="student%20portal%20permissions%20access%20denied%20illustration"
    />
  );
}

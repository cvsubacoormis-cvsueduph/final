import ErrorShell from "@/components/ErrorShell";

export default function Unauthorized() {
  return (
    <ErrorShell
      variant="401"
      title="You need to sign in"
      description="Log in with your student account to continue. If you believe this is a mistake, contact support."
      primaryHref="/sign-in"
      primaryLabel="Sign in to Portal"
      secondaryHref="/help"
      secondaryLabel="Why am I seeing this?"
      illustrationQuery="student%20authentication%20login%20security%20illustration"
    />
  );
}

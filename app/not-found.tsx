import ErrorShell from "@/components/ErrorShell";

export default function NotFound() {
  return (
    <ErrorShell
      variant="404"
      title="We couldn’t find that page"
      description="The page may have been moved or no longer exists. Check the URL or return to the portal home."
      primaryHref="/"
      primaryLabel="Go to Dashboard"
      illustrationQuery="student%20portal%20page%20not%20found%20illustration"
    />
  );
}

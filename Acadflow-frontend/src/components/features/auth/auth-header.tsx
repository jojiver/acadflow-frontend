// Shared branding for the auth pages (used by the brand panel).
export function AuthHeader() {
  return (
    <header className="mb-8 text-center">
      <p className="mb-4 text-xs font-medium tracking-widest text-ink-3 uppercase">
        Your academic companion
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        AcadFlow
      </h1>
      <p className="mt-3 text-sm text-ink-2">
        Your Schedule. Your Deadlines. Your Priority.
      </p>
    </header>
  );
}

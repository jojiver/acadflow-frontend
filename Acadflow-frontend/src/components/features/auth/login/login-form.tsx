import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/components/context/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;
    if (response?.data?.message) return response.data.message;
  }
  return "Could not connect to the API. Check that the API server is running.";
}

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate("/user", { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div>
        <Label htmlFor="auth-email">Email</Label>
        <Input
          id="auth-email"
          type="email"
          autoComplete="email"
          placeholder="you@school.edu"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="auth-password">Password</Label>
        <Input
          id="auth-password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          required
          minLength={1}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-ink-2">
          <input
            type="checkbox"
            name="remember"
            className="size-4 rounded border-line accent-brand"
          />
          Remember me
        </label>
        <Link to="#" className="text-brand hover:text-brand-dark">
          Forgot password?
        </Link>
      </div>

      {error && (
        <p role="alert" className="text-sm text-high">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={busy}
        className="h-[50px] w-full rounded-[10px] text-[15px]"
      >
        {busy ? "Please wait." : "Sign in"}
      </Button>
    </form>
  );
}

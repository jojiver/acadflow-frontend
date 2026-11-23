import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/components/context/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const PROGRAMS = ["BSIT", "BSCS", "BSIS", "Other"];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

/** Extracts a readable error message from an API error. */
function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;
    if (response?.data?.message) return response.data.message;
  }
  return "Could not connect to the API. Check that the API server is running.";
}

/** Renders the SignupForm component. */
export function SignupForm() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [program, setProgram] = useState(PROGRAMS[0]);
  const [yearLevel, setYearLevel] = useState(YEARS[0]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  /** Handles form submission, validation and errors. */
  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      await signup({ name, email, program, yearLevel, password });
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
        <Label htmlFor="auth-name">Full name</Label>
        <Input
          id="auth-name"
          autoComplete="name"
          placeholder="Joniver Sumalinog"
          required
          minLength={2}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

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
          autoComplete="new-password"
          placeholder="Create a password"
          required
          minLength={8}
          pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
          title="At least 8 characters, with one uppercase letter and one number"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="auth-confirm-password">Confirm password</Label>
        <Input
          id="auth-confirm-password"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          required
          minLength={8}
          pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
          title="Passwords must match"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <Label htmlFor="auth-program">Program</Label>
          <Select
            id="auth-program"
            required
            value={program}
            onChange={(event) => setProgram(event.target.value)}
          >
            {PROGRAMS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="auth-year">Year level</Label>
          <Select
            id="auth-year"
            required
            value={yearLevel}
            onChange={(event) => setYearLevel(event.target.value)}
          >
            {YEARS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>
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
        {busy ? "Please wait." : "Create account"}
      </Button>
    </form>
  );
}

import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/components/context/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const PROGRAMS = [
  "BS Information Technology",
  "BS Computer Science",
  "BS Information Systems",
  "Other",
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;
    if (response?.data?.message) return response.data.message;
  }
  return "Could not connect to the API. Check that the API server is running.";
}

export function SignupForm() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [program, setProgram] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signup({ name, studentId, email, program, yearLevel, password });
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

      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <Label htmlFor="auth-student-id">Student ID</Label>
          <Input
            id="auth-student-id"
            placeholder="2026-01234"
            required
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
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

      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <Label htmlFor="auth-program">Program</Label>
          <Select
            id="auth-program"
            required
            value={program}
            onChange={(event) => setProgram(event.target.value)}
          >
            <option value="" disabled>
              BS Information Technology
            </option>
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
            <option value="" disabled>
              2nd Year
            </option>
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

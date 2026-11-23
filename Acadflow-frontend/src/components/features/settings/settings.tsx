import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/components/context/use-auth";
import { getErrorMessage } from "@/lib/errors";
import {
  changePasswordService,
  DEFAULT_PREFERENCES,
  getPreferencesService,
  updatePreferencesService,
  updateProfileService,
} from "@/services/settings-service";
import type { Preferences } from "@/services/settings-service";

const PROGRAMS = ["BSIT", "BSCS", "BSIS", "Other"];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const TERMS = ["1st Semester", "2nd Semester", "Summer"];

const TOGGLES = [
  { key: "deadline", label: "Deadline reminders" },
  { key: "class", label: "Class reminders" },
  { key: "priority", label: "Priority changes" },
  { key: "workload", label: "Workload warnings" },
] as const;

/** Renders the Settings component. */
export function Settings() {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [program, setProgram] = useState(user?.program ?? PROGRAMS[0]);
  const [yearLevel, setYearLevel] = useState(user?.yearLevel ?? YEARS[0]);
  const [term, setTerm] = useState(user?.academicTerm ?? TERMS[0]);
  const [preferences, setPreferences] =
    useState<Preferences>(DEFAULT_PREFERENCES);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    let active = true;

    getPreferencesService()
      .then((result) => {
        if (active) setPreferences(result);
      })
      .catch(() => {
        // Keep defaults when preferences cannot be loaded.
      });

    return () => {
      active = false;
    };
  }, []);

  /** Handles handle save in settings.tsx. */
  async function handleSave() {
    setBusy(true);
    setError("");
    setSaved(false);

    try {
      await updateProfileService({
        name: name.trim(),
        email: email.trim(),
        program,
        yearLevel,
        academicTerm: term,
      });
      await updatePreferencesService(preferences);
      await refreshUser();
      window.dispatchEvent(new Event("notifications:refresh"));
      setSaved(true);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  /** Handles handle password change in settings.tsx. */
  async function handlePasswordChange() {
    setPasswordError("");
    setPasswordSaved(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordBusy(true);

    try {
      await changePasswordService({
        currentPassword,
        password: newPassword,
        passwordConfirmation: confirmPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSaved(true);
    } catch (requestError) {
      setPasswordError(getErrorMessage(requestError));
    } finally {
      setPasswordBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      {saved && (
        <Alert tone="success" title="Settings saved">
          Your profile and notification preferences are saved to your account.
        </Alert>
      )}

      {error && (
        <p role="alert" className="text-sm text-high">
          {error}
        </p>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <Card className="p-6">
            <h2 className="text-sm font-bold text-ink">Account</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="settings-name">Full name</Label>
                <Input
                  id="settings-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="settings-email">Email</Label>
                <Input
                  id="settings-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-bold text-ink">Password</h2>
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="settings-current-password">
                  Current password
                </Label>
                <Input
                  id="settings-current-password"
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="settings-new-password">New password</Label>
                  <Input
                    id="settings-new-password"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="settings-confirm-password">
                    Confirm new password
                  </Label>
                  <Input
                    id="settings-confirm-password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                </div>
              </div>

              {passwordError && (
                <p role="alert" className="text-sm text-high">
                  {passwordError}
                </p>
              )}

              {passwordSaved && (
                <p className="text-sm text-low">
                  Password updated.
                </p>
              )}

              <div className="flex justify-end">
                <Button
                  variant="secondary"
                  onClick={handlePasswordChange}
                  disabled={passwordBusy}
                >
                  {passwordBusy ? "Updating..." : "Update password"}
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-bold text-ink">Academic</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="settings-program">Program</Label>
                <Select
                  id="settings-program"
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
                <Label htmlFor="settings-year">Year level</Label>
                <Select
                  id="settings-year"
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
            <div className="mt-4">
              <Label htmlFor="settings-term">Academic term</Label>
              <Select
                id="settings-term"
                value={term}
                onChange={(event) => setTerm(event.target.value)}
              >
                {TERMS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-6">
            <h2 className="text-sm font-bold text-ink">Notifications</h2>
            <ul className="mt-4 space-y-3">
              {TOGGLES.map((toggle) => (
                <li key={toggle.key}>
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-ink-2">
                    <input
                      type="checkbox"
                      checked={preferences[toggle.key]}
                      onChange={(event) =>
                        setPreferences((current) => ({
                          ...current,
                          [toggle.key]: event.target.checked,
                        }))
                      }
                      className="size-4 rounded border-line accent-brand"
                    />
                    {toggle.label}
                  </label>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Label htmlFor="settings-timing">Remind me</Label>
              <Select
                id="settings-timing"
                value={preferences.timing}
                onChange={(event) =>
                  setPreferences((current) => ({
                    ...current,
                    timing: event.target.value as Preferences["timing"],
                  }))
                }
              >
                <option value="30m">30 minutes before</option>
                <option value="1h">1 hour before</option>
                <option value="1d">1 day before</option>
                <option value="3d">3 days before</option>
              </Select>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-bold text-ink">Schedule</h2>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                to="/user/schedule"
                className="rounded-xl border border-line px-3 py-2 text-sm font-medium text-ink-2 hover:bg-brand-tint"
              >
                Edit class schedule
              </Link>
              <Link
                to="/user/schedule/import"
                className="rounded-xl border border-line px-3 py-2 text-sm font-medium text-ink-2 hover:bg-brand-tint"
              >
                Import schedule
              </Link>
            </div>
          </Card>

          <Button className="w-full" onClick={handleSave} disabled={busy}>
            {busy ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

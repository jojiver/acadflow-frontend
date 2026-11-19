import { useState } from "react";
import { Link } from "react-router";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/components/context/use-auth";

const PROGRAMS = ["BSIT", "BSCS", "BSIS", "Other"];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const TOGGLES = [
  { key: "deadline", label: "Deadline reminders" },
  { key: "class", label: "Class reminders" },
  { key: "priority", label: "Priority changes" },
  { key: "workload", label: "Workload warnings" },
] as const;

export function Settings() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [program, setProgram] = useState(user?.program ?? PROGRAMS[0]);
  const [yearLevel, setYearLevel] = useState(user?.yearLevel ?? YEARS[0]);
  const [term, setTerm] = useState("1st Semester");
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    deadline: true,
    class: true,
    priority: true,
    workload: true,
  });
  const [timing, setTiming] = useState("1h");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
  }

  return (
    <div className="space-y-5">
      {saved && (
        <Alert tone="success" title="Preferences saved">
          These settings are saved for this session. Account updates need the
          backend profile endpoint.
        </Alert>
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
            <div className="mt-4">
              <Label htmlFor="settings-password">Password</Label>
              <Input
                id="settings-password"
                type="password"
                placeholder="Leave blank to keep current password"
              />
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
                <option value="1st Semester">1st Semester</option>
                <option value="2nd Semester">2nd Semester</option>
                <option value="Summer">Summer</option>
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
                      checked={toggles[toggle.key]}
                      onChange={(event) =>
                        setToggles((current) => ({
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
                value={timing}
                onChange={(event) => setTiming(event.target.value)}
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

          <Button className="w-full" onClick={handleSave}>
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}

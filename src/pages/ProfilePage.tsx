import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Github, ExternalLink, Code } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockProfile = {
  full_name: "Alex Johnson",
  email: "alex@example.com",
  primary_goal: "Full-time",
  github_handle: "alexjohnson",
  resume_text: "Experienced full-stack developer with 3 years of experience building web applications using React, Node.js, and PostgreSQL. Led a team of 4 in developing an e-commerce platform serving 10K+ users...",
};

const ProfilePage = () => {
  const { user, isDemo } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [scans, setScans] = useState<any[]>([]);
  const [latestResult, setLatestResult] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      if (isDemo || !user) {
        setProfile(mockProfile);
        setScans([{ score: 68, created_at: "2026-01-01" }, { score: 72, created_at: "2026-01-15" }, { score: 74, created_at: "2026-02-01" }]);
        return;
      }

      const [profileRes, scansRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("scans").select("*").eq("user_id", user.id).order("created_at", { ascending: true }),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (scansRes.data) {
        setScans(scansRes.data);
        if (scansRes.data.length > 0) {
          setLatestResult(scansRes.data[scansRes.data.length - 1].result_json);
        }
      }
    };
    load();
  }, [user, isDemo]);

  if (!profile) {
    return <div className="container py-12 text-center"><p className="text-muted-foreground">Loading profile...</p></div>;
  }

  const p = profile;
  const result = latestResult || {};
  const scoreHistory = scans.map((s: any) => ({
    date: new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    score: s.score,
  }));

  return (
    <div className="container py-6 md:py-8 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
          <User className="w-8 h-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">{p.full_name || user?.email || "User"}</h1>
          <p className="text-sm text-muted-foreground">{user?.email || p.email} • Goal: {p.primary_goal || "Not set"}</p>
        </div>
      </div>

      {/* Resume */}
      {p.resume_text && (
        <Card className="glass-card">
          <CardContent className="p-5">
            <h3 className="font-display font-semibold mb-2">Resume Preview</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {p.resume_text.length > 300 ? p.resume_text.slice(0, 300) + "..." : p.resume_text}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Score History Chart */}
      {scoreHistory.length > 1 && (
        <Card className="glass-card">
          <CardContent className="p-5">
            <h3 className="font-display font-semibold mb-3">Score History</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={scoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Matched skills from latest scan */}
      {result.matched_skills && (
        <Card className="glass-card">
          <CardContent className="p-5">
            <h3 className="font-display font-semibold mb-3">Skills (Latest Scan)</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Matched</p>
                <div className="flex flex-wrap gap-2">
                  {result.matched_skills.map((s: string) => (
                    <span key={s} className="px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">{s}</span>
                  ))}
                </div>
              </div>
              {result.missing_skills && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Missing</p>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_skills.map((s: string) => (
                      <span key={s} className="px-2.5 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* GitHub */}
      {p.github_handle && (
        <Card className="glass-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Github className="w-5 h-5" />
              <h3 className="font-display font-semibold">GitHub</h3>
            </div>
            <a
              href={`https://github.com/${p.github_handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary flex items-center gap-1 hover:underline"
            >
              @{p.github_handle} <ExternalLink className="w-3 h-3" />
            </a>
          </CardContent>
        </Card>
      )}

      {/* Connected Profiles */}
      <Card className="glass-card">
        <CardContent className="p-5">
          <h3 className="font-display font-semibold mb-3">Connected Profiles</h3>
          <div className="space-y-2">
            {p.github_handle && (
              <div className="flex items-center gap-2 text-sm">
                <Github className="w-4 h-4" /> <span>GitHub: {p.github_handle}</span>
              </div>
            )}
            {p.linkedin_url && (
              <div className="flex items-center gap-2 text-sm">
                <ExternalLink className="w-4 h-4" /> <span>LinkedIn: {p.linkedin_url}</span>
              </div>
            )}
            {p.leetcode_handle && (
              <div className="flex items-center gap-2 text-sm">
                <Code className="w-4 h-4" /> <span>LeetCode: {p.leetcode_handle}</span>
              </div>
            )}
            {!p.github_handle && !p.linkedin_url && !p.leetcode_handle && (
              <p className="text-sm text-muted-foreground">No profiles connected yet. Go to Upload to add them.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;

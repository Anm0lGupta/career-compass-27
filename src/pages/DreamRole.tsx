import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Briefcase, Building, Sparkles, Target, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const mockDreamResult = {
  readiness: 62,
  gaps: [
    { skill: "System Design", importance: "critical", current: 20 },
    { skill: "Distributed Systems", importance: "critical", current: 15 },
    { skill: "Kubernetes", importance: "high", current: 30 },
    { skill: "GraphQL", importance: "medium", current: 45 },
  ],
  strengths: ["Python", "React", "Docker", "PostgreSQL", "Git"],
  roadmap: [
    { week: "Week 1-2", task: "Complete System Design primer", difficulty: "Hard", time_estimate: "10 hours" },
    { week: "Week 3-4", task: "Build distributed key-value store", difficulty: "Hard", time_estimate: "12 hours" },
    { week: "Week 5-6", task: "Deploy app with Kubernetes", difficulty: "Medium", time_estimate: "6 hours" },
    { week: "Week 7-8", task: "Build GraphQL API + integration tests", difficulty: "Medium", time_estimate: "8 hours" },
  ],
};

const DreamRole = () => {
  const { user, isDemo } = useAuth();
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(mockDreamResult);

  const handleAnalyze = async () => {
    if (!role) return;
    setLoading(true);

    if (isDemo) {
      setResult(mockDreamResult);
      setAnalyzed(true);
      setLoading(false);
      return;
    }

    try {
      // Get user's resume
      let resumeText = "";
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("resume_text")
          .eq("user_id", user.id)
          .single();
        resumeText = (profile as any)?.resume_text || "";
      }

      if (!resumeText) {
        toast.error("Please upload your resume first");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: { resume_text: resumeText, target_role: role, target_company: company, mode: "dream_role" },
      });
      if (error) throw error;
      setResult(data);
      setAnalyzed(true);
    } catch (err: any) {
      toast.error(err.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const r = result;

  return (
    <div className="container py-6 md:py-8 space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">Dream Role Mode</h1>
        <p className="text-sm text-muted-foreground">See how ready you are for your dream position.</p>
      </div>

      <Card className="glass-card">
        <CardContent className="p-5 space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> Target Role</Label>
            <Input placeholder="e.g. Backend Engineer" value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Building className="w-4 h-4" /> Company (optional)</Label>
            <Input placeholder="e.g. Google" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          <Button onClick={handleAnalyze} className="w-full gradient-primary border-0 rounded-full h-11" disabled={!role || loading}>
            {loading ? "Analyzing..." : <><Sparkles className="w-4 h-4 mr-1" /> Analyze Readiness</>}
          </Button>
        </CardContent>
      </Card>

      {analyzed && (
        <>
          <Card className="glass-card overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-5">
                <div className={cn(
                  "w-24 h-24 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-lg",
                  r.readiness >= 70 ? "bg-success shadow-success/20" : r.readiness >= 40 ? "gradient-primary shadow-primary/20" : "bg-destructive shadow-destructive/20"
                )}>
                  <span className="font-display text-4xl font-bold text-primary-foreground">{r.readiness}%</span>
                </div>
                <div>
                  <p className="font-display text-lg font-semibold">Readiness for {role}</p>
                  {company && <p className="text-sm text-muted-foreground">at {company}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-5">
              <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-destructive" /> Critical Gaps
              </h3>
              <div className="space-y-3">
                {r.gaps.map((g: any) => (
                  <div key={g.skill} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{g.skill}</span>
                        <Badge variant={g.importance === "critical" ? "destructive" : "secondary"} className="text-[10px] rounded-full">
                          {g.importance}
                        </Badge>
                      </div>
                      <Progress value={g.current} className="h-1.5" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-5">
              <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" /> Your Strengths
              </h3>
              <div className="flex flex-wrap gap-2">
                {r.strengths.map((s: string) => (
                  <span key={s} className="px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">{s}</span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-5">
              <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Priority Roadmap
              </h3>
              <div className="space-y-3">
                {r.roadmap.map((item: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                    <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-primary-foreground">{i + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.task}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{item.week}</span>
                        <Badge variant="outline" className="text-[10px] rounded-full">{item.difficulty}</Badge>
                        {item.time_estimate && <span className="text-xs text-muted-foreground">• {item.time_estimate}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default DreamRole;

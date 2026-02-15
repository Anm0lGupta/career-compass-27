import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Upload, Target, TrendingUp, Layers, Clock } from "lucide-react";

// Mock data for demo
const mockScore = {
  final_score: 74,
  percentile_rank: 81.4,
  percentile_label: "Top 25%",
  confidence_label: "HIGH",
  breakdown: {
    lexical_score: 62,
    semantic_score: 71,
    project_depth: 80,
    experience_score: 60,
  },
  matched_skills: ["Python", "React", "Docker", "PostgreSQL", "Git"],
  missing_skills: ["Kubernetes", "GraphQL", "CI/CD", "TypeScript"],
  best_fit_roles: [
    { role: "Full-Stack Developer", match: 87, type: "Full-time" },
    { role: "Backend Engineer", match: 79, type: "Internship" },
    { role: "DevOps Engineer", match: 65, type: "Full-time" },
  ],
  roadmap: [
    { task: "Complete Kubernetes basics course", time: "2 weeks", priority: "high" },
    { task: "Build a GraphQL API project", time: "1 week", priority: "medium" },
    { task: "Add CI/CD to existing project", time: "3 days", priority: "medium" },
  ],
};

const metricIcons = {
  lexical_score: Target,
  semantic_score: TrendingUp,
  project_depth: Layers,
  experience_score: Clock,
};

const metricLabels: Record<string, string> = {
  lexical_score: "Lexical",
  semantic_score: "Semantic",
  project_depth: "Projects",
  experience_score: "Experience",
};

const Dashboard = () => {
  const s = mockScore;

  return (
    <div className="container py-6 md:py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Your career intelligence overview</p>
        </div>
        <Button asChild size="sm" className="gradient-primary border-0 rounded-full">
          <Link to="/upload"><Upload className="w-4 h-4 mr-1" /> New Scan</Link>
        </Button>
      </div>

      {/* Score Card */}
      <Card className="glass-card overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl gradient-primary flex flex-col items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              <span className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">{s.final_score}</span>
              <span className="text-[10px] text-primary-foreground/70 font-medium">/ 100</span>
            </div>
            <div className="min-w-0">
              <p className="font-display text-lg font-semibold">Overall Score</p>
              <p className="text-sm text-muted-foreground">{s.percentile_label} of candidates</p>
              <Badge className="mt-2 rounded-full bg-success/10 text-success border-success/20 text-xs">
                {s.confidence_label} Confidence
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(s.breakdown).map(([key, value]) => {
          const Icon = metricIcons[key as keyof typeof metricIcons];
          return (
            <Card key={key} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">{metricLabels[key]}</span>
                </div>
                <p className="font-display text-2xl font-bold">{value}</p>
                <Progress value={value} className="mt-2 h-1.5" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Skills */}
      <Card className="glass-card">
        <CardContent className="p-5">
          <h3 className="font-display font-semibold mb-3">Skills Analysis</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Matched</p>
              <div className="flex flex-wrap gap-2">
                {s.matched_skills.map((sk) => (
                  <span key={sk} className="px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">{sk}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Missing</p>
              <div className="flex flex-wrap gap-2">
                {s.missing_skills.map((sk) => (
                  <span key={sk} className="px-2.5 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">{sk}</span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Fit */}
      <div>
        <h3 className="font-display font-semibold mb-3">Best Fit Roles</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
          {s.best_fit_roles.map((r) => (
            <Card key={r.role} className="glass-card min-w-[220px] snap-start shrink-0">
              <CardContent className="p-4">
                <p className="font-display font-semibold text-sm">{r.role}</p>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline" className="text-xs rounded-full">{r.type}</Badge>
                  <span className="font-display font-bold text-lg text-primary">{r.match}%</span>
                </div>
                <Progress value={r.match} className="mt-2 h-1" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Roadmap */}
      <Card className="glass-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold">Quick Roadmap</h3>
            <Link to="/roadmap" className="text-xs text-primary hover:underline flex items-center gap-1">
              View Full <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {s.roadmap.map((r, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-primary-foreground">{i + 1}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{r.task}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{r.time}</span>
                    <Badge variant={r.priority === "high" ? "destructive" : "secondary"} className="text-[10px] rounded-full px-2 py-0">
                      {r.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

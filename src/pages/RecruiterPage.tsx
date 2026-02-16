import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Download, FileText, ArrowUpDown, Shield, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface CandidateScore {
  name: string;
  final_score: number;
  lexical_score: number;
  semantic_score: number;
  project_depth: number;
  experience_score: number;
  matched_skills: string[];
  missing_skills: string[];
  summary: string;
  flags?: string[];
}

const RecruiterPage = () => {
  const { user, isDemo } = useAuth();
  const [jdTitle, setJdTitle] = useState("");
  const [jdText, setJdText] = useState("");
  const [resumes, setResumes] = useState<{ name: string; text: string }[]>([]);
  const [resumeInput, setResumeInput] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [candidates, setCandidates] = useState<CandidateScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState<string>("final_score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Weight sliders
  const [weights, setWeights] = useState({
    lexical: 25,
    semantic: 25,
    project: 25,
    experience: 25,
  });

  const addResume = () => {
    if (!resumeInput.trim()) return;
    setResumes((prev) => [...prev, { name: resumeName || `Candidate ${prev.length + 1}`, text: resumeInput }]);
    setResumeInput("");
    setResumeName("");
  };

  const getWeightedScore = (c: CandidateScore) => {
    const total = weights.lexical + weights.semantic + weights.project + weights.experience;
    if (total === 0) return c.final_score;
    return Math.round(
      (c.lexical_score * weights.lexical +
        c.semantic_score * weights.semantic +
        c.project_depth * weights.project +
        c.experience_score * weights.experience) /
        total
    );
  };

  const handleAnalyze = async () => {
    if (!jdText.trim() || resumes.length === 0) {
      toast.error("Add a job description and at least one resume");
      return;
    }
    setLoading(true);

    if (isDemo) {
      // Demo mode mock data
      setCandidates(resumes.map((r, i) => ({
        name: r.name,
        final_score: 85 - i * 12,
        lexical_score: 80 - i * 10,
        semantic_score: 78 - i * 8,
        project_depth: 90 - i * 15,
        experience_score: 70 - i * 5,
        matched_skills: ["React", "TypeScript", "Node.js"].slice(0, 3 - i),
        missing_skills: ["Kubernetes", "GraphQL"].slice(i),
        summary: `Strong candidate with ${3 - i} key skill matches.`,
        flags: i === 0 ? [] : ["Repetitive phrasing detected"],
      })));
      setLoading(false);

      if (user) {
        await supabase.from("job_descriptions").insert({ user_id: user.id, title: jdTitle || "Untitled", jd_text: jdText } as any);
      }
      return;
    }

    try {
      const results: CandidateScore[] = [];
      for (const r of resumes) {
        const { data, error } = await supabase.functions.invoke("analyze-resume", {
          body: { resume_text: r.text, jd_text: jdText, mode: "recruiter" },
        });
        if (error) throw error;
        results.push({ ...data, name: r.name });
      }
      setCandidates(results);

      if (user) {
        await supabase.from("job_descriptions").insert({ user_id: user.id, title: jdTitle || "Untitled", jd_text: jdText } as any);
      }
    } catch (err: any) {
      toast.error(err.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const sortedCandidates = [...candidates].sort((a, b) => {
    const aVal = sortKey === "final_score" ? getWeightedScore(a) : (a as any)[sortKey] ?? 0;
    const bVal = sortKey === "final_score" ? getWeightedScore(b) : (b as any)[sortKey] ?? 0;
    return sortDir === "desc" ? bVal - aVal : aVal - bVal;
  });

  const exportCSV = () => {
    const headers = ["Name", "Weighted Score", "Lexical", "Semantic", "Projects", "Experience", "Matched Skills", "Missing Skills"];
    const rows = sortedCandidates.map((c) => [
      c.name, getWeightedScore(c), c.lexical_score, c.semantic_score, c.project_depth, c.experience_score,
      `"${c.matched_skills.join(", ")}"`, `"${c.missing_skills.join(", ")}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "candidates.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  return (
    <div className="container py-6 md:py-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">Recruiter Dashboard</h1>
        <p className="text-sm text-muted-foreground">Score candidates against a job description.</p>
      </div>

      {/* JD Upload */}
      <Card className="glass-card">
        <CardContent className="p-5 space-y-4">
          <div className="space-y-2">
            <Label>Job Title</Label>
            <Input placeholder="e.g. Senior Backend Engineer" value={jdTitle} onChange={(e) => setJdTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><FileText className="w-4 h-4" /> Job Description</Label>
            <Textarea
              placeholder="Paste the full job description here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              className="min-h-[150px] resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Resumes */}
      <Card className="glass-card">
        <CardContent className="p-5 space-y-4">
          <h3 className="font-display font-semibold">Add Candidate Resumes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Candidate Name</Label>
              <Input placeholder="John Doe" value={resumeName} onChange={(e) => setResumeName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Resume Text</Label>
            <Textarea placeholder="Paste resume..." value={resumeInput} onChange={(e) => setResumeInput(e.target.value)} className="min-h-[100px] resize-none" />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={addResume} disabled={!resumeInput.trim()} className="rounded-full">
              <Upload className="w-4 h-4 mr-1" /> Add Candidate
            </Button>
            <span className="text-xs text-muted-foreground">{resumes.length} candidate(s) added</span>
          </div>
          {resumes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {resumes.map((r, i) => (
                <Badge key={i} variant="secondary" className="rounded-full cursor-pointer" onClick={() => setResumes((prev) => prev.filter((_, j) => j !== i))}>
                  {r.name} ✕
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weight Sliders */}
      <Card className="glass-card">
        <CardContent className="p-5 space-y-4">
          <h3 className="font-display font-semibold">Scoring Weights</h3>
          {(["lexical", "semantic", "project", "experience"] as const).map((key) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="capitalize">{key}</span>
                <span className="text-muted-foreground">{weights[key]}%</span>
              </div>
              <Slider value={[weights[key]]} onValueChange={(v) => setWeights((w) => ({ ...w, [key]: v[0] }))} max={100} step={5} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button onClick={handleAnalyze} className="w-full gradient-primary border-0 rounded-full h-11" disabled={loading || !jdText.trim() || resumes.length === 0}>
        {loading ? "Analyzing..." : "Score Candidates"}
      </Button>

      {/* Results */}
      {candidates.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold">Ranked Candidates</h3>
            <Button variant="outline" size="sm" className="rounded-full" onClick={exportCSV}>
              <Download className="w-4 h-4 mr-1" /> Export CSV
            </Button>
          </div>

          <Card className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => toggleSort("final_score")}>
                      <span className="flex items-center gap-1">Score <ArrowUpDown className="w-3 h-3" /></span>
                    </TableHead>
                    <TableHead>Lexical</TableHead>
                    <TableHead>Semantic</TableHead>
                    <TableHead>Projects</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Flags</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCandidates.map((c, i) => (
                    <TableRow key={c.name}>
                      <TableCell>
                        <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
                          <span className="text-[10px] font-bold text-primary-foreground">{i + 1}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold">{getWeightedScore(c)}</span>
                          <Progress value={getWeightedScore(c)} className="w-16 h-1.5" />
                        </div>
                      </TableCell>
                      <TableCell>{c.lexical_score}</TableCell>
                      <TableCell>{c.semantic_score}</TableCell>
                      <TableCell>{c.project_depth}</TableCell>
                      <TableCell>{c.experience_score}</TableCell>
                      <TableCell>
                        {(!c.flags || c.flags.length === 0)
                          ? <Shield className="w-4 h-4 text-success" />
                          : <AlertTriangle className="w-4 h-4 text-warning" />}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Skill breakdown for top candidate */}
          {sortedCandidates[0] && (
            <Card className="glass-card">
              <CardContent className="p-5">
                <h3 className="font-display font-semibold mb-3">Top Candidate: {sortedCandidates[0].name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{sortedCandidates[0].summary}</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Matched Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {sortedCandidates[0].matched_skills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Missing Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {sortedCandidates[0].missing_skills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-full bg-warning/10 text-warning text-xs">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default RecruiterPage;

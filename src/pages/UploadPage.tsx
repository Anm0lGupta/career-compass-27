import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Github, Linkedin, Code, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const steps = ["Upload Resume", "Connect Profiles", "Set Goals"];

const UploadPage = () => {
  const navigate = useNavigate();
  const { user, isDemo } = useAuth();
  const [step, setStep] = useState(0);
  const [resumeText, setResumeText] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [leetcode, setLeetcode] = useState("");
  const [goal, setGoal] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const goals = [
    { id: "internship", label: "Internship", icon: "🎓" },
    { id: "fulltime", label: "Full-time", icon: "💼" },
    { id: "dream", label: "Dream Role", icon: "🚀" },
  ];

  const handleSubmit = async () => {
    if (!resumeText.trim()) {
      toast.error("Please enter your resume text");
      return;
    }
    setLoading(true);

    try {
      // Save profile data
      if (user) {
        await supabase.from("profiles").update({
          resume_text: resumeText,
          github_handle: github || null,
          linkedin_url: linkedin || null,
          leetcode_handle: leetcode || null,
          primary_goal: goal,
        } as any).eq("user_id", user.id);
      }

      if (isDemo) {
        toast.success("Resume analyzed! Redirecting to dashboard...");
        navigate("/dashboard");
        return;
      }

      // Call AI edge function
      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: { resume_text: resumeText, goal, mode: "score" },
      });

      if (error) throw error;

      // Save scan
      if (user) {
        await supabase.from("scans").insert({
          user_id: user.id,
          score: data.final_score,
          percentile: data.percentile_rank,
          result_json: data,
          status: "completed",
        } as any);
      }

      toast.success("Resume analyzed! Redirecting to dashboard...");
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-6 md:py-8 max-w-2xl mx-auto">
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Get Started</h1>
      <p className="text-sm text-muted-foreground mb-6">Complete these steps to get your career score.</p>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
              i < step ? "gradient-primary text-primary-foreground"
                : i === step ? "gradient-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
            )}>
              {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            <span className="text-xs text-muted-foreground hidden sm:block truncate">{s}</span>
            {i < steps.length - 1 && <div className="flex-1 h-px bg-border" />}
          </div>
        ))}
      </div>

      {/* Step 1: Upload */}
      {step === 0 && (
        <Card className="glass-card">
          <CardContent className="p-6 space-y-4">
            <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium text-sm mb-1">Drag & drop your resume</p>
              <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT (max 5MB)</p>
              <p className="text-xs text-muted-foreground mt-2">— or paste text below —</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="resume" className="flex items-center gap-2"><FileText className="w-4 h-4" /> Resume Text</Label>
              <Textarea
                id="resume"
                placeholder="Paste your resume content here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="min-h-[200px] resize-none"
              />
            </div>
            <Button onClick={() => setStep(1)} className="w-full gradient-primary border-0 rounded-full h-11" disabled={!resumeText.trim()}>
              Continue <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Profiles */}
      {step === 1 && (
        <Card className="glass-card">
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">Connect your profiles for a deeper analysis. All optional.</p>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Github className="w-4 h-4" /> GitHub Username</Label>
              <Input placeholder="e.g. johndoe" value={github} onChange={(e) => setGithub(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Linkedin className="w-4 h-4" /> LinkedIn URL</Label>
              <Input placeholder="https://linkedin.com/in/..." value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Code className="w-4 h-4" /> LeetCode Handle</Label>
              <Input placeholder="e.g. johndoe" value={leetcode} onChange={(e) => setLeetcode(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)} className="rounded-full flex-1 h-11">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button onClick={() => setStep(2)} className="gradient-primary border-0 rounded-full flex-1 h-11">
                Continue <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Goals */}
      {step === 2 && (
        <Card className="glass-card">
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">What's your primary career goal?</p>
            <div className="grid grid-cols-3 gap-3">
              {goals.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={cn(
                    "p-4 rounded-xl border-2 text-center transition-all",
                    goal === g.id
                      ? "border-primary bg-accent shadow-md"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <span className="text-2xl block mb-1">{g.icon}</span>
                  <span className="text-xs font-medium">{g.label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="rounded-full flex-1 h-11">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button onClick={handleSubmit} className="gradient-primary border-0 rounded-full flex-1 h-11" disabled={!goal || loading}>
                {loading ? "Analyzing..." : "Analyze Resume"} {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UploadPage;

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Github, ExternalLink, Code } from "lucide-react";

const mockProfile = {
  name: "Alex Johnson",
  email: "alex@example.com",
  goal: "Full-time",
  github: "alexjohnson",
  resume_preview: "Experienced full-stack developer with 3 years of experience building web applications using React, Node.js, and PostgreSQL. Led a team of 4 in developing an e-commerce platform serving 10K+ users...",
  projects: [
    { name: "E-Commerce Platform", depth: 88, tech: ["React", "Node.js", "PostgreSQL"], link: "#" },
    { name: "Task Manager CLI", depth: 65, tech: ["Python", "Click"], link: "#" },
    { name: "Portfolio Website", depth: 45, tech: ["HTML", "CSS", "JS"], link: "#" },
  ],
  github_stats: {
    top_languages: ["TypeScript", "Python", "Go"],
    repos: 24,
    stars: 47,
  },
  scores: [68, 72, 74],
};

const ProfilePage = () => {
  const p = mockProfile;

  return (
    <div className="container py-6 md:py-8 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
          <User className="w-8 h-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">{p.name}</h1>
          <p className="text-sm text-muted-foreground">{p.email} • Goal: {p.goal}</p>
        </div>
      </div>

      {/* Resume */}
      <Card className="glass-card">
        <CardContent className="p-5">
          <h3 className="font-display font-semibold mb-2">Resume Preview</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{p.resume_preview}</p>
        </CardContent>
      </Card>

      {/* Projects */}
      <div>
        <h3 className="font-display font-semibold mb-3">Projects</h3>
        <div className="space-y-3">
          {p.projects.map((pr) => (
            <Card key={pr.name} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">{pr.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm">{pr.depth}</span>
                    <a href={pr.link} className="text-muted-foreground hover:text-primary">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
                <Progress value={pr.depth} className="h-1 mb-2" />
                <div className="flex flex-wrap gap-1.5">
                  {pr.tech.map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px] rounded-full px-2 py-0">{t}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* GitHub */}
      <Card className="glass-card">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Github className="w-5 h-5" />
            <h3 className="font-display font-semibold">GitHub Summary</h3>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="font-display text-xl font-bold">{p.github_stats.repos}</p>
              <p className="text-[10px] text-muted-foreground">Repos</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="font-display text-xl font-bold">{p.github_stats.stars}</p>
              <p className="text-[10px] text-muted-foreground">Stars</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="font-display text-xl font-bold">{p.github_stats.top_languages.length}</p>
              <p className="text-[10px] text-muted-foreground">Languages</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {p.github_stats.top_languages.map((l) => (
              <Badge key={l} className="rounded-full text-xs">{l}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;

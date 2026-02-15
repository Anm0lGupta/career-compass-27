import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Download, Share2, ExternalLink } from "lucide-react";

const mockRoadmap = [
  {
    week: "Week 1-2",
    items: [
      { id: "1", task: "Complete Kubernetes fundamentals course", time: "8 hours", difficulty: "Medium", resource: "https://kubernetes.io/docs", done: false },
      { id: "2", task: "Set up a local K8s cluster with minikube", time: "2 hours", difficulty: "Easy", resource: "#", done: false },
    ],
  },
  {
    week: "Week 3-4",
    items: [
      { id: "3", task: "Build a GraphQL API with Apollo Server", time: "6 hours", difficulty: "Medium", resource: "#", done: false },
      { id: "4", task: "Add authentication to GraphQL API", time: "3 hours", difficulty: "Medium", resource: "#", done: false },
    ],
  },
  {
    week: "Week 5-6",
    items: [
      { id: "5", task: "Set up CI/CD pipeline with GitHub Actions", time: "4 hours", difficulty: "Easy", resource: "#", done: false },
      { id: "6", task: "Deploy app to cloud with Docker + K8s", time: "5 hours", difficulty: "Hard", resource: "#", done: false },
    ],
  },
  {
    week: "Week 7-8",
    items: [
      { id: "7", task: "Add TypeScript to existing React project", time: "4 hours", difficulty: "Easy", resource: "#", done: false },
      { id: "8", task: "Write integration tests for API endpoints", time: "3 hours", difficulty: "Medium", resource: "#", done: false },
    ],
  },
];

const RoadmapPage = () => {
  const [roadmap, setRoadmap] = useState(mockRoadmap);

  const toggleItem = (weekIdx: number, itemIdx: number) => {
    setRoadmap((prev) =>
      prev.map((w, wi) =>
        wi === weekIdx
          ? { ...w, items: w.items.map((it, ii) => (ii === itemIdx ? { ...it, done: !it.done } : it)) }
          : w
      )
    );
  };

  const total = roadmap.flatMap((w) => w.items).length;
  const done = roadmap.flatMap((w) => w.items).filter((i) => i.done).length;

  return (
    <div className="container py-6 md:py-8 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Learning Roadmap</h1>
          <p className="text-sm text-muted-foreground">{done}/{total} tasks completed</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full"><Share2 className="w-4 h-4" /></Button>
          <Button variant="outline" size="icon" className="rounded-full"><Download className="w-4 h-4" /></Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${(done / total) * 100}%` }} />
      </div>

      {roadmap.map((week, wi) => (
        <div key={week.week}>
          <h3 className="font-display font-semibold text-sm text-muted-foreground mb-3">{week.week}</h3>
          <div className="space-y-2">
            {week.items.map((item, ii) => (
              <Card key={item.id} className="glass-card">
                <CardContent className="p-4 flex items-start gap-3">
                  <Checkbox
                    checked={item.done}
                    onCheckedChange={() => toggleItem(wi, ii)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${item.done ? "line-through text-muted-foreground" : ""}`}>
                      {item.task}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                      <Badge variant={item.difficulty === "Hard" ? "destructive" : item.difficulty === "Medium" ? "default" : "secondary"} className="text-[10px] rounded-full px-2 py-0">
                        {item.difficulty}
                      </Badge>
                      <a href={item.resource} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-0.5 hover:underline">
                        Resource <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoadmapPage;

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, TrendingUp, Map, Sparkles, ChevronRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const benefits = [
  {
    icon: Target,
    title: "Reality Check",
    description: "Get an honest, AI-powered score of your resume against real job requirements.",
  },
  {
    icon: TrendingUp,
    title: "Role Fit",
    description: "Discover which roles match your skills and where you stand among peers.",
  },
  {
    icon: Map,
    title: "Smart Roadmap",
    description: "Get a personalized week-by-week plan to close your skill gaps fast.",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">SkillSync</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Login</Link>
            <Button asChild size="sm" className="gradient-primary border-0 rounded-full px-6">
              <Link to="/auth?mode=signup">Get Started</Link>
            </Button>
          </div>
          <Button asChild size="sm" className="md:hidden gradient-primary border-0 rounded-full">
            <Link to="/auth?mode=signup">Sign Up</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-pulse-glow" />
          <div className="absolute -top-10 -left-32 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div className="max-w-xl">
              <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-6">
                  <Sparkles className="w-3 h-3" /> AI-Powered Career Intelligence
                </span>
              </motion.div>

              <motion.h1
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6"
              >
                Your AI{" "}
                <span className="gradient-text">Career Reality</span>{" "}
                Check
              </motion.h1>

              <motion.p
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-lg text-muted-foreground mb-8 leading-relaxed"
              >
                Upload your resume, get an instant AI-powered score, discover your best-fit roles,
                and follow a personalized roadmap to land your dream job.
              </motion.p>

              <motion.div
                custom={3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex flex-col sm:flex-row gap-3"
              >
                <Button asChild size="lg" className="gradient-primary border-0 rounded-full text-base h-12 px-8 shadow-lg shadow-primary/25">
                  <Link to="/demo">
                    Try Demo <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full text-base h-12 px-8">
                  <Link to="/auth?mode=signup">
                    Sign Up Free <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Right: dashboard mockup */}
            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute inset-0 gradient-primary rounded-3xl blur-2xl opacity-20 scale-95" />
                <div className="relative glass-card rounded-3xl p-6 space-y-4">
                  {/* Mock score */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center">
                      <span className="text-3xl font-display font-bold text-primary-foreground">87</span>
                    </div>
                    <div>
                      <p className="font-display font-semibold text-lg">Overall Score</p>
                      <p className="text-sm text-muted-foreground">Top 15% • High Confidence</p>
                    </div>
                  </div>
                  {/* Mock metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Lexical", value: 78 },
                      { label: "Semantic", value: 85 },
                      { label: "Projects", value: 92 },
                      { label: "Experience", value: 71 },
                    ].map((m) => (
                      <div key={m.label} className="bg-muted/50 rounded-xl p-3">
                        <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                        <div className="flex items-end gap-2">
                          <span className="font-display font-bold text-xl">{m.value}</span>
                          <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden mb-1.5">
                            <div className="h-full gradient-primary rounded-full" style={{ width: `${m.value}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Mock skills */}
                  <div className="flex flex-wrap gap-2">
                    {["Python", "React", "Docker", "PostgreSQL"].map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">{s}</span>
                    ))}
                    {["Kubernetes", "GraphQL"].map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Three steps to understand your career readiness and start improving.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <b.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative gradient-primary rounded-3xl p-8 md:p-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4 relative">
              Ready to Level Up Your Career?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto relative">
              Join thousands of students who've improved their resume scores and landed their dream roles.
            </p>
            <Button asChild size="lg" variant="secondary" className="rounded-full h-12 px-8 text-base relative">
              <Link to="/auth?mode=signup">
                Get Started Free <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-sm">SkillSync</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 SkillSync. AI-powered career intelligence.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

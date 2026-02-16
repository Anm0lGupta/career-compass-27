import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { resume_text, goal, target_role, target_company, jd_text, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (mode === "dream_role") {
      systemPrompt = `You are a career intelligence AI. Analyze the candidate's resume against their dream role and return structured data. Be realistic and honest.`;
      userPrompt = `Resume:\n${resume_text}\n\nTarget Role: ${target_role}\nCompany: ${target_company || "Any"}\n\nAnalyze how ready this candidate is for the target role.`;
    } else if (mode === "recruiter") {
      systemPrompt = `You are a recruiter AI. Score candidates against the job description. Be fair and objective.`;
      userPrompt = `Job Description:\n${jd_text}\n\nCandidate Resume:\n${resume_text}\n\nScore this candidate against the JD.`;
    } else {
      systemPrompt = `You are a career intelligence AI. Analyze the resume and return a comprehensive career score breakdown. Be realistic and honest. Consider the candidate's goal: ${goal || "general"}.`;
      userPrompt = `Resume:\n${resume_text}\n\nAnalyze this resume comprehensively.`;
    }

    const tools = [
      {
        type: "function",
        function: {
          name: mode === "dream_role" ? "dream_role_analysis" : mode === "recruiter" ? "recruiter_score" : "resume_analysis",
          description: mode === "dream_role"
            ? "Return dream role readiness analysis"
            : mode === "recruiter"
            ? "Return recruiter scoring for candidate vs JD"
            : "Return comprehensive resume analysis with scores",
          parameters: mode === "dream_role" ? {
            type: "object",
            properties: {
              readiness: { type: "number", description: "Readiness percentage 0-100" },
              gaps: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    skill: { type: "string" },
                    importance: { type: "string", enum: ["critical", "high", "medium"] },
                    current: { type: "number", description: "Current proficiency 0-100" },
                  },
                  required: ["skill", "importance", "current"],
                  additionalProperties: false,
                },
              },
              strengths: { type: "array", items: { type: "string" } },
              roadmap: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    week: { type: "string" },
                    task: { type: "string" },
                    difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
                    time_estimate: { type: "string" },
                    resource_url: { type: "string" },
                  },
                  required: ["week", "task", "difficulty", "time_estimate"],
                  additionalProperties: false,
                },
              },
            },
            required: ["readiness", "gaps", "strengths", "roadmap"],
            additionalProperties: false,
          } : mode === "recruiter" ? {
            type: "object",
            properties: {
              final_score: { type: "number" },
              lexical_score: { type: "number" },
              semantic_score: { type: "number" },
              project_depth: { type: "number" },
              experience_score: { type: "number" },
              matched_skills: { type: "array", items: { type: "string" } },
              missing_skills: { type: "array", items: { type: "string" } },
              summary: { type: "string" },
              flags: { type: "array", items: { type: "string" } },
            },
            required: ["final_score", "lexical_score", "semantic_score", "project_depth", "experience_score", "matched_skills", "missing_skills", "summary"],
            additionalProperties: false,
          } : {
            type: "object",
            properties: {
              final_score: { type: "number", description: "Overall score 0-100" },
              percentile_rank: { type: "number" },
              percentile_label: { type: "string" },
              confidence_label: { type: "string", enum: ["HIGH", "MEDIUM", "LOW"] },
              breakdown: {
                type: "object",
                properties: {
                  lexical_score: { type: "number" },
                  semantic_score: { type: "number" },
                  project_depth: { type: "number" },
                  experience_score: { type: "number" },
                },
                required: ["lexical_score", "semantic_score", "project_depth", "experience_score"],
                additionalProperties: false,
              },
              matched_skills: { type: "array", items: { type: "string" } },
              missing_skills: { type: "array", items: { type: "string" } },
              best_fit_roles: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    role: { type: "string" },
                    match: { type: "number" },
                    type: { type: "string" },
                  },
                  required: ["role", "match", "type"],
                  additionalProperties: false,
                },
              },
              roadmap: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    task: { type: "string" },
                    time: { type: "string" },
                    priority: { type: "string", enum: ["high", "medium", "low"] },
                  },
                  required: ["task", "time", "priority"],
                  additionalProperties: false,
                },
              },
              integrity_flags: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    label: { type: "string" },
                    status: { type: "string", enum: ["pass", "fail"] },
                  },
                  required: ["label", "status"],
                  additionalProperties: false,
                },
              },
            },
            required: ["final_score", "percentile_rank", "percentile_label", "confidence_label", "breakdown", "matched_skills", "missing_skills", "best_fit_roles", "roadmap", "integrity_flags"],
            additionalProperties: false,
          },
        },
      },
    ];

    const toolName = mode === "dream_role" ? "dream_role_analysis" : mode === "recruiter" ? "recruiter_score" : "resume_analysis";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools,
        tool_choice: { type: "function", function: { name: toolName } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-resume error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

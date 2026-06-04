// import type { Express } from "express";
// import { createServer, type Server } from "http";
// import { storage } from "./storage";
// import { api } from "@shared/routes";
// import { z } from "zod";
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
//   baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
// });

// export async function registerRoutes(
//   httpServer: Server,
//   app: Express
// ): Promise<Server> {

//   app.get(api.scans.list.path, async (req, res) => {
//     const scans = await storage.getScans();
//     res.json(scans);
//   });

//   app.get(api.scans.get.path, async (req, res) => {
//     const scan = await storage.getScan(Number(req.params.id));
//     if (!scan) {
//       return res.status(404).json({ message: "Scan not found" });
//     }
//     res.json(scan);
//   });

//   app.post(api.scans.create.path, async (req, res) => {
//     try {
//       const input = api.scans.create.input.parse(req.body);

//       const prompt = `You are an expert Applicant Tracking System (ATS).
// Please analyze the following resume against the provided job description.
// Provide an ATS score from 0 to 100 representing how well the resume matches the job description.
// Provide a detailed JSON analysis with the following format:
// {
//   "score": number,
//   "matchingKeywords": [string, ...],
//   "missingKeywords": [string, ...],
//   "suggestions": [string, ...]
// }

// Resume:
// ${input.resumeText}

// Job Description:
// ${input.jobDescription}
// `;

//       const response = await openai.chat.completions.create({
//         model: "gpt-5.1",
//         messages: [{ role: "user", content: prompt }],
//         response_format: { type: "json_object" },
//       });

//       const analysisRaw = JSON.parse(response.choices[0]?.message?.content || "{}");
//       const score = typeof analysisRaw.score === "number" ? analysisRaw.score : 0;

//       // Ensure the analysis object has the expected keys even if LLM misses them
//       const analysis = {
//         matchingKeywords: Array.isArray(analysisRaw.matchingKeywords) ? analysisRaw.matchingKeywords : [],
//         missingKeywords: Array.isArray(analysisRaw.missingKeywords) ? analysisRaw.missingKeywords : [],
//         suggestions: Array.isArray(analysisRaw.suggestions) ? analysisRaw.suggestions : []
//       };

//       const scan = await storage.createScan({
//         resumeText: input.resumeText,
//         jobDescription: input.jobDescription,
//         score,
//         analysis
//       });

//       res.status(201).json(scan);
//     } catch (err) {
//       if (err instanceof z.ZodError) {
//         return res.status(400).json({
//           message: err.errors[0].message,
//           field: err.errors[0].path.join('.'),
//         });
//       }
//       console.error("Error creating scan:", err);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   });

//   return httpServer;
// }

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.get(api.scans.list.path, async (req, res) => {
    try {
      const scans = await storage.getScans();
      res.json(scans);
    } catch (err) {
      console.error("Error fetching scans:", err);
      res.status(500).json({ message: "Failed to fetch scans" });
    }
  });

  app.get(api.scans.get.path, async (req, res) => {
    try {
      const scan = await storage.getScan(Number(req.params.id));
      if (!scan) {
        return res.status(404).json({ message: "Scan not found" });
      }
      res.json(scan);
    } catch (err) {
      console.error("Error fetching scan:", err);
      res.status(500).json({ message: "Failed to fetch scan" });
    }
  });

  app.post(api.scans.create.path, async (req, res) => {
    try {
      const input = api.scans.create.input.parse(req.body);

      const prompt = `
You are an expert Applicant Tracking System (ATS).

Analyze the resume against the job description.

Return ONLY valid JSON in this format:
{
  "score": number,
  "matchingKeywords": string[],
  "missingKeywords": string[],
  "suggestions": string[]
}

Resume:
${input.resumeText}

Job Description:
${input.jobDescription}
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content || "{}";

      let analysisRaw;
      try {
        analysisRaw = JSON.parse(content);
      } catch {
        analysisRaw = {
          score: 0,
          matchingKeywords: [],
          missingKeywords: [],
          suggestions: ["Failed to parse AI response"],
        };
      }

      const score =
        typeof analysisRaw.score === "number" ? analysisRaw.score : 0;

      const analysis = {
        matchingKeywords: Array.isArray(analysisRaw.matchingKeywords)
          ? analysisRaw.matchingKeywords
          : [],
        missingKeywords: Array.isArray(analysisRaw.missingKeywords)
          ? analysisRaw.missingKeywords
          : [],
        suggestions: Array.isArray(analysisRaw.suggestions)
          ? analysisRaw.suggestions
          : [],
      };

      const scan = await storage.createScan({
        resumeText: input.resumeText,
        jobDescription: input.jobDescription,
        score,
        analysis,
      });

      res.status(201).json(scan);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }

      console.error("Error creating scan:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}

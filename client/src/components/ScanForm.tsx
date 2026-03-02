import { useState } from "react";
import { useCreateScan } from "@/hooks/use-scans";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, FileText, Briefcase, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScanForm() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState("");
  
  const [, setLocation] = useLocation();
  const createScan = useCreateScan();

  const handleSubmit = async () => {
    setError("");
    
    if (!resumeText.trim()) {
      setError("Please paste your resume text.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please paste the job description.");
      return;
    }

    try {
      const result = await createScan.mutateAsync({
        resumeText,
        jobDescription,
      });
      // Redirect to the new scan detail page
      setLocation(`/scan/${result.id}`);
    } catch (err: any) {
      setError(err.message || "An error occurred while analyzing.");
    }
  };

  const isPending = createScan.isPending;

  return (
    <div className="relative">
      <AnimatePresence>
        {isPending && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-3xl border border-white/20"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full w-20 h-20 animate-pulse" />
              <Loader2 className="w-20 h-20 text-primary animate-spin relative z-10" />
            </div>
            <h3 className="mt-8 text-2xl font-bold text-foreground">AI is analyzing your fit...</h3>
            <p className="mt-2 text-muted-foreground max-w-md text-center">
              Comparing semantics, formatting, and keywords against the job description.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn("glass-card rounded-3xl p-6 md:p-8 transition-all duration-300", isPending && "opacity-50 pointer-events-none scale-[0.98]")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          
          {/* Resume Column */}
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <FileText className="w-4 h-4" />
              </div>
              Your Resume
            </label>
            <textarea
              className="w-full h-64 md:h-80 resize-none rounded-2xl bg-muted/50 border-2 border-transparent p-5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-background transition-all duration-200 fancy-scrollbar"
              placeholder="Paste your full resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              disabled={isPending}
            />
          </div>

          {/* Job Description Column */}
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                <Briefcase className="w-4 h-4" />
              </div>
              Job Description
            </label>
            <textarea
              className="w-full h-64 md:h-80 resize-none rounded-2xl bg-muted/50 border-2 border-transparent p-5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-indigo-500/50 focus:bg-background transition-all duration-200 fancy-scrollbar"
              placeholder="Paste the job description you are targeting..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={isPending}
            />
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-4 rounded-xl border border-destructive/20"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isPending || !resumeText || !jobDescription}
            className="relative group overflow-hidden px-8 py-4 rounded-2xl font-bold text-white shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-indigo-500 to-primary bg-[length:200%_auto] group-hover:animate-gradient" />
            <div className="relative flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span>Analyze Match Score</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

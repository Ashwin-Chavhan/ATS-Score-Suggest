import { useRoute, Link } from "wouter";
import { useScan } from "@/hooks/use-scans";
import { ScoreRing } from "@/components/ScoreRing";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, XCircle, Lightbulb, FileText, Briefcase } from "lucide-react";
import type { ScanAnalysis } from "@/types";

export default function ScanDetail() {
  const [, params] = useRoute("/scan/:id");
  const scanId = params?.id ? parseInt(params.id) : null;
  const { data: scan, isLoading, isError } = useScan(scanId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading scan details...</p>
        </div>
      </div>
    );
  }

  if (isError || !scan) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <XCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Scan Not Found</h2>
        <p className="text-muted-foreground mb-8">We couldn't find the requested analysis.</p>
        <Link 
          href="/" 
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          Return Home
        </Link>
      </div>
    );
  }

  // Type cast the JSONB field
  const analysis = scan.analysis as ScanAnalysis;

  // Animation variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Top Navigation */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link 
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div 
          variants={containerVars}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left Column: Score & Summary */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div variants={itemVars} className="glass-card rounded-3xl p-8 flex flex-col items-center text-center">
              <h2 className="text-xl font-bold text-foreground mb-6">ATS Match Score</h2>
              <ScoreRing score={scan.score} size={180} strokeWidth={14} />
              
              <div className="mt-8 text-sm text-muted-foreground bg-muted/50 p-4 rounded-2xl w-full">
                Scanned on {formatDate(scan.createdAt)}
              </div>
            </motion.div>

            {analysis.summary && (
              <motion.div variants={itemVars} className="glass-card rounded-3xl p-6">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <SparklesIcon className="w-4 h-4" />
                  </div>
                  Overall Summary
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {analysis.summary}
                </p>
              </motion.div>
            )}
          </div>

          {/* Right Column: Detailed Analysis */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Keywords Analysis */}
            <motion.div variants={itemVars} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Matching */}
              <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold">Matching Keywords</h3>
                </div>
                
                {analysis.matchingKeywords && analysis.matchingKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysis.matchingKeywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-lg text-sm font-medium border border-emerald-200 dark:border-emerald-500/20">
                        {kw}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No major keywords matched.</p>
                )}
              </div>

              {/* Missing */}
              <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold">Missing Keywords</h3>
                </div>
                
                {analysis.missingKeywords && analysis.missingKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1.5 bg-destructive/5 text-destructive rounded-lg text-sm font-medium border border-destructive/20">
                        {kw}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Great job! You hit most keywords.</p>
                )}
              </div>

            </motion.div>

            {/* Actionable Suggestions */}
            <motion.div variants={itemVars} className="bg-card rounded-3xl p-6 md:p-8 border border-border/50 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Lightbulb className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Actionable Suggestions</h3>
                  <p className="text-sm text-muted-foreground">Implement these to improve your score.</p>
                </div>
              </div>
              
              {analysis.suggestions && analysis.suggestions.length > 0 ? (
                <ul className="space-y-4">
                  {analysis.suggestions.map((suggestion, i) => (
                    <li key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-muted/30 border border-transparent hover:border-border transition-colors">
                      <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center text-xs font-bold text-muted-foreground border border-border shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-foreground leading-relaxed">{suggestion}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Your resume looks solid. Keep it up!</p>
              )}
            </motion.div>

            {/* Raw Input Data Collapsible (Optional UX enhancement, just showing cleanly here) */}
            <motion.div variants={itemVars} className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2 text-muted-foreground">
                  <FileText className="w-4 h-4" /> Submitted Resume
                </h4>
                <div className="p-5 rounded-2xl bg-muted/30 border border-border/50 text-sm text-muted-foreground h-64 overflow-y-auto fancy-scrollbar whitespace-pre-wrap">
                  {scan.resumeText}
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="w-4 h-4" /> Target Job Description
                </h4>
                <div className="p-5 rounded-2xl bg-muted/30 border border-border/50 text-sm text-muted-foreground h-64 overflow-y-auto fancy-scrollbar whitespace-pre-wrap">
                  {scan.jobDescription}
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Just a helper icon inside this file since it's not exported globally
function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  )
}

import { motion } from "framer-motion";
import { Link } from "wouter";
import { ScanForm } from "@/components/ScanForm";
import { useScans } from "@/hooks/use-scans";
import { ScoreRing } from "@/components/ScoreRing";
import { formatDate } from "@/lib/utils";
import { ChevronRight, Target, Zap, LayoutTemplate } from "lucide-react";

export default function Home() {
  const { data: scans, isLoading } = useScans();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24">
        {/* Header/Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 border border-primary/20">
              <Target className="w-4 h-4" />
              Beat the Applicant Tracking System
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-balance">
              Land more interviews with <span className="text-gradient">AI-powered</span> insights.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Instantly compare your resume against any job description. Uncover missing keywords, fix formatting issues, and optimize your profile to get past the bots.
            </p>
          </motion.div>
        </div>

        {/* Main Action Area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10"
        >
          <ScanForm />
        </motion.div>

        {/* Features/Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 mb-24">
          {[
            { icon: Target, title: "Keyword Optimization", desc: "Identify exact phrases the ATS is looking for and naturally integrate them." },
            { icon: Zap, title: "Instant Feedback", desc: "Get actionable suggestions in seconds, not days. Iterate fast." },
            { icon: LayoutTemplate, title: "Format Checking", desc: "Ensure your structure is machine-readable and easily parsed by recruiters." },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="p-6 rounded-3xl bg-card border border-border/50 shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Scans Section */}
        <div className="mt-16 border-t border-border/50 pt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              Recent Scans
            </h2>
          </div>

          {isLoading ? (
            <div className="flex gap-4 overflow-x-auto pb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-w-[300px] h-[160px] bg-muted animate-pulse rounded-3xl border border-border/50" />
              ))}
            </div>
          ) : scans && scans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scans.map((scan, index) => (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link 
                    href={`/scan/${scan.id}`}
                    className="block group h-full bg-card rounded-3xl p-6 border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <ScoreRing score={scan.score} size={60} strokeWidth={6} animate={false} />
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                    
                    <p className="text-sm text-foreground font-medium line-clamp-2 mb-3">
                      {scan.jobDescription.substring(0, 80)}...
                    </p>
                    
                    <div className="text-xs text-muted-foreground font-medium">
                      {formatDate(scan.createdAt)}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted/30 rounded-3xl border border-dashed border-border">
              <p className="text-muted-foreground">You haven't optimized any resumes yet.</p>
              <p className="text-sm mt-2 font-medium">Use the form above to run your first scan!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

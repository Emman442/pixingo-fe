
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PuzzleGrid } from "@/components/game/PuzzleGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Timer, CheckCircle2 } from "lucide-react";
import { MATCH_ROUNDS } from "@/app/lib/game-data";

export default function PlayPage() {
  const router = useRouter();
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);

  const round = MATCH_ROUNDS[currentRound];

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleNextRound("");
    }
  }, [timeLeft]);

  const handleNextRound = (submittedAnswer: string) => {
    const newAnswers = [...answers, submittedAnswer];
    setAnswers(newAnswers);
    setIsSubmitting(true);

    setTimeout(() => {
      if (currentRound < MATCH_ROUNDS.length - 1) {
        setCurrentRound(currentRound + 1);
        setTimeLeft(30);
        setAnswer("");
        setIsSubmitting(false);
      } else {
        localStorage.setItem('visionquest_answers', JSON.stringify(newAnswers));
        router.push("/consensus");
      }
    }, 1500);
  };

  const progressValue = ((currentRound + 1) / MATCH_ROUNDS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-md mx-auto space-y-6">
      {/* Top Bar */}
      <header className="space-y-4">
        <div className="flex justify-between items-center text-xs font-headline tracking-widest uppercase">
          <div className="text-muted-foreground">
            Round <span className="text-white">{currentRound + 1}</span> of <span className="text-white">4</span>
          </div>
          <div className={`flex items-center gap-2 ${timeLeft < 10 ? 'text-destructive' : 'text-accent'}`}>
            <Timer size={14} />
            <span className="tabular-nums">{timeLeft}S</span>
          </div>
        </div>
        <Progress value={progressValue} className="h-1.5 bg-white/5" />
        <div className="flex gap-2">
          {MATCH_ROUNDS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                i < currentRound ? 'bg-primary' : i === currentRound ? 'bg-primary/30' : 'bg-white/5'
              }`}
            />
          ))}
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRound}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-8"
          >
            <PuzzleGrid images={round.images} />

            <div className="space-y-4">
              <div className="relative">
                <Input
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="What connects these images?"
                  className="py-8 px-6 text-lg bg-white/5 border-2 border-white/10 rounded-2xl focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                  disabled={isSubmitting}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && answer.trim() && handleNextRound(answer)}
                />
                <AnimatePresence>
                  {isSubmitting && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl flex items-center justify-center space-x-2 text-primary"
                    >
                      <CheckCircle2 size={24} className="animate-bounce" />
                      <span className="font-headline uppercase tracking-widest text-sm font-bold">Answer Locked</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button
                onClick={() => handleNextRound(answer)}
                disabled={!answer.trim() || isSubmitting}
                className="w-full py-8 text-lg font-headline uppercase tracking-[0.2em] bg-primary hover:bg-primary/90 rounded-2xl shadow-xl transition-all"
              >
                Submit Answer
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="text-center">
        <p className="text-[10px] text-muted-foreground/30 uppercase tracking-widest font-medium">
          VisionQuest Semantic Verification Active
        </p>
      </footer>
    </div>
  );
}


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, ShieldCheck, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function LobbyPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const startSequence = () => {
    setIsStarting(true);
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown !== null) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        router.push("/play");
      }
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <Link href="/" className="absolute top-6 left-6 text-muted-foreground hover:text-white transition-colors">
        <ChevronLeft size={24} />
      </Link>

      <div className="w-full max-w-sm space-y-8">
        <header className="text-center space-y-2">
          <h2 className="text-sm font-headline uppercase tracking-[0.3em] text-primary">Match Lobby</h2>
          <p className="text-muted-foreground text-xs">Waiting for arena initialization...</p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8 flex flex-col items-center space-y-6"
        >
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-primary/20 p-1">
              <AvatarImage src="https://picsum.photos/seed/player/200/200" />
              <AvatarFallback>VQ</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-accent rounded-full p-2 text-background">
              <ShieldCheck size={20} />
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-headline font-bold">CyberRunner_99</h3>
            <div className="flex items-center justify-center mt-2 space-x-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                RANK #124
              </Badge>
              <Badge variant="outline" className="bg-accent/5 text-accent border-accent/20 flex items-center gap-1">
                <Wallet size={12} />
                0x71...4F2
              </Badge>
            </div>
          </div>

          <div className="w-full space-y-4 pt-4 border-t border-white/5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Match Type</span>
              <span className="text-white font-medium uppercase tracking-wider">Solo Arena</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Prize Pool</span>
              <span className="text-accent font-medium uppercase tracking-wider">Practice Mode</span>
            </div>
          </div>
        </motion.div>

        {!isStarting ? (
          <Button
            onClick={startSequence}
            className="w-full py-8 text-xl font-headline uppercase tracking-widest bg-primary hover:bg-primary/90 rounded-2xl shadow-[0_10px_40px_rgba(157,80,255,0.4)]"
          >
            Start Game
          </Button>
        ) : (
          <div className="h-20 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-7xl font-headline font-bold text-primary"
              >
                {countdown === 0 ? "GO!" : countdown}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

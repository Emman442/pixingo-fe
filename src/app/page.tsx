
"use client";

import { motion } from "framer-motion";
import { Trophy, Users, Zap, Gamepad2, Info, ListOrdered } from "lucide-react";
import { GameModeCard } from "@/components/game/GameModeCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col px-6 py-12 max-w-md mx-auto space-y-12 pb-24">
      <header className="text-center space-y-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-primary text-xs font-medium uppercase tracking-widest"
        >
          <Gamepad2 size={14} />
          <span>Arena v1.1.0</span>
        </motion.div>
        
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl font-headline font-bold text-white tracking-tighter"
        >
          VISION<span className="text-primary">QUEST</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-sm"
        >
          The ultimate semantic AI puzzle arena.
        </motion.p>
      </header>

      <div className="flex gap-3">
        <Link href="/how-to-play" className="flex-1">
          <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 hover:bg-white/5 font-headline uppercase tracking-wider text-[10px]">
            <Info size={14} className="mr-2" />
            How to Play
          </Button>
        </Link>
        <Link href="/leaderboard" className="flex-1">
          <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 hover:bg-white/5 font-headline uppercase tracking-wider text-[10px]">
            <ListOrdered size={14} className="mr-2" />
            Leaderboard
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <GameModeCard
          title="Solo Arena"
          description="Play 4 rounds against AI and climb the global leaderboard."
          features={["Unlimited attempts", "Global rankings", "Practice mode"]}
          cta="Start Solo Run"
          href="/lobby"
          icon={Zap}
          variant="primary"
        />
        
        <GameModeCard
          title="Duel Arena"
          description="Challenge another player and compete for rewards."
          features={["1v1 gameplay", "Winner takes the pot", "AI-verified results"]}
          cta="Find Opponent"
          href="/lobby?mode=duel"
          icon={Users}
          variant="secondary"
        />
        
        <GameModeCard
          title="Battle Royale"
          description="Compete against up to 50 players across multiple rounds."
          features={["Live leaderboard", "Elimination rounds", "Massive reward pools"]}
          cta="Join Royale"
          href="/lobby?mode=royale"
          icon={Trophy}
          variant="accent"
        />
      </div>

      <footer className="pt-8 text-center">
        <p className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em]">
          Powered by GenLayer AI Consensus
        </p>
      </footer>
    </div>
  );
}


"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useFirestore, useUser, useDoc } from "@/firebase";
import { doc, setDoc, updateDoc, onSnapshot, serverTimestamp, collection, getDocs, query, where, limit } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, ShieldCheck, ChevronLeft, Loader2, Users } from "lucide-react";
import { ChatBox } from "@/components/game/ChatBox";
import Link from "next/link";

export default function LobbyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "solo";
  const { user, loading: authLoading } = useUser();
  const firestore = useFirestore();

  const [lobbyId, setLobbyId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Initialize Lobby
  useEffect(() => {
    if (!firestore || !user || authLoading) return;

    const findOrCreateLobby = async () => {
      // For Solo, we just use a private-ish lobby ID or skip the cloud part for now
      // But let's make it work via Firestore for all modes to show real-time state
      
      const lobbiesRef = collection(firestore, "lobbies");
      const q = query(
        lobbiesRef, 
        where("mode", "==", mode), 
        where("status", "==", "waiting"),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      let targetId = "";

      if (!querySnapshot.empty && mode !== "solo") {
        targetId = querySnapshot.docs[0].id;
      } else {
        const newLobbyRef = doc(lobbiesRef);
        targetId = newLobbyRef.id;
        await setDoc(newLobbyRef, {
          mode,
          status: "waiting",
          players: {},
          createdAt: serverTimestamp(),
        });
      }

      setLobbyId(targetId);

      // Join the lobby
      const lobbyDocRef = doc(firestore, "lobbies", targetId);
      await updateDoc(lobbyDocRef, {
        [`players.${user.uid}`]: {
          name: user.displayName || `Runner_${user.uid.slice(0, 4)}`,
          photoUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/200/200`,
          isReady: false,
        }
      });
    };

    findOrCreateLobby();
  }, [firestore, user, authLoading, mode]);

  // Subscribe to Lobby State
  const lobbyRef = useMemo(() => lobbyId ? doc(firestore!, "lobbies", lobbyId) : null, [firestore, lobbyId]);
  const { data: lobby } = useDoc(lobbyRef);

  const players = lobby?.players ? Object.entries(lobby.players).map(([uid, data]: [string, any]) => ({ uid, ...data })) : [];
  const myPlayer = players.find(p => p.uid === user?.uid);
  const allReady = players.length > 0 && players.every(p => p.isReady) && (mode === "solo" || players.length >= 2);

  // Ready Toggle
  const toggleReady = () => {
    if (!lobbyId || !user || !firestore) return;
    updateDoc(doc(firestore, "lobbies", lobbyId), {
      [`players.${user.uid}.isReady`]: !myPlayer?.isReady
    });
  };

  // Countdown Logic
  useEffect(() => {
    if (allReady && countdown === null) {
      setCountdown(3);
    } else if (!allReady) {
      setCountdown(null);
    }

    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      router.push(`/play?lobbyId=${lobbyId}`);
    }
  }, [allReady, countdown, router, lobbyId]);

  if (authLoading || !lobbyId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-muted-foreground font-headline uppercase tracking-widest text-xs">Initializing Arena...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background overflow-x-hidden">
      <Link href="/" className="absolute top-6 left-6 text-muted-foreground hover:text-white transition-colors">
        <ChevronLeft size={24} />
      </Link>

      <div className="w-full max-w-md space-y-6 pt-12">
        <header className="text-center space-y-2">
          <h2 className="text-sm font-headline uppercase tracking-[0.3em] text-primary">{mode} Arena</h2>
          <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Lobby ID: {lobbyId.slice(0, 8)}...
          </div>
        </header>

        {/* Players List */}
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {players.map((player) => (
              <motion.div
                key={player.uid}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`glass-card rounded-2xl p-4 flex items-center justify-between border-2 ${player.isReady ? 'border-primary/40' : 'border-white/5'}`}
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={player.photoUrl} />
                    <AvatarFallback>{player.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-headline font-bold text-sm">{player.name}</h4>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {player.uid === user?.uid ? "You" : "Opponent"}
                    </span>
                  </div>
                </div>
                <Badge variant={player.isReady ? "default" : "outline"} className={player.isReady ? "bg-primary" : "text-muted-foreground"}>
                  {player.isReady ? "READY" : "WAITING"}
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Multi-player specific prompt */}
        {mode !== "solo" && players.length < 2 && (
          <div className="text-center p-4 rounded-xl bg-white/5 border border-dashed border-white/10">
            <Users className="mx-auto mb-2 text-muted-foreground/50" size={24} />
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Waiting for opponent to enter the rift...</p>
          </div>
        )}

        {/* Chat System */}
        <ChatBox lobbyId={lobbyId} />

        <div className="pt-4">
          {countdown === null ? (
            <Button
              onClick={toggleReady}
              className={`w-full py-8 text-xl font-headline uppercase tracking-widest rounded-2xl shadow-xl transition-all ${
                myPlayer?.isReady 
                  ? 'bg-muted text-white hover:bg-muted/80' 
                  : 'bg-primary text-white hover:bg-primary/90 shadow-[0_10px_40px_rgba(157,80,255,0.4)]'
              }`}
            >
              {myPlayer?.isReady ? "Cancel Ready" : "Mark as Ready"}
            </Button>
          ) : (
            <div className="h-20 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={countdown}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  exit={{ scale: 2, opacity: 0 }}
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
    </div>
  );
}

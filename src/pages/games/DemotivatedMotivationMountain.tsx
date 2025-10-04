import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next"; // 1. Import hook
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function StepClimber() {
  const { t } = useTranslation(); // 2. Initialize hook
  const [stepsClimbed, setStepsClimbed] = useState(0);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<string>("");

  // Get translated motivational messages
  const motivationalMessages = t('emotionGames.games.demotivated.motivationalMessages', { returnObjects: true }) as string[];

  /* Fetch current user */
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || "demo-user");
    };
    fetchUser();
  }, []);

  /* Load previous steps */
  useEffect(() => {
    if (!userId) return;
    const loadData = async () => {
      const { data, error } = await supabase
        .from("emotion_games")
        .select("content")
        .eq("user_id", userId)
        .eq("emotion", "Demotivated")
        .single();

      if (!error && data?.content) {
        const content = data.content as { steps_climbed?: number };
        setStepsClimbed(content.steps_climbed ?? 0);
      }
    };
    loadData();
  }, [userId]);

  /* Save steps */
  const saveSteps = async (newSteps: number) => {
    setStepsClimbed(newSteps);
    const { error } = await supabase.from("emotion_games").upsert({
      user_id: userId,
      emotion: "Demotivated",
      content: { steps_climbed: newSteps },
    });
    if (error) console.error(error);
  };

  /* Handle SPACE press */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        const success = Math.random() > 0.2; // 80% chance to climb
        if (success) {
          const newSteps = stepsClimbed + 1;
          saveSteps(newSteps);
          if (newSteps % 3 === 0) {
            setMessage(
              motivationalMessages[
                Math.floor(Math.random() * motivationalMessages.length)
              ]
            );
          } else {
            setMessage("");
          }
        } else {
          const newSteps = Math.max(0, stepsClimbed - 1); // slip back
          saveSteps(newSteps);
          setMessage(t('emotionGames.games.demotivated.slipMessage'));
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [stepsClimbed, motivationalMessages]); // Add motivationalMessages to dependency array

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-indigo-950 to-black flex flex-col items-center p-6 relative overflow-hidden text-white">
      {/* Header */}
      <header className="w-full flex justify-between items-center mb-4">
        <Link to="/emotion-games">
          <Button variant="ghost" size="sm" className="text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('emotionGames.games.demotivated.backButton')}
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-yellow-300">
          {t('emotionGames.games.demotivated.title')}
        </h1>
        <div className="text-lg font-semibold text-yellow-300">
          {t('emotionGames.games.demotivated.stepsLabel', { count: stepsClimbed })}
        </div>
      </header>

      {/* Mountain visualization */}
      <div className="relative w-full max-w-md h-[400px] bg-gradient-to-b from-green-100 to-green-300 rounded-lg shadow-inner flex flex-col-reverse justify-start items-center overflow-hidden">
        <motion.div
          className="absolute bottom-0 left-1/2 w-0 h-0 border-l-[100px] border-r-[100px] border-b-[300px] border-transparent border-b-green-400"
          style={{ transform: "translateX(-50%)" }}
        />
        {Array.from({ length: stepsClimbed }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="absolute bg-green-200 text-xs rounded px-2 py-1 shadow text-green-800"
            style={{ bottom: `${20 + i * 25}px`, left: "50%", transform: "translateX(-50%)" }}
          >
            {t('emotionGames.games.demotivated.stepIndicator', { count: i + 1 })}
          </motion.div>
        ))}
      </div>

      {/* Motivational message */}
      {message && (
        <p className="mt-6 text-green-200 text-center text-lg font-semibold">
          {message}
        </p>
      )}

      {/* Instructions */}
      <p className="mt-4 text-green-200 text-center max-w-md" dangerouslySetInnerHTML={{ __html: t('emotionGames.games.demotivated.instructions').replace('SPACE', '<span class="font-bold">SPACE</span>') }} />
    </div>
  );
}
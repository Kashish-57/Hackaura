import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next"; // 1. Import hook
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

function getRandomPosition() {
  return {
    left: Math.floor(Math.random() * 95) + "%",
    top: Math.floor(Math.random() * 85) + "%",
  };
}

export default function CuriousKnowledgeExplorer() {
  const { t } = useTranslation(); // 2. Initialize hook
  const [discovered, setDiscovered] = useState<string[]>([]); // Will store fact keys, e.g., "fact_0"
  const [userId, setUserId] = useState<string>("");
  const [currentFactKey, setCurrentFactKey] = useState<string | null>(null);
  const [showBigStar, setShowBigStar] = useState(false);
  const [smallStars, setSmallStars] = useState<{ left: string; top: string }[]>([]);
  const navigate = useNavigate();

  // Get the fact keys from the translation file
  const factPoolKeys = Object.keys(t('emotionGames.games.curious.facts', { returnObjects: true }));

  /* Fetch user */
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || "demo-user");
    };
    fetchUser();
  }, []);

  /* Load discovered fact keys */
  useEffect(() => {
    if (!userId) return;
    const loadData = async () => {
      const { data, error } = await supabase
        .from("emotion_games")
        .select("content")
        .eq("user_id", userId)
        .eq("emotion", "Curious")
        .single();
      if (!error && data?.content) {
        const content = data.content as { discovered?: string[] };
        setDiscovered(content.discovered ?? []);
      }
    };
    loadData();
  }, [userId]);

  /* Save discovered fact keys */
  const saveDiscovered = async (newDiscovered: string[]) => {
    setDiscovered(newDiscovered);
    const { error } = await supabase.from("emotion_games").upsert({
      user_id: userId,
      emotion: "Curious",
      content: { discovered: newDiscovered } as unknown,
    });
    if (error) console.error(error);
  };

  /* Initialize random stars */
  useEffect(() => {
    if (smallStars.length === 0 && !showBigStar) {
      let stars = [];
      for (let i = 0; i < 10; i++) {
        stars.push(getRandomPosition());
      }
      setSmallStars(stars);
    }
  }, [smallStars.length, showBigStar]);

  /* Discover new fact when a star is clicked */
  const discoverFact = () => {
    if (showBigStar) return;
    const remainingKeys = factPoolKeys.filter((key) => !discovered.includes(key));
    if (!remainingKeys.length) return;

    const factKey = remainingKeys[Math.floor(Math.random() * remainingKeys.length)];
    const newDiscovered = [...discovered, factKey];
    saveDiscovered(newDiscovered);
    setCurrentFactKey(factKey);

    let stars = [];
    for (let i = 0; i < 10; i++) {
      stars.push(getRandomPosition());
    }
    setSmallStars(stars);

    setTimeout(() => {
      setCurrentFactKey(null);
      setSmallStars([]);
      if (newDiscovered.length % 5 === 0) {
        setShowBigStar(true);
      } else {
        let stars = [];
        for (let i = 0; i < 10; i++) {
          stars.push(getRandomPosition());
        }
        setSmallStars(stars);
      }
    }, 7000);
  };

  const handleBigStarClick = () => {
    setShowBigStar(false);
    navigate("/emotion-games");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-indigo-950 to-black flex flex-col items-center p-6 relative overflow-hidden text-white">
      {/* Header */}
      <header className="w-full flex justify-between items-center mb-6">
        <Link to="/emotion-games">
          <Button variant="ghost" size="sm" className="text-white">
            <ArrowLeft className="h-4 w-4 mr-2" /> {t('emotionGames.games.curious.backButton')}
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-yellow-300">{t('emotionGames.games.curious.title')}</h1>
        <div></div> {/* Spacer for centering */}
      </header>

      {/* Stars container */}
      <div className="flex flex-col items-center mt-8 relative w-full max-w-3xl h-[400px]">
        {smallStars.map((pos, i) => (
          <div
            key={i}
            onClick={discoverFact}
            className="absolute bg-yellow-200 text-black rounded-full p-2 shadow-lg text-sm cursor-pointer select-none"
            style={{
              left: pos.left,
              top: pos.top,
              transform: `rotate(${i * 15}deg)`,
              transition: "all 0.5s ease",
            }}
            title={t('emotionGames.games.curious.starTooltip')}
          >
            ✨
          </div>
        ))}

        {currentFactKey && (
          <div className="absolute bg-yellow-100 text-black rounded-lg p-4 shadow-xl left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-xl text-center text-lg font-semibold pointer-events-none">
            {t(`emotionGames.games.curious.facts.${currentFactKey}`)}
          </div>
        )}

        {showBigStar && (
          <div
            onClick={handleBigStarClick}
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer bg-yellow-400 text-black rounded-full p-10 shadow-2xl text-3xl font-bold flex flex-col items-center justify-center select-none"
            style={{ width: "250px", height: "250px" }}
          >
            <div className="mb-4">🌟</div>
            <div>{t('emotionGames.games.curious.congratulations')}</div>
            <div className="text-center text-sm font-normal mt-2 px-4">
              {t('emotionGames.games.curious.congratsMessage')}
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <p className="mt-8 text-center text-gray-300 max-w-md">
        {t('emotionGames.games.curious.instructions')}
      </p>
    </div>
  );
}
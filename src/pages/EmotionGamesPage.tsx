import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Smile,
  CloudRain,
  Mountain,
  Zap,
  Paintbrush,
  Heart,
  Stars,
  ArrowLeft,
} from "lucide-react";

const emotionsList = [
  {
    id: "happy",
    icon: <Smile className="w-8 h-8 text-yellow-400" />,
  },
  {
    id: "sad",
    icon: <CloudRain className="w-8 h-8 text-blue-400" />,
  },
  {
    id: "demotivated",
    icon: <Mountain className="w-8 h-8 text-green-400" />,
  },
  {
    id: "angry",
    icon: <Zap className="w-8 h-8 text-red-500" />,
  },
  {
    id: "carefree",
    icon: <Paintbrush className="w-8 h-8 text-pink-400" />,
  },
  {
    id: "tensed",
    icon: <Heart className="w-8 h-8 text-purple-400" />,
  },
  {
    id: "curious",
    icon: <Stars className="w-8 h-8 text-cyan-400" />,
  },
];

export default function EmotionGamesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    // --- FIX 1: Make the main container a full-height flex column ---
    <div className="bg-background text-foreground flex flex-col h-screen">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('emotionGames.backToDashboard')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* --- FIX 2: Make the main content area flexible to fill remaining space --- */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-900 via-black to-gray-950">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-white mb-8 text-center"
        >
          {t("emotionGames.title")}
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
          {emotionsList.map((emotion, index) => (
            <motion.div
              key={emotion.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/game/${emotion.id}`)}
            >
              <Card className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-white rounded-2xl shadow-xl">
                <CardHeader className="flex flex-row items-center space-x-3">
                  {emotion.icon}
                  <CardTitle className="text-xl">{t(`emotionGames.games.${emotion.id}.name`)}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm opacity-80">
                  {t(`emotionGames.games.${emotion.id}.description`)}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
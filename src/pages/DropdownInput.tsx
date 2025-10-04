import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next"; // 1. Import hook

export function DropdownInput() {
  const { t } = useTranslation(); // 2. Initialize hook
  const [selected, setSelected] = useState<string | null>(null);

  // 3. Define moods inside the component to use the 't' function
  const moods = [
    { id: "happy", label: t('moodInput.moods.happy'), color: "bg-red-400", face: "(˶ᵔ ᵕ ᵔ˶)" },
    { id: "lonely", label: t('moodInput.moods.lonely'), color: "bg-blue-400", face: "(っ- ‸ - ς)" },
    { id: "angry", label: t('moodInput.moods.angry'), color: "bg-yellow-500", face: "(¬`‸´¬)" },
    { id: "carefree", label: t('moodInput.moods.carefree'), color: "bg-green-400", face: "(¬_¬)" },
    { id: "demotivated", label: t('moodInput.moods.demotivated'), color: "bg-purple-400", face: "¯\\_(ツ)_/¯" },
    { id: "tensed", label: t('moodInput.moods.tensed'), color: "bg-pink-400", face: "(,,•᷄‎ࡇ•᷅ ,,)?" },
    { id: "curious", label: t('moodInput.moods.curious'), color: "bg-indigo-400", face: "( •̯́ ₃ •̯̀)" },
  ];
  
  // 4. State now stores the 'id' of the mood, not the translated label
  const handleSelect = (moodId: string) => {
    setSelected(moodId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-100 p-4 font-sans flex flex-col items-center">
      <header className="w-full max-w-2xl flex items-center justify-between py-4 px-2">
        <Link to="/share-feelings">
          <Button className="bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-md">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('moodInput.back')}
          </Button>
        </Link>
      </header>

      <main className="flex flex-col items-center w-full p-2 md:p-6">
        <h1 className="text-3xl font-bold text-[#1E63F6] mb-6">
          {t('moodInput.title')}
        </h1>

        <Card className="w-full max-w-2xl bg-transparent shadow-none">
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              {moods.slice(0, 6).map((mood) => (
                <button
                  key={mood.id}
                  className={`h-32 rounded-xl shadow-lg flex flex-col justify-center items-center text-white font-semibold text-lg transition transform hover:scale-105 ${mood.color} ${
                    selected === mood.id ? "ring-4 ring-white" : ""
                  }`}
                  onClick={() => handleSelect(mood.id)}
                >
                  <span className="text-2xl">{mood.face}</span>
                  <span className="mt-2">{mood.label}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button
                key={moods[6].id}
                className={`h-32 w-32 rounded-xl shadow-lg flex flex-col justify-center items-center text-white font-semibold text-lg transition transform hover:scale-105 ${moods[6].color} ${
                  selected === moods[6].id ? "ring-4 ring-white" : ""
                }`}
                onClick={() => handleSelect(moods[6].id)}
              >
                <span className="text-2xl">{moods[6].face}</span>
                <span className="mt-2">{moods[6].label}</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {selected && (
          <Link to={`/mood-assessment/${selected}`}>
            <Button
              className="mt-8 w-full max-w-lg px-8 py-4 bg-rose-500 text-lg font-semibold hover:bg-rose-600 text-white shadow-lg"
            >
              {t('moodInput.cta')}
            </Button>
          </Link>
        )}
      </main>
    </div>
  );
}
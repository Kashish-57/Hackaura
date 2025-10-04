import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Tables } from "@/integrations/supabase/types";
import { useTranslation } from "react-i18next";

interface Question {
  id: string;
  text: string;
  options: string[];
}

interface Answers {
  [key: string]: number;
}

// Helper function to capitalize the first letter of a string
const capitalize = (s: string | undefined) => {
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
};

export function MoodAssessmentPage() {
  const { emotion } = useParams<{ emotion: string }>(); // This will be lowercase (e.g., "happy")
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const allQuestions = t('moodAssessment.questions', { returnObjects: true }) as { [key: string]: Question[] };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Answers>({});
  
  // FIX: Capitalize the emotion from the URL to match the JSON keys
  const capitalizedEmotionKey = capitalize(emotion);
  const questions = allQuestions[capitalizedEmotionKey] || [];

  const handleAssessmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOptionIndex = userAnswers[currentQuestion.id];

    if (selectedOptionIndex === undefined) {
      toast.error(t('moodAssessment.toasts.selectOption'));
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      if (!user) {
        toast.error(t('moodAssessment.toasts.mustBeLoggedIn'));
        return;
      }

      try {
        const { error } = await supabase
          .from("wellness_assessments")
          .insert({
            user_id: user.id,
            assessment_type: capitalizedEmotionKey, // Use the capitalized key here too
            answers: userAnswers,
            questions: questions,
            overall_score: null,
            recommendations: [],
            completed_at: new Date().toISOString(),
          } satisfies Tables<'wellness_assessments'>['Insert']);

        if (error) throw error;

        toast.success(t('moodAssessment.toasts.saveSuccess'));
        navigate("/progress-tracker");
      } catch (err) {
        console.error(err);
        toast.error(t('moodAssessment.toasts.saveError'));
      }
    }
  };

  if (!emotion || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground gap-4">
        <p>{t('moodAssessment.static.invalidEmotion')}</p>
        <Button onClick={() => navigate("/share-feelings")}>{t('moodAssessment.static.goBack')}</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-100 p-4 font-sans flex flex-col items-center">
      <header className="w-full max-w-2xl flex items-center justify-between py-4 px-2">
        <Link to="/share-feelings">
          <Button className="bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-md">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('moodAssessment.static.back')}
          </Button>
        </Link>
      </header>
      <main className="flex flex-col items-center w-full p-2 md:p-6">
        <h1 className="text-3xl font-bold text-[#1E63F6] mb-6">{t('moodAssessment.static.title')}</h1>
        <div className="text-lg text-gray-300 mb-4">
            {t('moodAssessment.static.youSelected')}{' '}
            {/* FIX: Use the lowercase emotion key to look up the translated mood name */}
            <span className="font-semibold">{t(`moodInput.moods.${emotion}` as any)}</span>
        </div>

        <Card className="w-full max-w-2xl bg-transparent shadow-none">
          <CardContent>
            <form onSubmit={handleAssessmentSubmit}>
              <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-inner">
                <p className="text-lg font-semibold text-gray-100 mb-4">{currentQuestion.text}</p>
                <div className="flex flex-col gap-3">
                  {currentQuestion.options.map((option, index) => (
                    <label key={index} className="flex items-center space-x-3 text-gray-200 cursor-pointer">
                      <input
                        type="radio"
                        name={currentQuestion.id}
                        value={index}
                        checked={userAnswers[currentQuestion.id] === index}
                        onChange={() => setUserAnswers({ ...userAnswers, [currentQuestion.id]: index })}
                        className="form-radio h-5 w-5 text-[#1E63F6] bg-gray-700 border-gray-600"
                        required
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <Button type="submit" className="bg-rose-500 hover:bg-rose-600 text-white">
                  {currentQuestionIndex === questions.length - 1 
                    ? t('moodAssessment.static.submit') 
                    : t('moodAssessment.static.next')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const questions = [
  {
    question: "How would you rate your overall mood today?",
    options: ["Excellent", "Good", "Neutral", "Poor", "Very Poor"],
  },
  {
    question: "How do you usually feel about your academic workload?",
    options: [
      "I can manage it easily",
      "Sometimes it feels a little too much",
      "I often feel overwhelmed",
      "I feel completely stuck and pressured",
    ],
  },
  {
    question: "How is your sleep schedule?",
    options: [
      "Regular and refreshing",
      "Slightly irregular, but manageable",
      "I often stay up late and feel tired",
      "I barely get proper rest and feel drained",
    ],
  },
  {
    question: "Do you feel supported by friends or family when you’re stressed?",
    options: [
      "Yes, always",
      "Sometimes, depending on the situation",
      "Rarely, I don’t feel understood much",
      "Not at all, I often feel alone",
    ],
  },
  {
    question: "When you sit down to study, how do you feel?",
    options: [
      "Motivated and focused",
      "I get distracted sometimes",
      "I struggle to focus most of the time",
      "I have no motivation at all",
    ],
  },
  {
    question: "How often do you feel anxious or restless?",
    options: ["Almost never", "Sometimes", "Frequently", "Almost always"],
  },
  {
    question: "How connected do you feel with people around you on campus?",
    options: [
      "Very connected",
      "Somewhat connected",
      "A little disconnected",
      "Completely isolated",
    ],
  },
  {
    question: "How often do you engage in activities that relax you (music, journaling, hobbies)?",
    options: ["Daily", "A few times a week", "Rarely", "Never"],
  },
  {
    question: "Do you feel hopeful about your future right now?",
    options: ["Very hopeful", "Somewhat hopeful", "Not very hopeful", "Not at all hopeful"],
  },
  {
    question: "How often do you feel physically tired during the day?",
    options: ["Almost never", "Sometimes", "Frequently", "Almost always"],
  },
];

export function WellnessQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (option: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = option;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true); // show results instead of just console log
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-primary">Wellness Assessment</h1>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Heart className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Wellness Assessment</h1>
            <p className="text-xl text-muted-foreground">
              Take our quiz to understand your current emotional state and get personalized recommendations.
            </p>
          </div>

          {!showResults ? (
            <>
              {/* Question Card */}
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                    Question {currentQuestion + 1} of {questions.length}
                  </CardTitle>
                  <CardDescription>
                    {questions[currentQuestion].question}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    {questions[currentQuestion].options.map((option) => (
                      <Button
                        key={option}
                        variant={answers[currentQuestion] === option ? "default" : "outline"}
                        className="justify-start text-left"
                        onClick={() => handleAnswer(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  disabled={currentQuestion === 0}
                  onClick={handlePrevious}
                >
                  Previous
                </Button>
                <Button onClick={handleNext} disabled={!answers[currentQuestion]}>
                  {currentQuestion === questions.length - 1 ? "Submit" : "Next Question"}
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Results Summary */}
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary">Your Responses</CardTitle>
                  <CardDescription>
                    Here’s a summary of your answers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {questions.map((q, idx) => (
                    <div key={idx} className="border-b border-border pb-3">
                      <p className="font-medium">{q.question}</p>
                      <p className="text-muted-foreground">{answers[idx] || "No answer given"}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Action Options */}
              <div className="flex justify-center gap-6 mt-8">
                <Link to="/ai-companion">
                  <Button className="px-6 py-3 text-lg font-semibold">
                    Talk with EmotionBot
                  </Button>
                </Link>
                <Link to="/share-feelings">
                  <Button variant="outline" className="px-6 py-3 text-lg font-semibold">
                    Share Your Feelings
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

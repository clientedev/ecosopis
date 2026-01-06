import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "wouter";

const QUESTIONS = [
  {
    id: 1,
    question: "How does your skin feel after cleansing?",
    options: ["Tight and dry", "Comfortable and clean", "Oily in some areas", "Sensitive and red"]
  },
  {
    id: 2,
    question: "How often do you experience breakouts?",
    options: ["Rarely", "Once a month", "Frequently", "Almost always"]
  },
  {
    id: 3,
    question: "What is your main skin concern?",
    options: ["Aging/Wrinkles", "Acne/Blemishes", "Dryness/Dullness", "Sensitivity"]
  }
];

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [QUESTIONS[step].id]: answer }));
    if (step < QUESTIONS.length) {
      setTimeout(() => setStep(prev => prev + 1), 300);
    }
  };

  const isComplete = step === QUESTIONS.length;

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navigation />
      
      <div className="container-width py-20 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            {!isComplete ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-10 rounded-2xl shadow-xl border border-border/50"
              >
                <div className="mb-8">
                  <span className="text-primary font-bold text-sm uppercase tracking-wider">
                    Question {step + 1} of {QUESTIONS.length}
                  </span>
                  <div className="h-2 w-full bg-secondary mt-4 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                </div>

                <h2 className="font-display text-3xl font-bold mb-8">
                  {QUESTIONS[step].question}
                </h2>

                <div className="space-y-4">
                  {QUESTIONS[step].options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className="w-full text-left p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 group flex justify-between items-center"
                    >
                      <span className="font-medium group-hover:text-primary">{option}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-10 rounded-2xl shadow-xl border border-border/50 text-center"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10" />
                </div>
                <h2 className="font-display text-3xl font-bold mb-4">Your Analysis Complete</h2>
                <p className="text-muted-foreground mb-8">
                  Based on your answers, we've identified your skin type as <strong>Combination Sensitive</strong>.
                  We recommend a gentle balancing routine.
                </p>
                
                <Link href="/products">
                  <Button size="lg" className="px-8">View Your Routine</Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

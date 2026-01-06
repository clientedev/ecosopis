import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

interface Question {
  id: number;
  text: string;
  options: { label: string; value: string }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "Como você descreveria sua pele ao acordar?",
    options: [
      { label: "Brilhante e com excesso de óleo", value: "oleosa" },
      { label: "Repuxando e com descamação", value: "seca" },
      { label: "Oleosa na zona T e seca nas bochechas", value: "mista" },
      { label: "Equilibrada, sem brilho excessivo ou secura", value: "normal" },
    ],
  },
  {
    id: 2,
    text: "Com que frequência você nota poros dilatados ou cravos?",
    options: [
      { label: "Frequentemente, em todo o rosto", value: "acneica" },
      { label: "Apenas na zona T (testa, nariz e queixo)", value: "mista" },
      { label: "Raramente", value: "normal" },
      { label: "Quase nunca, mas sinto a pele sensível", value: "sensivel" },
    ],
  },
  {
    id: 3,
    text: "Qual é o seu maior objetivo com os cuidados da pele?",
    options: [
      { label: "Controlar a oleosidade e acne", value: "controle" },
      { label: "Hidratação profunda e brilho natural", value: "hidratacao" },
      { label: "Prevenir e tratar sinais de idade", value: "antiaging" },
      { label: "Acalmar a sensibilidade e vermelhidão", value: "calmante" },
    ],
  },
];

export function SkinQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<string | null>(null);

  const handleOptionSelect = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    // Lógica simples para exemplo
    const mainType = answers[1];
    setResult(mainType);
  };

  return (
    <section className="py-24 bg-[#F4F7F4]">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold mb-4">Descubra sua Rotina Ideal</h2>
          <p className="text-muted-foreground">Responda 3 perguntas rápidas e receba uma recomendação personalizada baseada na ciência natural.</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden bg-white">
          <CardContent className="p-12">
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div
                  key={step}
                  initial={ { opacity: 0, x: 20 } }
                  animate={ { opacity: 1, x: 0 } }
                  exit={ { opacity: 0, x: -20 } }
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-sm font-bold text-primary uppercase tracking-widest">Pergunta {step + 1} de {questions.length}</span>
                    <div className="h-1.5 w-32 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500" 
                        style={ { width: `${((step + 1) / questions.length) * 100}%` } }
                      />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold leading-snug">{questions[step].text}</h3>

                  <div className="grid gap-4">
                    {questions[step].options.map((option) => (
                      <Button
                        key={option.value}
                        variant="outline"
                        className="h-auto py-6 px-8 justify-start text-left rounded-2xl hover:bg-primary/5 hover:border-primary transition-all text-lg font-medium"
                        onClick={() => handleOptionSelect(questions[step].id, option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>

                  {step > 0 && (
                    <Button variant="ghost" onClick={() => setStep(step - 1)} className="mt-4">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                    </Button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={ { opacity: 0, scale: 0.9 } }
                  animate={ { opacity: 1, scale: 1 } }
                  className="text-center space-y-8 py-8"
                >
                  <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold">Sua pele é: <span className="text-primary capitalize">{result}</span></h3>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    Com base nas suas respostas, recomendamos uma rotina focada em equilíbrio e proteção botânica.
                  </p>
                  <Button size="lg" className="rounded-full h-14 px-10 text-lg">
                    Ver Minha Recomendação
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Button>
                  <Button variant="link" onClick={() => { setStep(0); setResult(null); setAnswers({}); }} className="block mx-auto text-muted-foreground">
                    Refazer o teste
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

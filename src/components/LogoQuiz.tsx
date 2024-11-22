"use client"

import { useState, useMemo, useEffect, useReducer } from "react";

import { Loader2 } from "lucide-react";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useCountdown } from "@/hooks/useCountdown";
import { gameReducer, initialState } from "@/context/gameReducer";

const HINT_COUNTDOWN_TIMER = 10;
const CORRECT_ANSWER_DELAY = 1000;
const SHAKE_ANIMATION_DURATION = 300;
const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dcxh252ec/image/upload/w_512,f_avif,q_auto/logos%2F";

const normalizeText = (text: string): string => text.toLowerCase().replace(/\s/g, '');

export const LogoQuiz = () => {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  const [logoSrc, setLogoSrc] = useState("");
  const [isLogoLoading, setIsLogoLoading] = useState(true);
  const [triggerShake, setTriggerShake] = useState(false);
  const hintCountdown = useCountdown(10);

  const currentLogo = useMemo(() => gameState.logoData[gameState.currentLogoIndex], [gameState.currentLogoIndex]);

  const handleNext = () => {
    setIsLogoLoading(true);
    hintCountdown.reset(HINT_COUNTDOWN_TIMER);

    if (gameState.currentLogoIndex < gameState.logoData.length - 1) {
      dispatch({ type: "NEXT" });
    } else {
      dispatch({ type: "GAME_OVER" });
    }
  };

  const handleGuess = (userGuess: string) => {
    const normalizedGuess = normalizeText(userGuess);
    if (currentLogo.acceptedAnswers.some(answer => normalizeText(answer) === normalizedGuess)) {
      dispatch({ type: "GUESS_CORRECT", message: `Correct! This is ${currentLogo.name}!` });
      setTriggerShake(false);

      setTimeout(() => {
        handleNext();
      }, CORRECT_ANSWER_DELAY);
    } else {
      dispatch({ type: "GUESS_INCORRECT" });
      setTriggerShake(true);
      setTimeout(() => setTriggerShake(false), SHAKE_ANIMATION_DURATION);
    }
  };

  useEffect(() => {
    setIsLogoLoading(true);
    setLogoSrc(`${CLOUDINARY_BASE_URL}${currentLogo.fileName}`);
  }, [currentLogo]);

  if (gameState.gameOver) {
    return (
      <>
        <Fireworks autorun={{ speed: 3, duration: 5000, delay: 0 }}  />
        <Card className="w-full max-w-2xl">
          <div className="text-center px-5 py-8">
            <p className="text-4xl mb-4">Your final score:</p>
            <p className="text-4xl font-bold">{gameState.score}/{gameState.logoData.length}</p>
            <Button onClick={() => dispatch({ type: "RESET" })} className="w-full max-w-sm mt-12">Play Again</Button>
          </div>
        </Card>
      </>
    );
  }

  return (
    <Card className={cn(
      "w-full max-w-2xl mx-3",
      triggerShake ? "shake" : "",
    )}>
      <CardHeader>
        <CardTitle className="text-center">{`Logo #${gameState.currentLogoIndex + 1}/${gameState.logoData.length}`}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-48 h-48 md:w-96 lg:h-96">
            {isLogoLoading && (
              <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin" />
              </div>
            )}
            <img
              src={logoSrc}
              alt="Logo"
              className={cn(
                "object-contain",
                isLogoLoading ? "opacity-0" : "opacity-100 transition-opacity duration-200",
              )}
              onLoad={() => setIsLogoLoading(false)}
            />
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleGuess(gameState.userGuess);
          }} className="flex flex-col space-y-2 w-full max-w-sm">
            <Input
              type="text"
              value={gameState.userGuess}
              onChange={(e) => dispatch({ type: "MAKE_GUESS", userGuess: e.target.value })}
              placeholder="Enter your guess"
              className="w-full text-[16px]"
              autoFocus
            />
            <Button type="submit" disabled={gameState.isCorrect} className="w-full">
              Guess
            </Button>
          </form>
          {gameState.message && <p className="text-center">{gameState.message}</p>}
          <div className="flex gap-x-3">
            <Button onClick={handleNext} disabled={gameState.isCorrect}>Skip</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={hintCountdown.isRunning || gameState.isCorrect}
                >
                  {`Hint${hintCountdown.countdown ? ' (' + hintCountdown.countdown + ')' : '' }`}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Hint</DialogTitle>
                </DialogHeader>
                <p>{currentLogo.hint}</p>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-center w-full">{`Score: ${gameState.score} / ${gameState.logoData.length}`}</p>
      </CardFooter>
    </Card>
  );
}
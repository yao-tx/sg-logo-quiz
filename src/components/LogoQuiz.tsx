"use client"

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getRandomLogos } from "@/lib/logos";
import { Loader2 } from "lucide-react";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import { cn } from "@/lib/utils";

const normalizeText = (text: string): string => text.toLowerCase().replace(/\s/g, '');

const getInitialGameState = () => ({
  currentLogoIndex: 0,
  score: 0,
  skipsRemaining: 3,
  gameOver: false,
});

export const LogoQuiz = () => {
  const [gameState, setGameState] = useState({
    currentLogoIndex: 0,
    score: 0,
    skipsRemaining: 3,
    gameOver: false,
  });

  const [logoData, setLogoData] = useState(getRandomLogos(30));
  const [userGuess, setUserGuess] = useState("");
  const [message, setMessage] = useState("");
  const [logoSrc, setLogoSrc] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [triggerShake, setTriggerShake] = useState(false);
  const [isHintEnabled, setIsHintEnabled] = useState(false);
  const [countdown, setCountdown] = useState(10); // Start countdown at 5 seconds

  const noOfLogos = logoData.length;

  const currentLogo = useMemo(() => logoData[gameState.currentLogoIndex], [gameState.currentLogoIndex]);
  const isLastLogo = gameState.currentLogoIndex === noOfLogos - 1;

  const handleNext = useCallback(() => {
    setIsCorrect(false);
    setCountdown(10);
    setIsHintEnabled(false);

    if (isLastLogo) {
      setGameState(prev => ({ ...prev, gameOver: true }));
    } else {
      setGameState(prev => ({ ...prev, currentLogoIndex: prev.currentLogoIndex + 1 }));
      setUserGuess('');
      setMessage('');
    }
  }, [isLastLogo]);

  const handleGuess = useCallback(() => {
    const normalizedGuess = normalizeText(userGuess);

    if (currentLogo.acceptedAnswers.some(answer => normalizeText(answer) === normalizedGuess)) {
      setMessage(`Correct! This is ${currentLogo.name}!`);
      setGameState(prev => ({ ...prev, score: prev.score + 1 }));
      setIsCorrect(true);
      setUserGuess("");
      setTriggerShake(false);

      setTimeout(() => {
        handleNext();
      }, 1000);
    } else {
      setMessage("Incorrect! Try again.");
      setTriggerShake(true);

      setTimeout(() => setTriggerShake(false), 300);
    }
  }, [userGuess, currentLogo]);

  const resetGame = useCallback(() => {
    setLogoData(getRandomLogos(30));
    setGameState(getInitialGameState());
    setUserGuess("");
    setMessage("");
    setIsCorrect(false);
    setTriggerShake(false);
    setIsHintEnabled(false);
    setCountdown(10);
  }, []);

  useEffect(() => {
    setLogoSrc(`https://res.cloudinary.com/dcxh252ec/image/upload/w_512,f_avif,q_auto/logos%2F${currentLogo.fileName}`);
  }, [currentLogo]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer); // Cleanup the timer on unmount
    } else {
      setIsHintEnabled(true); // Enable button after countdown
    }
  }, [countdown]);

  if (gameState.gameOver) {
    return (
      <>
        <Fireworks autorun={{ speed: 3, duration: 5000, delay: 0 }}  />
        <Card className="w-full max-w-2xl">
          <div className="text-center px-5 py-8">
            <p className="text-4xl mb-4">Your final score:</p>
            <p className="text-4xl font-bold">{gameState.score}/{logoData.length}</p>
            <Button onClick={resetGame} className="w-full max-w-sm mt-12">Play Again</Button>
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
        <CardTitle className="text-center">{`Logo #${gameState.currentLogoIndex + 1}/${noOfLogos}`}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          {logoSrc ? (
            <img
              src={logoSrc}
              alt="Logo"
              className="w-48 h-48 md:w-96 lg:h-96 object-contain"
            />
          ): (
            <div className="w-48 h-48 md:w-96 lg:h-96 bg-neutral-100 flex items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin" />
            </div>
          )}
          <div className="flex flex-col space-y-2 w-full max-w-sm">
            <Input
              type="text"
              value={userGuess}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserGuess(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleGuess();
                }
              }}
              placeholder="Enter your guess"
              className="w-full"
              autoFocus
            />
            <Button onClick={handleGuess} disabled={isCorrect} className="w-full">
              Guess
            </Button>
          </div>
          {message && <p className="text-center">{message}</p>}
          <div className="flex gap-x-3">
            <Button onClick={handleNext} disabled={isCorrect}>Skip</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={!isHintEnabled || isCorrect}>{`Hint${countdown ? ' (' + countdown + ')' : '' }`}</Button>
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
        <p className="text-center w-full">{`Score: ${gameState.score} / ${noOfLogos}`}</p>
      </CardFooter>
    </Card>
  );
}
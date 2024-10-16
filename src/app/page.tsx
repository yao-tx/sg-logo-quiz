"use client"

import { LogoQuiz } from "@/components/LogoQuiz";
import { Instructions } from "@/components/Instructions";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [start, setStart] = useState(false);

  return (
    <>
      <main className="flex flex-col gap-8 row-start-2 justify-center items-center container mx-auto px-3">
        <h1 className="text-center text-3xl font-bold mt-8">Singapore Logo Quiz</h1>
        {start ? (
          <LogoQuiz />
        ): (
          <>
            <Instructions />
            <Button
              type="button"
              onClick={() => setStart(!start)}
            >
              Start Quiz
            </Button>
          </>
        )}
      </main>
    </>
  );
}

"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Target, Trophy, RotateCcw, Lightbulb } from "lucide-react"
import { ModeToggle } from "./ui/mode-toggle"
import Image from "next/image";
import { Level, levels } from "@/lib/levels"
import Link from "next/link"
import HighlightedRegexText from "./highlighted-regex-text"
import { motion } from "motion/react"
import { toast } from "sonner"
import { getRandomPraise } from "@/lib/praiseMessages"
import CountUpTimer from "./CountUpTimer"
import { cn } from "@/lib/utils"

export default function Game() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [regex, setRegex] = useState("");
  const [regexObj, setRegexObj] = useState<RegExp | null>(null);
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [regexError, setRegexError] = useState("")
  const [seconds, setSeconds] = useState(0);
  const [disableHighlight, setDisableHighlight] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const sfxPopRef = useRef<HTMLAudioElement | null>(null)
  const sfxVictoryRef = useRef<HTMLAudioElement | null>(null)


  const level = levels[currentLevel];

  const results = useMemo(() => {
    // if (!regex) {
    //   return level.testStrings.map((item) => ({
    //     ...item,
    //     matches: false,
    //     correct: false,
    //   }))
    // }

    try {
      const regexObj = level?.fullMatch ? new RegExp(`^${regex}$`, "i") : new RegExp(regex, "")
      // const regexObj = new RegExp(regex, "i")
      setRegexError("")
      setRegexObj(level?.fullMatch ? new RegExp(`${regex}`, "i") : new RegExp(regex, ""));
      return level.testStrings.map((item) => {
        const match = item.text.match(regexObj);

        // Validate match manually
        const matchedString = match?.[0] ?? "";
        const shouldFullMatch = level?.fullMatch;

        const matches = !!match;
        let correct = matches === item.shouldMatch;

        if (level?.requiredWord) {
          correct = matchedString.includes(level.requiredWord);
        }
        const ret = {
          ...item,
          matches,
          correct,
        }
        console.log("ret bro : ", ret);
        return ret;
      });
    } catch (error) {
      setRegexError("Invalid regular expression")
      return level.testStrings.map((item) => ({
        ...item,
        matches: false,
        correct: false,
      }))
    }
  }, [regex, level.testStrings])

  const allCorrect = results.length > 0 && results.every((r) => r.correct) && regex !== ""
  const correctCount = results.filter((r) => r.correct).length



  const handleSubmit = () => {
    setSubmitted(true);
    if (submitted && allCorrect) {
      setCurrentLevel(currentLevel + 1)
      setSubmitted(false);
      setDisableHighlight(true);
      setRegex("");
      return;
    }
    if (allCorrect) {
      const points = Math.max(100 - attempts * 10, 10)
      setScore(score + points)

      if (currentLevel < levels.length - 1) {
        // setCurrentLevel(currentLevel + 1)
        setDisableHighlight(false);
        // setRegex("")
        // setAttempts(0)
        setShowHint(false)
        toast.success(getRandomPraise(), {
          richColors: true,
          duration: 3000
        })
        const sound = new Audio('/correct.mp3'); // Make sure the path is correct
        sound.volume = .35;
        sound.play();
      } else {
        setGameComplete(true)
      }
    } else {
      setDisableHighlight(false);
      const sound = new Audio('/wrong.mp3'); // Make sure the path is correct
        sound.volume = .5;
      sound.play();
      // setAttempts(attempts + 1)
    }
  }

  const resetGame = () => {
    setCurrentLevel(0)
    setRegex("")
    setRegexObj(null);
    setScore(0)
    setAttempts(0)
    setShowHint(false)
    setGameComplete(false)
    setRegexError("")
  }


  useEffect(() => {
    sfxPopRef.current = new Audio('/pop.mp3')
    sfxPopRef.current.volume = 0.35
  }, [])
  useEffect(() => {
    sfxVictoryRef.current = new Audio('/victory.mp3')
    // sfxVictoryRef.current.volume = 0.35
  }, [])

  useEffect(() => {
    // if (!allCorrect || !sfxPopRef.current) return;
    // sfxPopRef.current.currentTime = 0
    // sfxPopRef.current.play().catch((e) => {
    //   console.error("play() failed:", e)
    // })
  }, [allCorrect])


  useEffect(() => {
    if (!gameComplete || !sfxVictoryRef.current) return;
    sfxVictoryRef.current.currentTime = 0
    sfxVictoryRef.current.play().catch((e) => {
      console.error("play() failed:", e)
    })
  }, [gameComplete])

  if (gameComplete) {
    return (
      <div className="max-w-2xl mx-auto p-3 space-y-6">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl">Congratulations!</CardTitle>
            <CardDescription>You've completed all of the ReGex challenges!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-4">Final Score: {score}</div>
            <div className="text-3xl font-bold text-green-600 mb-4">Time Elapsed: {seconds} seconds</div>
            <Button onClick={resetGame} className="gap-2 cursor-pointer">
              <RotateCcw className="w-4 h-4" />
              Play Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>


      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Badge variant="secondary" className="text-sm">
            Level {currentLevel + 1}/{levels.length}
          </Badge>
          <Badge variant="outline" className="text-sm">Score: {score}</Badge>
          <Badge variant="outline" className="text-sm">
            <CountUpTimer seconds={seconds} setSeconds={setSeconds} />
          </Badge>
          {/* <Badge variant="outline">Attempts: {attempts}</Badge> */}
        </div>
        <div>
          <Button variant="ghost" onClick={resetGame} size="sm" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          <ModeToggle />
        </div>
      </div>

      <Card className="py-4">
        <CardHeader className="px-4">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            {level.title}
          </CardTitle>
          <CardDescription>{level.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4">
          <div className="space-y-2">
            <label htmlFor="regex" className=" font-medium mb-1">
              Enter your regular expression:
            </label>

            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <Input
                  id="regex"
                  value={regex}
                  onChange={(e) => {
                    if (submitted) {
                      setSubmitted(false);
                      setDisableHighlight(false);
                    }
                    if (!e.target.value) {
                      setRegexObj(null);
                    }
                    setRegex(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && regex) {
                      handleSubmit()
                    }
                  }}
                  onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
                    e.preventDefault();
                    toast.error("Oops, no cheating!", {
                      description: "Pasting regex is not allowed. Please type it out.",
                      richColors: true,
                      duration: 2000
                    })
                  }}
                  placeholder="Enter regex pattern..."
                  className={`font-mono ${regexError ? "border-red-500" : ""}`}
                  autoComplete="off"
                />
                {regexError && <p className="text-sm text-red-500 mt-1">{regexError}</p>}
              </div>
              <div className="flex gap-2">
                {(true) && (
                  <Button onClick={handleSubmit}
                    // disabled={!allCorrect || !regex} 
                    className="gap-2 cursor-pointer" title="Submit Regex">
                    {submitted && allCorrect ? "Next" : "Submit"}
                  </Button>

                )}

                <Button onClick={() => {
                  setShowHint(true)
                }} className="gap-2 cursor-pointer" title="Show Hint">
                  <Lightbulb />
                </Button>
              </div>
            </div>
            {/* <Button onClick={() => {
              setGameComplete(true);
            }}>Victory</Button> */}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Test Strings:</h3>
              <div className="text-sm text-muted-foreground">
                {correctCount}/{level.testStrings.length} correct
              </div>
            </div>
            <div className="space-y-2">
              <TestStrings regex={regex} results={results} level={level} regexObj={regexObj} disableHighlight={disableHighlight} submitted={submitted} />
            </div>
          </div>

          {attempts > 2 && !showHint && (
            <Button variant="outline" onClick={() => setShowHint(true)} className="w-full">
              Show Hint
            </Button>
          )}

          {showHint && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Hint:</strong> {level.hint}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Copyright &copy; {new Date().getFullYear()} by{' '}
          <a href="https://github.com/dytra" target="_blank" rel="noreferrer">dytra</a>.{' '}
          All rights reserved.
        </p>
      </div>
    </>
  )
}

type TestString = {
  text: string
  shouldMatch: boolean
  matches: boolean
  correct: boolean

}
type TestStringsProps = {
  regex: string
  results: TestString[]
  level: Level
  regexObj?: RegExp | null
  disableHighlight?: boolean
  submitted: boolean
}
const TestStrings = ({
  regex,
  results,
  level,
  regexObj,
  disableHighlight,
  submitted
}: TestStringsProps
) => {
  return (
    <>
      {results.map((result, index) => (
        <motion.div
          key={`${level.id}-${index}`} // Use level.id to ensure unique keys across levels
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            bounce: 0.4,
            duration: 0.35,
            delay: index * 0.085,
            ease: "easeInOut"
          }}
          className={cn(
            "flex items-center justify-between flex-wrap p-3 rounded-lg border transition-colors",
            (submitted && !disableHighlight && regex && result.correct)
              ? "border-green-400 hover:border-green-500"
              : (submitted && !disableHighlight && regex && !result.correct)
                ? "border-red-400 hover:border-red-500"
                : "border-gray-200 hover:border-gray-300"
          )}

        // className={`flex items-center justify-between flex-wrap p-3 rounded-lg border ${regex && result.correct
        //   ? " border-green-400"
        //   : regex && !result.correct
        //     ? " border-red-400"
        //     : " border-gray-200"
        //   }`}
        >
          <code className="font-mono">
            <HighlightedRegexText
              text={result.text}
              regex={regexObj ? new RegExp(regexObj.source, regexObj.flags + "g") : null}
              disabled={!submitted}
            />
          </code>
          {/* <code className="font-mono">{result.text}</code> */}
          <div className="flex items-center gap-2">
            <Badge variant={result.shouldMatch ? "default" : "secondary"}>
              {result.shouldMatch ? "Should Match" : "Should Not Match"}
            </Badge>
            {(submitted) && (
              <div className="flex items-center gap-1">
                {result.matches && <Badge variant="outline">Matches</Badge>}
                {result.correct ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </>
  )
}
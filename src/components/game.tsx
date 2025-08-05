"use client"

import { useState, useMemo, useEffect } from "react"
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

export default function Game() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [regex, setRegex] = useState("");
  const [regexObj, setRegexObj] = useState<RegExp | null>(null);
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [regexError, setRegexError] = useState("")

  const level = levels[currentLevel]

  const results = useMemo(() => {
    if (!regex) {
      return level.testStrings.map((item) => ({
        ...item,
        matches: false,
        correct: false,
      }))
    }

    try {
      const regexObj = level?.fullMatch ? new RegExp(`^${regex}$`, "i") : new RegExp(regex, "")
      // const regexObj = new RegExp(regex, "i")
      setRegexError("")
      setRegexObj(level?.fullMatch ? new RegExp(`${regex}`, "i") : new RegExp(regex, ""));

      return level.testStrings.map((item) => {
        return {
          ...item,
          matches: regexObj.test(item.text),
          correct: regexObj.test(item.text) === item.shouldMatch,
        }
      })
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
  
  useEffect(() => {
    if(!allCorrect) return;
    const popSound = new Audio('/pop.mp3'); // Make sure the path is correct
    // popSound.volume = .35;
    popSound.play();
  },[allCorrect])

  const handleSubmit = () => {
    if (allCorrect) {
      const points = Math.max(100 - attempts * 10, 10)
      setScore(score + points)

      if (currentLevel < levels.length - 1) {
        setCurrentLevel(currentLevel + 1)
        setRegex("")
        // setAttempts(0)
        setShowHint(false)
        toast.success("Correct!", {
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
      // setAttempts(attempts + 1)
    }
  }

  const resetGame = () => {
    setCurrentLevel(0)
    setRegex("")
    setScore(0)
    setAttempts(0)
    setShowHint(false)
    setGameComplete(false)
    setRegexError("")
  }

  if (gameComplete) {
    return (
      <div className="max-w-2xl mx-auto p-3 space-y-6">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl">Congratulations!</CardTitle>
            <CardDescription>You've completed all regex challenges!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-4">Final Score: {score}</div>
            <Button onClick={resetGame} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Play Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-3 space-y-6">
      <div className="text-center space-y-2">
        <Link href={"/"}><h1 className="text-3xl font-bold">RegEx Quest <Image src={"/sword.png"} className="inline w-8 h-8 image-crisp relative bottom-1" alt={"sword regex game pixel art"} width={50} height={50} /></h1></Link>
        <p className="text-muted-foreground">Master regular expresssions through interactive challenges</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Badge variant="secondary" className="text-sm">
            Level {currentLevel + 1}/{levels.length}
          </Badge>
          <Badge variant="outline" className="text-sm">Score: {score}</Badge>
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
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  id="regex"
                  value={regex}
                  onChange={(e) => {
                    if (!e.target.value) {
                      setRegexObj(null);
                    }
                    setRegex(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && allCorrect && regex) {
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
                />
                {regexError && <p className="text-sm text-red-500 mt-1">{regexError}</p>}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSubmit} disabled={!allCorrect || !regex} className="gap-2 cursor-pointer" title="Submit Regex">
                  {allCorrect ? "Next Level" : "Check"}
                </Button>
                <Button onClick={() => {
                  setShowHint(true)
                }} className="gap-2 cursor-pointer" title="Show Hint">
                  <Lightbulb />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Test Strings:</h3>
              <div className="text-sm text-muted-foreground">
                {correctCount}/{level.testStrings.length} correct
              </div>
            </div>
            <div className="space-y-2">
              <TestStrings regex={regex} results={results} level={level} regexObj={regexObj} />
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
    </div>
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
}
const TestStrings = ({
  regex,
  results,
  level,
  regexObj,
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
          className={`flex items-center justify-between flex-wrap p-3 rounded-lg border ${regex && result.correct
            ? " border-green-400"
            : regex && !result.correct
              ? " border-red-400"
              : " border-gray-200"
            }`}
        >
          <code className="font-mono">
            <HighlightedRegexText
              text={result.text}
              regex={regexObj ? new RegExp(regexObj.source, regexObj.flags + "g") : null}
            />
          </code>
          {/* <code className="font-mono">{result.text}</code> */}
          <div className="flex items-center gap-2">
            <Badge variant={result.shouldMatch ? "default" : "secondary"}>
              {result.shouldMatch ? "Should Match" : "Should Not Match"}
            </Badge>
            {regex && (
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
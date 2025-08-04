"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Target, Trophy, RotateCcw } from "lucide-react"
import { ModeToggle } from "./ui/mode-toggle"
import Image from "next/image";

const levels = [
  {
    id: 1,
    title: "Email Validation",
    description: "Match valid email addresses",
    testStrings: [
      { text: "user@example.com", shouldMatch: true },
      { text: "test.email@domain.org", shouldMatch: true },
      { text: "invalid.email", shouldMatch: false },
      { text: "user@", shouldMatch: false },
      { text: "another@test.co.uk", shouldMatch: true },
    ],
    hint: "Look for patterns like: characters @ characters . characters",
  },
  {
    id: 2,
    title: "Phone Numbers",
    description: "Match US phone numbers in format (XXX) XXX-XXXX",
    testStrings: [
      { text: "(555) 123-4567", shouldMatch: true },
      { text: "(999) 888-7777", shouldMatch: true },
      { text: "555-123-4567", shouldMatch: false },
      { text: "(555) 123-456", shouldMatch: false },
      { text: "(123) 456-7890", shouldMatch: true },
    ],
    hint: "Pattern: (digits) digits-digits",
  },
  {
    id: 3,
    title: "Hexadecimal Colors",
    description: "Match valid hex color codes",
    testStrings: [
      { text: "#FF5733", shouldMatch: true },
      { text: "#123ABC", shouldMatch: true },
      { text: "#GGG", shouldMatch: false },
      { text: "FF5733", shouldMatch: false },
      { text: "#abc123", shouldMatch: true },
    ],
    hint: "Hex colors start with # followed by 6 hex digits (0-9, A-F)",
  },
]

export default function Game() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [regex, setRegex] = useState("")
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
      const regexObj = new RegExp(regex, "i")
      setRegexError("")

      return level.testStrings.map((item) => ({
        ...item,
        matches: regexObj.test(item.text),
        correct: regexObj.test(item.text) === item.shouldMatch,
      }))
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
    if (allCorrect) {
      const points = Math.max(100 - attempts * 10, 10)
      setScore(score + points)

      if (currentLevel < levels.length - 1) {
        setCurrentLevel(currentLevel + 1)
        setRegex("")
        setAttempts(0)
        setShowHint(false)
      } else {
        setGameComplete(true)
      }
    } else {
      setAttempts(attempts + 1)
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
      <div className="max-w-2xl mx-auto p-6 space-y-6">
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">RegEx Quest <Image src={"/sword.png"} className="inline w-10 h-10 image-crisp" alt={"sword regex game pixel art"} width={50} height={50} /></h1>
        <p className="text-muted-foreground">Master regular expresssions through interactive challenges</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Badge variant="secondary">
            Level {level.id}/{levels.length}
          </Badge>
          <Badge variant="outline">Score: {score}</Badge>
          <Badge variant="outline">Attempts: {attempts}</Badge>
        </div>
        <div>
          <Button variant="ghost" onClick={resetGame} size="sm" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          <ModeToggle />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            {level.title}
          </CardTitle>
          <CardDescription>{level.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="regex" className=" font-medium mb-1">
              Enter your regular expression:
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  id="regex"
                  value={regex}
                  onChange={(e) => setRegex(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && allCorrect && regex) {
                      handleSubmit()
                    }
                  }}
                  placeholder="Enter regex pattern..."
                  className={`font-mono ${regexError ? "border-red-500" : ""}`}
                />
                {regexError && <p className="text-sm text-red-500 mt-1">{regexError}</p>}
              </div>
              <Button onClick={handleSubmit} disabled={!allCorrect || !regex} className="gap-2">
                {allCorrect ? "Next Level" : "Check"}
              </Button>
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
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center  justify-between flex-wrap p-3 rounded-lg border ${regex && result.correct
                    ? " border-green-400"
                    : regex && !result.correct
                      ? " border-red-400"
                      : " border-gray-200"
                    }`}
                >
                  <code className="font-mono text-sm">{result.text}</code>
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
                </div>
              ))}
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
          <a href="https://dytra.github.io" target="_blank" rel="noreferrer">dytra</a>.{' '}
          All rights reserved.
        </p>
      </div>
    </div>
  )
}

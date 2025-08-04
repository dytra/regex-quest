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
    {
    id: 4,
    title: "Date Format (YYYY-MM-DD)",
    description: "Match dates in ISO format",
    testStrings: [
      { text: "2025-08-04", shouldMatch: true },
      { text: "1999-12-31", shouldMatch: true },
      { text: "04-08-2025", shouldMatch: false },
      { text: "2025/08/04", shouldMatch: false },
      { text: "2025-8-4", shouldMatch: false },
    ],
    hint: "Use \\d{4}-\\d{2}-\\d{2} to match YYYY-MM-DD format",
  },
  {
    id: 5,
    title: "Slugs",
    description: "Match URL slugs (lowercase letters, numbers, hyphens only)",
    testStrings: [
      { text: "my-cool-blog-post", shouldMatch: true },
      { text: "hello-world-123", shouldMatch: true },
      { text: "not_valid_slug!", shouldMatch: false },
      { text: "UPPERCASE", shouldMatch: false },
      { text: "contains spaces", shouldMatch: false },
    ],
    hint: "Use ^[a-z0-9-]+$ to match lowercase slugs",
  },
  {
    id: 6,
    title: "Credit Card Numbers",
    description: "Match 16-digit credit card numbers grouped as 4x4 digits",
    testStrings: [
      { text: "1234 5678 9012 3456", shouldMatch: true },
      { text: "0000 1111 2222 3333", shouldMatch: true },
      { text: "1234567890123456", shouldMatch: false },
      { text: "1234-5678-9012-3456", shouldMatch: false },
      { text: "abcd efgh ijkl mnop", shouldMatch: false },
    ],
    hint: "Each group has 4 digits separated by a space",
  },
  {
    id: 7,
    title: "Floating Point Numbers",
    description: "Match positive or negative decimal numbers",
    testStrings: [
      { text: "3.14", shouldMatch: true },
      { text: "-0.001", shouldMatch: true },
      { text: "+42.0", shouldMatch: true },
      { text: "42", shouldMatch: false },
      { text: "3,14", shouldMatch: false },
    ],
    hint: "Optional sign (+/-), digits, a dot, then digits",
  },
  {
    id: 8,
    title: "HTML Tags",
    description: "Match simple HTML tags like <b>, <div>, </p>",
    testStrings: [
      { text: "<b>", shouldMatch: true },
      { text: "</div>", shouldMatch: true },
      { text: "<img>", shouldMatch: true },
      { text: "b", shouldMatch: false },
      { text: "<<p>>", shouldMatch: false },
    ],
    hint: "Use angle brackets and optional slash",
  },
  {
    id: 9,
    title: "Password Complexity",
    description: "Match passwords with at least 1 uppercase, 1 lowercase, 1 digit, 1 special character",
    testStrings: [
      { text: "P@ssw0rd", shouldMatch: true },
      { text: "Strong#123", shouldMatch: true },
      { text: "weakpassword", shouldMatch: false },
      { text: "12345678", shouldMatch: false },
      { text: "NOspecial123", shouldMatch: false },
    ],
    hint: "Look into lookaheads for multiple requirements",
  },
  {
    id: 10,
    title: "IPv4 Addresses",
    description: "Match valid IPv4 addresses like 192.168.0.1",
    testStrings: [
      { text: "192.168.0.1", shouldMatch: true },
      { text: "8.8.8.8", shouldMatch: true },
      { text: "999.999.999.999", shouldMatch: false },
      { text: "192.168.1", shouldMatch: false },
      { text: "abc.def.ghi.jkl", shouldMatch: false },
    ],
    hint: "Use \\d{1,3}(\\.\\d{1,3}){3} and later validate range if needed",
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

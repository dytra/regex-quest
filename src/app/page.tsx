"use client";
// import Game from "@/components/game";
import Link from "next/link";
import Image from "next/image";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";

const Game = dynamic(() => import("@/components/game"), {
  ssr: false,
});

export default function Home() {
  const [gameStart, setGameStart] = useState(false)

  function handleStartGame() {
    setGameStart(true)
  }
  if (!gameStart) {
    return (
      <div id="dudu" className="flex flex-col justify-center items-center mx-auto my-auto min-h-screen p-3 space-y-6">
        <div className="text-center space-y-2">
          <Badge variant={"outline"}>
            Regex Quest
            <Image src={"/sword.png"} className="inline w-3 h-3 image-crisp relative " alt={"sword regex game pixel art"} width={50} height={50} />
          </Badge>

          <Link href={"/"}><h1 className="text-3xl font-bold">Learn Regex Through Interactive Challenges </h1></Link>
          {/* <div className="max-w-xl text-muted-foreground">
            <p>Welcome to <strong>Regex Quest</strong> — an interactive game to learn and master regular expressions through fun and challenging levels. Whether you're a beginner or a seasoned developer, sharpen your skills and conquer regex with hands-on practice.</p>
          </div> */}
          <p className="text-muted-foreground">Master regular expresssions through interactive challenges</p>
        </div>
        <Menu onGameStart={handleStartGame} />
        {/* <Card className="max-w-xl border-4 border-white mx-auto">
          <CardHeader>
            <CardTitle>What is Regex?</CardTitle>
            <CardDescription>
              A quick introduction to regular expressions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              <strong>Regex</strong> (short for <em>regular expression</em>) is a powerful tool used to
              search, match, and manipulate text based on specific patterns.
            </p>
            <p>
              It’s commonly used in programming, data validation, search engines, and text editors. For
              example, the pattern <code className="bg-muted px-1 py-0.5 rounded font-mono text-xs">^\d+$</code>{' '}
              matches a string that contains only digits.
            </p>
            Regex lets you do things like:
            <ul className="list-disc list-inside mt-1">
              <li>Check if an email is valid</li>
              <li>Find all hashtags in a tweet</li>
              <li>Replace words in a sentence</li>
            </ul>
            <p>
              While regex can look intimidating at first, learning the basics opens up a lot of power
              for text processing and automation.
            </p>
          </CardContent>
        </Card> */}
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
  return (
    <div className="max-w-4xl mx-auto p-3 space-y-6">
      <div className="text-center space-y-2">
        <Link href={"/"}><h1 className="text-3xl font-bold">RegEx Quest <Image src={"/sword.png"} className="inline w-8 h-8 image-crisp relative bottom-1" alt={"sword regex game pixel art"} width={50} height={50} /></h1></Link>
        <p className="text-muted-foreground">Master regular expresssions through interactive challenges</p>
      </div>
      {gameStart && (
        <Suspense fallback={<div><p className="text-center">Loading...</p></div>}>
          <Game />
        </Suspense>
      )}
    </div>
  );
}

const Menu = ({
  onGameStart
}: {
  onGameStart: () => void
}) => {
  return (
    <div className="flex flex-col gap-3 justify-center items-center ">
      <Button onClick={onGameStart} className="cursor-pointer" >Start Game</Button>
      <Link href="https://www.notion.so/dytra/Regex-Cheatsheet-24271709dbe18063b0f3c8f3f34147f4?source=copy_link" target="_blank"><Button variant={"outline"} className="cursor-pointer" >Cheatsheet</Button></Link>
    </div>
  )
}
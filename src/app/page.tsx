"use client";
import Game from "@/components/game";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [gameStart, setGameStart] = useState(false)

  function handleStartGame() {
    setGameStart(true)
  }
  if (!gameStart) {
    return (
      <div id="dudu" className="flex flex-col justify-center items-center mx-auto my-auto min-h-screen p-3 space-y-6">
        <div className="text-center space-y-2">
          <Link href={"/"}><h1 className="text-3xl font-bold">RegEx Quest <Image src={"/sword.png"} className="inline w-8 h-8 image-crisp relative bottom-1" alt={"sword regex game pixel art"} width={50} height={50} /></h1></Link>
          <p className="text-muted-foreground">Master regular expresssions through interactive challenges</p>
        </div>
        <Menu onGameStart={handleStartGame} />
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
        <Game />
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
    <div className="flex flex-col justify-center items-center ">
      <Button onClick={onGameStart} className="cursor-pointer" >Start Game</Button>
    </div>
  )
}
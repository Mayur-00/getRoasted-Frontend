"use client"

import { useWhiteBoard } from '@/stores/whiteboard.store'
import { Undo2, Redo2 } from 'lucide-react'
import React from 'react'

const RedoButton = () => {

  const {redoArray, redoStrokesArray, paintCanvas} = useWhiteBoard();
  const canvasRef = useWhiteBoard(
    (state) => state.canvasRef,
  ) as React.RefObject<HTMLCanvasElement> | null;

   const redo = ()=> {
     console.log("redo cliecked");

    if (!canvasRef) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    redoStrokesArray();

    paintCanvas();
  }

  return (
      <button
      name='redo-btn'
      onClick={redo}
      disabled={redoArray.length ===0}
        className="px-2 py-2 rounded text-black hover:bg-red-60 hover:text-blue-400 hover:bg-blue-200 disabled:hover:bg-transparent disabled:cursor-not-allowed disabled:text-zinc-500"
      >
        <Redo2 className="size-4" />
      </button>
  )
}

export default RedoButton
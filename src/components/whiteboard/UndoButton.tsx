"use client";

import { useWhiteBoard } from "@/stores/whiteboard.store";
import { Undo2 } from "lucide-react";
import React from "react";

const UndoButton = () => {
  const { pullStrokesOutOfArray, paintCanvas, strokesArray } = useWhiteBoard();
  const canvasRef = useWhiteBoard(
    (state) => state.canvasRef,
  ) as React.RefObject<HTMLCanvasElement> | null;

  const undo = () => {
    console.log("undo cliecked");

    if (!canvasRef) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    pullStrokesOutOfArray();

    paintCanvas();
  };

  return (
    <button
    name="undo-btn"
      onClick={undo}
      disabled={strokesArray.length === 0}
      className="px-2 py-2 rounded text-black hover:bg-red-60  hover:bg-blue-200 disabled:hover:bg-transparent disabled:cursor-not-allowed disabled:text-zinc-500"
    >
      <Undo2 className="size-4" />
    </button>
  );
};

export default UndoButton;

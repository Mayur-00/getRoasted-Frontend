import { create } from "zustand";
import { WhiteBoardStoreIntercface } from "./types";
import { Point, StrokeElemType } from "@/types/types";
import { createRef } from "react";

export const useWhiteBoard = create<WhiteBoardStoreIntercface>((set, get) => ({
  canvasRef: createRef<HTMLCanvasElement>(),
  isDrawing: false,
  isStrokeDropdownOpen: false,
  startPoint: null,
  selectedColor: "black",
  selectedStrokeWidth: 2,
  shapeType: "pen",
  currentStroke: null,
  strokesArray: [],
  redoArray: [],

  setDrawingTrue: () => set({ isDrawing: true }),
  setDrawingFalse: () => set({ isDrawing: false }),
  setStartPoint: (point: Point | null) => set({ startPoint: point }),
  setColor: (color: string) => set({ selectedColor: color }),
  setStrokeWidth: (width: number) => set({ selectedStrokeWidth: width }),
  setShapeType: (type: string) => set({ shapeType: type }),
  setCurrentStroke: (stroke: StrokeElemType | null) =>
    set({ currentStroke: stroke }),
  pushStrokesInArray: (stroke: StrokeElemType) => {
    const { strokesArray } = get();

    strokesArray.push(stroke);
  },
  pullStrokesOutOfArray: () => {
    const { strokesArray, redoArray } = get();
    if (strokesArray.length === 0) return;

    redoArray.push(strokesArray.pop()!);
  },
  redoStrokesArray: () => {
    const { strokesArray, redoArray } = get();
    if (redoArray.length === 0) return;

    strokesArray.push(redoArray.pop()!);
  },
  paintCanvas: () => {
    const { canvasRef, isDrawing, strokesArray, currentStroke } = get();

    const canvass = canvasRef as React.RefObject<HTMLCanvasElement>;

    if (!canvass) {
      return;
    }
    const canvas = canvass.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const allStrokes = currentStroke
      ? [...strokesArray, currentStroke]
      : strokesArray;

    allStrokes.forEach((stroke) => {
      ctx.beginPath();
      if (stroke === undefined) {
        return;
      }

      switch (stroke.type) {
        case "pen": {
          stroke.points.forEach((point, index) => {
            ctx.strokeStyle = stroke.color;
            ctx.lineWidth = stroke.width;
            if (index === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          break;
        }
        case "rectangle": {
          const { startPoint, endPoint } = stroke;
          if (!startPoint || !endPoint) return;
          ctx.strokeStyle = stroke.color;
          ctx.lineWidth = stroke.width;
          const x = Math.min(startPoint.x, endPoint.x);
          const y = Math.min(startPoint.y, endPoint.y);
          const w = Math.abs(endPoint.x - startPoint.x);
          const h = Math.abs(endPoint.y - startPoint.y);

          ctx.strokeRect(x, y, w, h);
          break;
        }
        case "circle": {
          const { startPoint, endPoint } = stroke;
          if (!startPoint || !endPoint) return;
          ctx.strokeStyle = stroke.color;
          ctx.lineWidth = stroke.width;
          const radius = Math.sqrt(
            Math.pow(endPoint.x - startPoint.x, 2) +
              Math.pow(endPoint.y - startPoint.y, 2),
          );
          ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
          break;
        }

        case "line": {
          const { startPoint, endPoint } = stroke;
          if (!startPoint || !endPoint) return;
          ctx.strokeStyle = stroke.color;
          ctx.lineWidth = stroke.width;
          ctx.moveTo(startPoint.x, startPoint.y);
          ctx.lineTo(endPoint.x, endPoint.y);
          break;
        }
        default: {
          console.log("nothing to print");
        }
      }

      ctx.stroke();
    });
  },
}));

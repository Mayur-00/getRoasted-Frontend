"use client";
import { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";

type ShapeType = "pen" | "circle" | "rectangle" | "line";

interface Point {
  x: number;
  y: number;
}

export default function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const socketRef = useRef(io("http://localhost:5000"));
  const [drawing, setDrawing] = useState(false);
  const [shapeType, setShapeType] = useState<ShapeType>("pen");
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const canvasImageRef = useRef<ImageData | null>(null);
  const lastRemotePointRef = useRef<Point | null>(null);
  const roomId = "1";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const socket = socketRef.current;

    ctx.lineCap = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";

    socket.on("start-drawing", (currentPoint:Point) => {
      ctx.beginPath();
      ctx.moveTo(currentPoint.x, currentPoint.y);
      lastRemotePointRef.current = currentPoint;
    })

    socket.on("draw", (currentPoint: Point) => {
      console.log("draw event received", currentPoint);

      const lastPoint = lastRemotePointRef.current;
      if (!lastPoint) {
        // Start a new path
        ctx.beginPath();
        ctx.moveTo(currentPoint.x, currentPoint.y);
      } else {
        // Continue from last point
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();
       
      }
      lastRemotePointRef.current = currentPoint;
    });

    socket.on("stop-drawing", () => {
  lastRemotePointRef.current = null;
});

    socket.on("user-joined", (socketId: string) => {
      console.log("user joined", socketId);
    });

    socket.on("connected", () => {
      console.log("connected to server");
      socket.emit("join-room", roomId);
    });

    return () => {
      socket.off("draw");
      socket.off("connected");
    };
  }, []);
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Save current canvas state for shape preview
    canvasImageRef.current = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height,
    );

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const point = {
      x: (e.nativeEvent.clientX - rect.left) * scaleX,
      y: (e.nativeEvent.clientY - rect.top) * scaleY,
    };

    setStartPoint(point);

    if (shapeType === "pen") {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    }
     socketRef.current.emit("start-drawing", { roomId, point });

    setDrawing(true);
  };

  const stopDrawing = () => {
    setDrawing(false);
    setStartPoint(null);
    socketRef.current.emit("stop-drawing", roomId)
    lastRemotePointRef.current = null;
  };

  const paintRectangle = (
    canvas: HTMLCanvasElement,
    currentPoint: Point,
    startPoint: Point,
  ) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = currentPoint.x - startPoint.x;
    const height = currentPoint.y - startPoint.y;
    ctx.rect(startPoint.x, startPoint.y, width, height);
  };

  const paintPen = (canvas: HTMLCanvasElement, currentPoint: Point) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();

  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const currentPoint = {
      x: (e.nativeEvent.clientX - rect.left) * scaleX,
      y: (e.nativeEvent.clientY - rect.top) * scaleY,
    };

    console.log(`x: ${currentPoint.x}, y:${currentPoint.y}`);

    if (shapeType === "pen") {
      paintPen(canvas, currentPoint);
      socketRef.current.emit("draw", { roomId, currentPoint });
    } else if (startPoint) {
      // For shapes, restore canvas and redraw
      if (canvasImageRef.current) {
        ctx.putImageData(canvasImageRef.current, 0, 0);
      }

      ctx.beginPath();

      if (shapeType === "rectangle") {
        paintRectangle(canvas, currentPoint, startPoint);
      } else if (shapeType === "circle") {
        const radius = Math.sqrt(
          Math.pow(currentPoint.x - startPoint.x, 2) +
            Math.pow(currentPoint.y - startPoint.y, 2),
        );
        ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
      } else if (shapeType === "line") {
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
      }

      ctx.stroke();
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <button
          onClick={() => setShapeType("pen")}
          className={`px-4 py-2 rounded ${
            shapeType === "pen"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          ✏️ Pen
        </button>
        <button
          onClick={() => setShapeType("line")}
          className={`px-4 py-2 rounded ${
            shapeType === "line"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          📏 Line
        </button>
        <button
          onClick={() => setShapeType("rectangle")}
          className={`px-4 py-2 rounded ${
            shapeType === "rectangle"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          ▭ Rectangle
        </button>
        <button
          onClick={() => setShapeType("circle")}
          className={`px-4 py-2 rounded ${
            shapeType === "circle"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          ⭕ Circle
        </button>
        <button
          onClick={clear}
          className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
        >
          🗑️ Clear
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="border-2 border-gray-400 bg-white cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
}

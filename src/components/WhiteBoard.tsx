"use client";
import { useWhiteBoard } from "@/stores/whiteboard.store";
import { useRef, useEffect } from "react";
import NavBar from "./whiteboard/NavBar";
import { calculateCursorCord } from "@/helpers/whiteboard.helper";

export default function Whiteboard() {
  const canvasImageRef = useRef<ImageData | null>(null);

  const {
    setDrawingTrue,
    setDrawingFalse,
    setStartPoint,
    pushStrokesInArray,
    paintCanvas,
    setCurrentStroke,
    pullStrokesOutOfArray,
    redoStrokesArray,
  } = useWhiteBoard();

  const shapeType = useWhiteBoard((state) => state.shapeType);
  const drawing = useWhiteBoard((state) => state.isDrawing);
  const selectedStrokeWidth = useWhiteBoard(
    (state) => state.selectedStrokeWidth,
  );
  const selectedColor = useWhiteBoard((state) => state.selectedColor);
  const currentStroke = useWhiteBoard((state) => state.currentStroke);

  const canvasRef = useWhiteBoard(
    (state) => state.canvasRef,
  ) as React.RefObject<HTMLCanvasElement> | null;

  useEffect(() => {
    if (!canvasRef) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // const socket = socketRef.current;

    ctx.lineCap = "round";
    ctx.lineWidth = selectedStrokeWidth;
    ctx.strokeStyle = selectedColor;

    //     socket.on("start-drawing", (currentPoint:Point, color:string) => {
    //       ctx.beginPath();
    //       ctx.strokeStyle = color;
    //       ctx.moveTo(currentPoint.x, currentPoint.y);

    //       lastRemotePointRef.current = currentPoint;
    //     })

    //     socket.on("draw", ({currentPoint, color}) => {
    //       console.log("draw event received", currentPoint);

    //       const lastPoint = lastRemotePointRef.current;
    //       ctx.strokeStyle =color
    //       if (!lastPoint) {
    //         // Start a new path
    //         ctx.beginPath();
    //         ctx.moveTo(currentPoint.x, currentPoint.y);
    //       } else {
    //         // Continue from last point
    //         ctx.lineTo(currentPoint.x, currentPoint.y);
    //         ctx.stroke();

    //       }
    //       lastRemotePointRef.current = currentPoint;
    //     });

    //     socket.on("stop-drawing", () => {
    //       ctx.strokeStyle = selectedColor;
    //   lastRemotePointRef.current = null;
    // });

    //     socket.on("user-joined", (socketId: string) => {
    //       console.log("user joined", socketId);
    //     });

    //     socket.on("connected", () => {
    //       console.log("connected to server");
    //       socket.emit("join-room", roomId);
    //     });

    //     return () => {
    //       socket.off("draw");
    //       socket.off("connected");
    //       socket.off('stop-drawing');
    //     };
    // }, [selectedColor, selectedStrokeWidth]);
  }, [selectedColor, selectedStrokeWidth]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = selectedColor;

    const point = calculateCursorCord(
      { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY },
      canvas,
    );

    setStartPoint(point);

    if (shapeType === "pen") {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);

      setCurrentStroke({
        type: "pen",
        points: [{ x: point.x, y: point.y }],
        color: selectedColor,
        width: selectedStrokeWidth,
      });
    } else {
      setCurrentStroke({
        type: shapeType,
        points: [{ x: point.x, y: point.y }],
        color: selectedColor,
        width: selectedStrokeWidth,
        startPoint: point,
      });
    }
    //  socketRef.current.emit("start-drawing", { roomId, point, color:selectedColor });

    setDrawingTrue();
  };
  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setDrawingFalse();
    setStartPoint(null);

    if (!currentStroke) {
      console.log("no current stroke");
      return;
    }
    pushStrokesInArray(currentStroke!);

    setCurrentStroke(null);
    // socketRef.current.emit("stop-drawing", roomId)
    // lastRemotePointRef.current = null;
  };
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;

    if (!canvasRef) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const currentPoint = calculateCursorCord(
      { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY },
      canvas,
    );

    if (!currentStroke) {
      return;
    }

    if (currentStroke?.type === "pen") {
      currentStroke?.points.push({ x: currentPoint.x, y: currentPoint.y });
    } else {
      currentStroke.endPoint = currentPoint!;
    }

    paintCanvas();

    // if (shapeType === "pen") {
    //   paintPen(canvas, currentPoint);
    //   // socketRef.current.emit("draw", { roomId, currentPoint, color:selectedColor });
    // } else if (startPoint) {
    //   // For shapes, restore canvas and redraw
    //   if (canvasImageRef.current) {
    //     ctx.putImageData(canvasImageRef.current, 0, 0);
    //   }

    //   ctx.beginPath();

    //   if (shapeType === "rectangle") {
    //     paintRectangle(canvas, currentPoint, startPoint);
    //   } else if (shapeType === "circle") {
    //     const radius = Math.sqrt(
    //       Math.pow(currentPoint.x - startPoint.x, 2) +
    //         Math.pow(currentPoint.y - startPoint.y, 2),
    //     );
    //     ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
    //   } else if (shapeType === "line") {
    //     ctx.moveTo(startPoint.x, startPoint.y);
    //     ctx.lineTo(currentPoint.x, currentPoint.y);
    //   }

    //   ctx.stroke();
    // }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    console.log(e);

    if (e.ctrlKey && e.key === "z") {
      pullStrokesOutOfArray();
      paintCanvas();
    } else if (e.ctrlKey && e.key === "y") {
      redoStrokesArray();
      paintCanvas();
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center h-full w-full ">
      <NavBar />
      <canvas
        ref={canvasRef}
        width={1360}
        height={500}
        tabIndex={0}
        className=" bg-white cursor-crosshair"
        style={{ touchAction: "none" }}
        onPointerDown={startDrawing}
        onPointerUp={stopDrawing}
        onPointerMove={draw}
        onPointerLeave={stopDrawing}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

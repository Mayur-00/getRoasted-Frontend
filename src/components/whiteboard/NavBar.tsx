"use client";
import { colors, options, strokeWidth } from "@/lib/data";
import { useWhiteBoard } from "@/stores/whiteboard.store";
import { Circle, LineChart, Pen, RectangleHorizontal, Slash, SlashIcon, Trash } from "lucide-react";
import React, { useState } from "react";
import UndoButton from "./UndoButton";
import RedoButton from "./RedoButton";

const NavBar = () => {
  const [strokeDropdown, setStrokeDropdown] = useState(false);

  const {
    setColor,
    setStrokeWidth,
    setShapeType,
    clearUndoRedoArr
  } = useWhiteBoard();
  const shapeType = useWhiteBoard((state) => state.shapeType);
  const selectedStrokeWidth = useWhiteBoard(
    (state) => state.selectedStrokeWidth,
  );
  const selectedColor = useWhiteBoard((state) => state.selectedColor);
   const canvasRef = useWhiteBoard((state) => state.canvasRef) as React.RefObject<HTMLCanvasElement> | null;

   const clear = () => {
      if(!canvasRef){
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    clearUndoRedoArr();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="flex gap-2 px-2 items-center h-15 w-auto bg-zinc-100 rounded-md border border-zinc-500 ">
  {
    options.map((opt)=>(
            <button
            key={opt.id}
            name={`${opt.type}-btn`}
        onClick={() => setShapeType(opt.type)}
        className={`px-2 py-2 rounded-sm  ${
          shapeType === opt.type
            ? "bg-blue-600 text-white"
            : "bg-zinc-100 hover:bg-blue-100"
        }`}
      >
        <opt.icon className="size-4"/>
      </button>
    ))
  }

      <button
        onClick={clear}
        name="clear-btn"
        className="px-2 py-2 rounded text-black hover:bg-red-60 hover:bg-red-200"
        >
        <Trash className="size-4"/>
      </button>
        <UndoButton/>
        <RedoButton/>


      <div className="h-10 w-auto border border-zinc-300 rounded p-2 grid grid-cols-12 gap-1 bg-white ">
        {colors.map((color) => (
          <button
            key={color}
            name={`${color}-color-btn`}
            onClick={() => setColor(color)}
            style={{ backgroundColor: color }}
            className={`h-5 w-5 rounded border border-zinc-500 cursor-pointer ${selectedColor === color ? "outline-2" : "outline-0"} outline-blue-300`}
          ></button>
        ))}
      </div>
      <div
     tabIndex={0}
        className="h-10 w-10 border rounded-md border-zinc-200 flex items-center justify-center relative bg-white"
        onClick={() => setStrokeDropdown(!strokeDropdown)}
      >
        <div
          style={{
            height: `${selectedStrokeWidth}px`,
            width: `${selectedStrokeWidth}px`,
            backgroundColor: selectedColor,
          }}
          className={` rounded-full outline-2 outline-gray-300  `}
        ></div>
        <div
          className={`w-10 h-auto border bg-zinc-100  border-zinc-500  z-50 transition-discrete duration-75 ease-in-out  ${strokeDropdown ? "absolute   -bottom-30" : "hidden"} `}
        >
          <div className="h-full w-full flex flex-col items-center justify-center">
            {strokeWidth.map((width) => (
              <button
              name="stroke-opt-btn"
                className="h-8 w-full  flex items-center justify-center t hover:bg-zinc-200  "
                key={width}
                onClick={() => {
                  (setStrokeWidth(width), setStrokeDropdown(false));
                }}
              >
                <div
                  style={{
                    height: `${width}px`,
                    width: `${width}px`,
                    backgroundColor: selectedColor,
                  }}
                  className={` rounded-full outline-2 outline-gray-300  `}
                ></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

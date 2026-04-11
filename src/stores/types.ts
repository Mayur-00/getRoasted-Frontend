import { Point, StrokeElemType } from "@/types/types";
import { Socket } from "socket.io-client";
import { createRef, Ref } from 'react';
export interface WhiteBoardStoreIntercface {
  canvasRef:Ref<HTMLCanvasElement> | null
  isDrawing:boolean;
  isStrokeDropdownOpen:boolean;
  startPoint:Point | null;
  selectedColor:string;
  selectedStrokeWidth:number;
  shapeType:string;
  currentStroke:StrokeElemType | null;
  strokesArray:StrokeElemType[];
  redoArray:StrokeElemType[];


  setDrawingTrue: ()=>void
  setDrawingFalse: ()=>void
  setStartPoint: (point:Point | null)=>void,
  setColor: (color:string) =>void,
  setStrokeWidth: (width:number)=>void,
  setShapeType: (type:string) => void
  pushStrokesInArray: (stroke:StrokeElemType) => void,
  setCurrentStroke: (stroke:StrokeElemType | null) =>void
  pullStrokesOutOfArray: ()=> void;
  redoStrokesArray: ()=> void;
  clearUndoRedoArr: ()=> void;
  paintCanvas: ()=>void


};
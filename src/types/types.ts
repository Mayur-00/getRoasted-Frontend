 export interface Point {
  x: number;
  y: number;
};

export type ShapeType = "pen" | "circle" | "rectangle" | "line";

export interface StrokeElemType {
  type: string;
  points: [{ x: number; y: number }];
  color: string;
  width: number;
  startPoint?:{ x: number; y: number };
  endPoint?:{ x: number; y: number };
  fillColor?:string;

}
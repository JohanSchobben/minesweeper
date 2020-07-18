export interface Tile {
  mine: boolean;
  state: "closed" | "cleared" | "flagged";
  proximityMines: number;
  x: number;
  y: number;
  
}

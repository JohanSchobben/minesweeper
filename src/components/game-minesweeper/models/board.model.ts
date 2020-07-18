import { Tile } from "./Tile.model";

export interface Board {
  tiles: Tile[][];
  state: "win" | "lost" | "play";
  amountOfMines: number;
  remainingMines: number;

}

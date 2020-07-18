import { Board } from "../models/board.model";
import { Tile } from "../models/Tile.model";

const PEERS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

export const setupBoard = (size: number = 8, mines: number = 10): Board => {
  const tiles: Tile[][] = [];
  let mineCount = 0;

  for(let y = 0; y < size; y++) {
    tiles[y] = [];
    for(let x = 0; x < size; x++) {
      tiles[y][x] = {
        mine: false,
        proximityMines: 0,
        state: "closed",
        x,
        y
      }
    }
  }

  while(mineCount < mines) {
    const randomX = Math.floor(Math.random() * size);
    const randomY = Math.floor(Math.random() * size);
    if(!tiles[randomY][randomX].mine) {
      tiles[randomY][randomX].mine = true;
      ++mineCount;
    }
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let adjacentMines = 0;
      for (const peer of PEERS) {
        if (
          tiles[y + peer[0]] &&
          tiles[y + peer[0]][x + peer[1]] &&
          tiles[y + peer[0]][x + peer[1]].mine
        ) {
          adjacentMines++;
        }
      }
      tiles[y][x].proximityMines = adjacentMines;
    }
  }

  return {
    tiles,
    state: "play",
    amountOfMines: mines,
    remainingMines: mines
  }

}

export const openTile = (board: Board, x: number, y: number): Board => {
  let gameState: "win" | "lost" | "play";
  const tile = board.tiles[y][x];
  tile.state = "cleared";
  if (tile.mine) {
    return {
      ...board,
      state: "lost"
    }
  }

  if(tile.proximityMines === 0) {
    for(const peer of PEERS) {
      if (
        board.tiles[tile.y + peer[0]] &&
        board.tiles[tile.y + peer[0]][tile.x + peer[1]] &&
        board.tiles[tile.y + peer[0]][tile.x + peer[1]].state !== "cleared"
      ) {
        openTile(board, board.tiles[tile.y + peer[0]][tile.x + peer[1]].x, board.tiles[tile.y + peer[0]][tile.x + peer[1]].y);
      }
    }
  }

  return {
    tiles: [...board.tiles],
    state: gameState ?? board.state,
    amountOfMines: board.amountOfMines,
    remainingMines: board.remainingMines
  }
}

export const flagTile = (board: Board, x: number, y: number): Board => {
  let gameState: "win" | "lost" | "play" = "play";
  const tile = board.tiles[y][x];


  if(tile.state === "flagged") return closeTile(board, x, y)

  tile.state = "flagged";

  const goodFlags = board.tiles
    .flat()
    .filter(tile => tile.state === "flagged" && tile.mine)
    .length;
  const flagsPlaced = board.tiles
    .flat()
    .filter(tile => tile.state === "flagged")
    .length;

    if(goodFlags === board.amountOfMines) {
      gameState =  "win"
    }


  return {
    tiles: [...board.tiles],
    state: gameState,
    amountOfMines: board.amountOfMines,
    remainingMines: board.amountOfMines - flagsPlaced
  }
}

const closeTile = (board: Board, x: number, y: number): Board => {
  const tile: Tile = board.tiles[y][x];
  if(tile.state === "flagged") tile.state = "closed";

  const flagsPlaced = board.tiles
  .flat()
  .filter(tile => tile.state === "flagged")
  .length;


  return {
    tiles: [...board.tiles],
    state: board.state,
    amountOfMines: board.amountOfMines,
    remainingMines: board.amountOfMines - flagsPlaced
  }

}

import { Component, ComponentInterface, Host, h, State, EventEmitter, Event } from '@stencil/core';
import { Board } from './models/board.model';
import { setupBoard, openTile, flagTile } from './helpers/helpers';
import { Result } from './models/result.model';

@Component({
  tag: 'game-minesweeper',
  styleUrl: 'game-minesweeper.css',
  shadow: true,
})
export class GameMinesweeper implements ComponentInterface {
  private startTime: number;
  @State() private board: Board;

  @Event() lose: EventEmitter<Result>;
  @Event() win: EventEmitter<Result>;

  constructor(){
    this.onStartClick = this.onStartClick.bind(this);
    this.onTileClick = this.onTileClick.bind(this);
  }

  private onStartClick(): void {
    this.board = setupBoard(8, 10);
    this.startTime = Date.now();
  }

  private onTileRightClick (y: number, x: number, event: MouseEvent): void {
    event.preventDefault()
    this.board = flagTile(this.board, x, y);
    if(this.board.state === "win") {
      const endTime = Date.now();
      const TimePlayed = (endTime - this.startTime) / 1000;
      this.win.emit({
        size: this.board.tiles.length,
        won: true,
        time: TimePlayed
      });
    }
  }

  private onTileClick(y:number, x:number): void {
      this.board = openTile(this.board, x, y);
      if(this.board.state === "lost") {
        const endTime = Date.now();
        const TimePlayed = (endTime - this.startTime) / 1000;
        this.lose.emit({
          size: this.board.tiles.length,
          won: false,
          time: TimePlayed
        })
      }
  }

  private renderRows(){
    return this.board?.tiles.map(tileRow => {
      const tiles = tileRow.map(tile => {
        let innerText;
        let classes = `tile tile-${tile.state}`;
        if (this.board.state === "lost") {
          if (tile.mine) innerText = "💣"
          else innerText = tile.proximityMines || "";
          if (tile.state === "cleared" && tile.mine) classes += " tile-lost"
        } else {
          if(tile.state === "flagged") innerText = "⛳"
          else if(tile.state === "closed") innerText = "";
          else if (tile.mine) innerText = "💣"
          else innerText = tile.proximityMines || "";
        }




        return (
          <button
            disabled={tile.state === "cleared" || this.board.state !== "play"}
            onContextMenu={(e) => this.onTileRightClick(tile.y, tile.x, e)}
            onClick={() => this.onTileClick(tile.y, tile.x)}
            class={classes}>
              {innerText}
          </button>
        );
      })
      return (
        <div class="row">{tiles}</div>
      )
    })
  }

  render() {
    return (
      <Host>
        <div class="board">
          <div class="controls">
            <button class="start-button" onClick={this.onStartClick}>start</button>
            <span>{this.board?.remainingMines ?? "-"}</span>
          </div>
          <div class={"board-"+this.board?.state}>
            {this.renderRows()}
          </div>
        </div>
      </Host>
    );
  }

}

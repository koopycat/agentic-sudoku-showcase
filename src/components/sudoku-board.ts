import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cellLabel, isEditable, type Board } from "../domain/sudoku.ts";
import "./sudoku-cell.ts";

@customElement("sudoku-board")
export class SudokuBoard extends LitElement {
  @property({ attribute: false }) board: Board = [];
  @property({ attribute: false }) conflicts: ReadonlySet<number> = new Set();
  @property({ type: Number }) selected = -1;

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    .board {
      display: grid;
      grid-template-columns: repeat(9, 1fr);
      width: 100%;
      overflow: hidden;
      border: 2px solid var(--ink);
      border-radius: 8px;
      background: var(--ink);
      box-shadow: 0 16px 36px oklch(0.19 0.015 70 / 0.12);
    }
    .row {
      display: contents;
    }
  `;

  protected render() {
    return html`<div
      class="board"
      role="grid"
      aria-label="Sudoku board"
      @keydown=${this.onKeydown}
    >
      ${Array.from(
        { length: 9 },
        (_, row) =>
          html`<div class="row" role="row">
            ${this.board.slice(row * 9, row * 9 + 9).map((value, column) => {
              const index = row * 9 + column;
              return html`<sudoku-cell
                .index=${index}
                .value=${value}
                .given=${!isEditable(index)}
                .invalid=${this.conflicts.has(index) && isEditable(index)}
                .selected=${index === this.selected}
                .label=${cellLabel(
                  index,
                  value,
                  !isEditable(index),
                  this.conflicts.has(index),
                )}
                ?index-three=${column === 2}
                ?index-six=${column === 5}
                ?row-three=${row === 2}
                ?row-six=${row === 5}
              ></sudoku-cell>`;
            })}
          </div>`,
      )}
    </div>`;
  }

  private onKeydown(event: KeyboardEvent) {
    if (this.selected < 0) return;
    if (/^[1-9]$/.test(event.key)) {
      event.preventDefault();
      this.dispatchEvent(
        new CustomEvent("number-choose", {
          detail: Number(event.key),
          bubbles: true,
          composed: true,
        }),
      );
    } else if (
      event.key === "Backspace" ||
      event.key === "Delete" ||
      event.key === "0"
    ) {
      event.preventDefault();
      this.dispatchEvent(
        new CustomEvent("number-choose", {
          detail: null,
          bubbles: true,
          composed: true,
        }),
      );
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sudoku-board": SudokuBoard;
  }
}

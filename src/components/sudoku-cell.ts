import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { CellValue } from "../domain/sudoku.ts";

@customElement("sudoku-cell")
export class SudokuCell extends LitElement {
  @property({ type: Number }) index = 0;
  @property({ attribute: false }) value: CellValue = null;
  @property({ type: Boolean, reflect: true }) given = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, reflect: true }) selected = false;
  @property() label = "";

  static styles = css`
    :host {
      display: contents;
    }
    button {
      aspect-ratio: 1;
      min-width: 0;
      border: 0;
      border-inline-end: 1px solid var(--line);
      border-block-end: 1px solid var(--line);
      background: var(--cell);
      color: var(--ink);
      font:
        650 clamp(1rem, 4.5vw, 1.5rem) / 1 ui-sans-serif,
        system-ui,
        sans-serif;
      font-variant-numeric: tabular-nums;
      cursor: pointer;
      transition:
        background 150ms,
        box-shadow 150ms,
        transform 100ms;
    }
    button:hover:not(:disabled) {
      background: var(--surface-strong);
    }
    button:active:not(:disabled) {
      transform: scale(0.94);
    }
    button:focus-visible {
      position: relative;
      z-index: 3;
      outline: 3px solid var(--focus);
      outline-offset: -3px;
    }
    button[data-selected] {
      background: var(--selected);
      box-shadow: inset 0 0 0 2px var(--primary-dark);
    }
    button:disabled {
      color: var(--given);
      cursor: default;
      background: var(--given-bg);
      opacity: 1;
    }
    button[aria-invalid="true"] {
      color: var(--error);
      background: var(--error-bg);
      text-decoration: underline wavy;
      text-underline-offset: 0.22em;
    }
    :host([index-three]) button,
    :host([index-six]) button {
      border-inline-end: 2px solid var(--ink);
    }
    :host([row-three]) button,
    :host([row-six]) button {
      border-block-end: 2px solid var(--ink);
    }
    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
    }
  `;

  protected render() {
    return html`<button
      type="button"
      role="gridcell"
      aria-label=${this.label}
      ?data-selected=${this.selected}
      aria-selected=${this.selected ? "true" : "false"}
      aria-invalid=${this.invalid ? "true" : "false"}
      ?disabled=${this.given}
      @click=${() =>
        this.dispatchEvent(
          new CustomEvent("cell-select", {
            detail: this.index,
            bubbles: true,
            composed: true,
          }),
        )}
    >
      ${this.value ?? ""}
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sudoku-cell": SudokuCell;
  }
}

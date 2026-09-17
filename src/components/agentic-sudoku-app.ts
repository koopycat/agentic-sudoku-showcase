import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import {
  conflictingCells,
  createBoard,
  isComplete,
  isEditable,
  setCell,
  type CellValue,
} from "../domain/sudoku.ts";
import "./number-controls.ts";
import "./sudoku-board.ts";
import "../style.css";

@customElement("agentic-sudoku-app")
export class AgenticSudokuApp extends LitElement {
  @state() private board = createBoard();
  @state() private selected = -1;
  @state() private resetOpen = false;

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--background);
      color: var(--ink);
    }
    .shell {
      max-width: 1180px;
      margin: 0 auto;
      padding: 32px 24px 64px;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      border-bottom: 1px solid var(--line);
      padding-bottom: 16px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 0.875rem;
      font-weight: 750;
      letter-spacing: 0.02em;
    }
    .mark {
      display: grid;
      place-items: center;
      width: 28px;
      height: 28px;
      background: var(--ink);
      color: white;
      border-radius: 6px;
      font-size: 0.75rem;
    }
    .badge {
      padding: 5px 8px;
      border: 1px solid var(--line);
      border-radius: 999px;
      color: var(--muted);
      font-size: 0.75rem;
      font-weight: 650;
    }
    main {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(300px, 420px);
      gap: 64px;
      align-items: start;
      padding-top: 48px;
    }
    .eyebrow {
      margin: 0 0 12px;
      color: var(--primary-dark);
      font-size: 0.75rem;
      font-weight: 750;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    h1 {
      max-width: 14ch;
      margin: 0;
      font-size: 2rem;
      line-height: 1.1;
      letter-spacing: -0.035em;
    }
    .intro {
      max-width: 58ch;
      margin: 16px 0 32px;
      color: var(--muted);
      line-height: 1.6;
    }
    .workflow {
      margin: 0;
      padding: 0;
      list-style: none;
      border-top: 1px solid var(--line);
    }
    .workflow li {
      display: grid;
      grid-template-columns: 32px 1fr auto;
      gap: 12px;
      align-items: start;
      padding: 16px 0;
      border-bottom: 1px solid var(--line);
    }
    .step {
      color: var(--muted);
      font:
        650 0.75rem/1 ui-monospace,
        SFMono-Regular,
        monospace;
    }
    .workflow strong {
      display: block;
      margin-bottom: 4px;
      font-size: 0.875rem;
    }
    .workflow p {
      margin: 0;
      color: var(--muted);
      font-size: 0.8rem;
      line-height: 1.45;
    }
    .status {
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 3px 7px;
      color: var(--success);
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
    }
    .game {
      width: min(100%, 420px);
      justify-self: end;
    }
    .game-head {
      display: flex;
      align-items: end;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .game-head h2 {
      margin: 0;
      font-size: 1.125rem;
    }
    .game-head span {
      color: var(--muted);
      font-size: 0.75rem;
      font-variant-numeric: tabular-nums;
    }
    number-controls {
      margin-top: 16px;
    }
    .game-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-top: 16px;
      min-height: 44px;
    }
    .feedback {
      margin: 0;
      color: var(--muted);
      font-size: 0.8rem;
    }
    .feedback.success {
      color: var(--success);
      font-weight: 700;
    }
    .reset {
      min-height: 44px;
      padding: 0 14px;
      border: 1px solid var(--line);
      border-radius: 6px;
      background: white;
      color: var(--ink);
      font-weight: 650;
      cursor: pointer;
    }
    .reset:hover {
      background: var(--surface);
    }
    .reset:focus-visible,
    dialog button:focus-visible {
      outline: 3px solid var(--focus);
      outline-offset: 2px;
    }
    dialog {
      width: min(420px, calc(100vw - 32px));
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 24px;
      color: var(--ink);
      box-shadow: 0 24px 80px oklch(0.19 0.015 70 / 0.25);
    }
    dialog::backdrop {
      background: oklch(0.19 0.015 70 / 0.45);
    }
    dialog h2 {
      margin: 0 0 8px;
      font-size: 1.125rem;
    }
    dialog p {
      margin: 0 0 24px;
      color: var(--muted);
      line-height: 1.5;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    dialog button {
      min-height: 44px;
      padding: 0 16px;
      border: 1px solid var(--line);
      border-radius: 6px;
      background: white;
      cursor: pointer;
      font-weight: 650;
    }
    dialog .confirm {
      border-color: var(--ink);
      background: var(--ink);
      color: white;
    }
    @media (max-width: 820px) {
      main {
        grid-template-columns: 1fr;
        gap: 40px;
        padding-top: 32px;
      }
      .game {
        justify-self: start;
        width: min(100%, 520px);
      }
      h1 {
        max-width: 20ch;
      }
    }
    @media (max-width: 520px) {
      .shell {
        padding: 20px 16px 48px;
      }
      .badge {
        display: none;
      }
      main {
        gap: 32px;
      }
      .workflow p {
        max-width: 30ch;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      * {
        scroll-behavior: auto !important;
        transition: none !important;
      }
    }
  `;

  protected render() {
    const conflicts = conflictingCells(this.board);
    const complete = isComplete(this.board);
    const entries = this.board.filter(
      (value, index) => value !== null && isEditable(index),
    ).length;
    const hasProgress = entries > 0;
    return html`
      <div class="shell">
        <header>
          <div class="brand">
            <span class="mark">A/9</span>Agentic Sudoku Lab
          </div>
          <span class="badge">Advisory automation · human controlled</span>
        </header>
        <main>
          <section aria-labelledby="showcase-heading">
            <p class="eyebrow">Workflow showcase / 01</p>
            <h1 id="showcase-heading">
              Agents you can inspect, not magic you have to trust.
            </h1>
            <p class="intro">
              A real Sudoku gives every workflow the same test surface. Feature
              requests become reviewable plans; pull requests run browser
              checks; failures become evidence-backed diagnoses.
            </p>
            <ol class="workflow" aria-label="Agentic workflow">
              <li>
                <span class="step">01</span>
                <div>
                  <strong>Request → plan</strong>
                  <p>
                    A trusted label asks an agent for implementation steps. It
                    comments; it cannot write code.
                  </p>
                </div>
                <span class="status">bounded</span>
              </li>
              <li>
                <span class="step">02</span>
                <div>
                  <strong>Pull request → browser proof</strong>
                  <p>
                    Unprivileged Playwright checks exercise the same interface a
                    user sees.
                  </p>
                </div>
                <span class="status">automatic</span>
              </li>
              <li>
                <span class="step">03</span>
                <div>
                  <strong>Failure → diagnosis</strong>
                  <p>
                    Trusted branches get a cited, advisory remedy. Forks keep
                    artifacts without exposing secrets.
                  </p>
                </div>
                <span class="status">guarded</span>
              </li>
            </ol>
          </section>
          <section
            class="game"
            aria-labelledby="game-heading"
            @cell-select=${this.selectCell}
            @number-choose=${this.chooseNumber}
          >
            <div class="game-head">
              <h2 id="game-heading">Verification puzzle</h2>
              <span>${entries}/51 entered</span>
            </div>
            <sudoku-board
              .board=${this.board}
              .conflicts=${conflicts}
              .selected=${this.selected}
            ></sudoku-board>
            <number-controls
              .inactive=${this.selected < 0 || !isEditable(this.selected)}
            ></number-controls>
            <div class="game-actions">
              <p
                class="feedback ${complete ? "success" : ""}"
                role="status"
                aria-live="polite"
              >
                ${complete
                  ? "Puzzle verified. Every constraint passes."
                  : conflicts.size
                    ? `${conflicts.size} conflicting cells need review.`
                    : this.selected < 0
                      ? "Select an empty cell to begin."
                      : "No conflicts detected."}
              </p>
              <button
                class="reset"
                type="button"
                ?disabled=${!hasProgress}
                @click=${() => this.openReset()}
              >
                Reset
              </button>
            </div>
          </section>
        </main>
      </div>
      <dialog
        ?open=${this.resetOpen}
        @cancel=${this.cancelReset}
        aria-labelledby="reset-title"
      >
        <h2 id="reset-title">Reset this puzzle?</h2>
        <p>
          Your entered digits will be removed. The original given cells stay in
          place.
        </p>
        <div class="dialog-actions">
          <button type="button" @click=${this.cancelReset}>Keep progress</button
          ><button type="button" class="confirm" @click=${this.confirmReset}>
            Reset puzzle
          </button>
        </div>
      </dialog>
    `;
  }

  private selectCell(event: CustomEvent<number>) {
    if (isEditable(event.detail)) this.selected = event.detail;
  }
  private chooseNumber(event: CustomEvent<CellValue>) {
    if (this.selected >= 0)
      this.board = setCell(this.board, this.selected, event.detail);
  }
  private openReset() {
    this.resetOpen = true;
  }
  private cancelReset = (event?: Event) => {
    event?.preventDefault();
    this.resetOpen = false;
  };
  private confirmReset = () => {
    this.board = createBoard();
    this.selected = -1;
    this.resetOpen = false;
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "agentic-sudoku-app": AgenticSudokuApp;
  }
}

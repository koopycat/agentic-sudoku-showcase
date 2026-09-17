import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("number-controls")
export class NumberControls extends LitElement {
  @property({ type: Boolean }) inactive = false;

  static styles = css`
    :host {
      display: block;
    }
    .pad {
      display: grid;
      grid-template-columns: repeat(5, minmax(44px, 1fr));
      gap: 8px;
    }
    button {
      min-height: 48px;
      border: 1px solid var(--line);
      border-radius: 6px;
      background: var(--surface);
      color: var(--ink);
      font:
        650 1rem/1 ui-sans-serif,
        system-ui,
        sans-serif;
      cursor: pointer;
      transition:
        background 150ms,
        transform 100ms;
    }
    button:hover:not(:disabled) {
      background: var(--surface-strong);
    }
    button:active:not(:disabled) {
      transform: translateY(1px);
    }
    button:focus-visible {
      outline: 3px solid var(--focus);
      outline-offset: 2px;
    }
    button:disabled {
      cursor: not-allowed;
      opacity: 0.45;
    }
    .erase {
      color: var(--muted);
    }
    @media (max-width: 420px) {
      .pad {
        grid-template-columns: repeat(5, 1fr);
        gap: 6px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
    }
  `;

  protected render() {
    return html`<div class="pad" aria-label="Number controls">
      ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(
        (value) =>
          html`<button
            type="button"
            ?disabled=${this.inactive}
            aria-label="Enter ${value}"
            @click=${() => this.choose(value)}
          >
            ${value}
          </button>`,
      )}
      <button
        class="erase"
        type="button"
        ?disabled=${this.inactive}
        aria-label="Erase cell"
        @click=${() => this.choose(null)}
      >
        Erase
      </button>
    </div>`;
  }

  private choose(value: number | null) {
    this.dispatchEvent(
      new CustomEvent("number-choose", {
        detail: value,
        bubbles: true,
        composed: true,
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "number-controls": NumberControls;
  }
}

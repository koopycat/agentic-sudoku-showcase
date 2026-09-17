import { beforeEach, describe, expect, it } from "vitest";
import "../src/components/agentic-sudoku-app.ts";
import type { AgenticSudokuApp } from "../src/components/agentic-sudoku-app.ts";

async function appFixture() {
  document.body.innerHTML = "<agentic-sudoku-app></agentic-sudoku-app>";
  const app = document.querySelector("agentic-sudoku-app") as AgenticSudokuApp;
  await app.updateComplete;
  const board = app.shadowRoot!.querySelector("sudoku-board")!;
  await board.updateComplete;
  return { app, board };
}

describe("Sudoku components", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders 81 labeled cells and distinguishes givens", async () => {
    const { board } = await appFixture();
    const cells = [...board.shadowRoot!.querySelectorAll("sudoku-cell")];
    expect(cells).toHaveLength(81);
    expect(cells[0].given).toBe(true);
    expect(cells[2].given).toBe(false);
    expect(cells[2].label).toContain("editable");
  });

  it("accepts entry and clear but ignores given selection", async () => {
    const { app, board } = await appFixture();
    board.dispatchEvent(
      new CustomEvent("cell-select", {
        detail: 0,
        bubbles: true,
        composed: true,
      }),
    );
    board.dispatchEvent(
      new CustomEvent("number-choose", {
        detail: 9,
        bubbles: true,
        composed: true,
      }),
    );
    await app.updateComplete;
    expect((app as any).board[0]).toBe(5);
    board.dispatchEvent(
      new CustomEvent("cell-select", {
        detail: 2,
        bubbles: true,
        composed: true,
      }),
    );
    board.dispatchEvent(
      new CustomEvent("number-choose", {
        detail: 4,
        bubbles: true,
        composed: true,
      }),
    );
    await app.updateComplete;
    expect((app as any).board[2]).toBe(4);
    board.dispatchEvent(
      new CustomEvent("number-choose", {
        detail: null,
        bubbles: true,
        composed: true,
      }),
    );
    await app.updateComplete;
    expect((app as any).board[2]).toBeNull();
  });

  it("supports cancelling and confirming reset", async () => {
    const { app, board } = await appFixture();
    board.dispatchEvent(
      new CustomEvent("cell-select", {
        detail: 2,
        bubbles: true,
        composed: true,
      }),
    );
    board.dispatchEvent(
      new CustomEvent("number-choose", {
        detail: 4,
        bubbles: true,
        composed: true,
      }),
    );
    await app.updateComplete;
    (app.shadowRoot!.querySelector(".reset") as HTMLButtonElement).click();
    await app.updateComplete;
    (
      app.shadowRoot!.querySelector("dialog button") as HTMLButtonElement
    ).click();
    await app.updateComplete;
    expect((app as any).board[2]).toBe(4);
    (app.shadowRoot!.querySelector(".reset") as HTMLButtonElement).click();
    await app.updateComplete;
    (app.shadowRoot!.querySelector(".confirm") as HTMLButtonElement).click();
    await app.updateComplete;
    expect((app as any).board[2]).toBeNull();
  });

  it("announces conflicts and completion", async () => {
    const { app, board } = await appFixture();
    board.dispatchEvent(
      new CustomEvent("cell-select", {
        detail: 2,
        bubbles: true,
        composed: true,
      }),
    );
    board.dispatchEvent(
      new CustomEvent("number-choose", {
        detail: 5,
        bubbles: true,
        composed: true,
      }),
    );
    await app.updateComplete;
    expect(
      app.shadowRoot!.querySelector("[role=status]")!.textContent,
    ).toContain("conflicting");
    const solution = (await import("../src/domain/sudoku.ts")).SOLUTION;
    (app as any).board = [...solution];
    await app.updateComplete;
    expect(
      app.shadowRoot!.querySelector("[role=status]")!.textContent,
    ).toContain("verified");
  });
});

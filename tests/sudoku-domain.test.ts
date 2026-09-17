import { describe, expect, it } from "vitest";
import {
  SOLUTION,
  STARTER_PUZZLE,
  conflictingCells,
  createBoard,
  isComplete,
  isEditable,
  isValid,
  setCell,
} from "../src/domain/sudoku.ts";

describe("Sudoku domain", () => {
  it("creates a fresh board and protects givens", () => {
    const first = createBoard();
    const second = createBoard();
    expect(first).not.toBe(second);
    expect(first).toEqual(STARTER_PUZZLE);
    expect(isEditable(0)).toBe(false);
    expect(setCell(first, 0, 9)).toEqual(first);
  });

  it("sets and clears valid editable cells", () => {
    const entered = setCell(createBoard(), 2, 4);
    expect(entered[2]).toBe(4);
    expect(setCell(entered, 2, null)[2]).toBeNull();
    expect(setCell(entered, 2, 10)).toEqual(entered);
  });

  it.each([
    ["row", 2, 5],
    ["column", 2, 6],
    ["box", 2, 9],
  ])("detects a %s conflict", (_kind, index, value) => {
    const board = setCell(createBoard(), index, value as number);
    expect(conflictingCells(board).has(index)).toBe(true);
    expect(isValid(board)).toBe(false);
  });

  it("recognizes a valid solution", () => {
    expect(isValid(SOLUTION)).toBe(true);
    expect(isComplete(SOLUTION)).toBe(true);
  });

  it("rejects a full invalid board", () => {
    const invalid = [...SOLUTION];
    invalid[2] = invalid[3];
    expect(invalid.every(Boolean)).toBe(true);
    expect(isComplete(invalid)).toBe(false);
  });
});

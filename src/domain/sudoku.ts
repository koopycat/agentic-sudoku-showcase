export type CellValue = number | null;
export type Board = readonly CellValue[];

export const BOARD_SIZE = 9;
export const CELL_COUNT = BOARD_SIZE * BOARD_SIZE;

const PUZZLE_TEXT =
  "530070000600195000098000060800060003400803001700020006060000280000419005000080079";

export const SOLUTION: Board = Object.freeze(
  [
    ..."534678912672195348198342567859761423426853791713924856961537284287419635345286179",
  ].map(Number),
);

export const STARTER_PUZZLE: Board = Object.freeze(
  [...PUZZLE_TEXT].map((value) => (value === "0" ? null : Number(value))),
);

export function createBoard(): CellValue[] {
  return [...STARTER_PUZZLE];
}

export function isEditable(index: number): boolean {
  return (
    Number.isInteger(index) &&
    index >= 0 &&
    index < CELL_COUNT &&
    STARTER_PUZZLE[index] === null
  );
}

export function setCell(
  board: Board,
  index: number,
  value: CellValue,
): CellValue[] {
  if (
    !isEditable(index) ||
    (value !== null && (!Number.isInteger(value) || value < 1 || value > 9))
  ) {
    return [...board];
  }
  const next = [...board];
  next[index] = value;
  return next;
}

function peers(index: number): number[] {
  const row = Math.floor(index / BOARD_SIZE);
  const column = index % BOARD_SIZE;
  const boxRow = Math.floor(row / 3) * 3;
  const boxColumn = Math.floor(column / 3) * 3;
  const result = new Set<number>();
  for (let offset = 0; offset < BOARD_SIZE; offset += 1) {
    result.add(row * BOARD_SIZE + offset);
    result.add(offset * BOARD_SIZE + column);
  }
  for (let r = boxRow; r < boxRow + 3; r += 1) {
    for (let c = boxColumn; c < boxColumn + 3; c += 1)
      result.add(r * BOARD_SIZE + c);
  }
  result.delete(index);
  return [...result];
}

export function conflictingCells(board: Board): ReadonlySet<number> {
  const conflicts = new Set<number>();
  board.forEach((value, index) => {
    if (value === null) return;
    for (const peer of peers(index)) {
      if (board[peer] === value) {
        conflicts.add(index);
        conflicts.add(peer);
      }
    }
  });
  return conflicts;
}

export function isValid(board: Board): boolean {
  return board.length === CELL_COUNT && conflictingCells(board).size === 0;
}

export function isComplete(board: Board): boolean {
  return (
    board.length === CELL_COUNT &&
    board.every((cell) => cell !== null) &&
    isValid(board)
  );
}

export function cellLabel(
  index: number,
  value: CellValue,
  given: boolean,
  invalid: boolean,
): string {
  const row = Math.floor(index / BOARD_SIZE) + 1;
  const column = (index % BOARD_SIZE) + 1;
  const contents = value === null ? "empty" : String(value);
  return `Row ${row}, column ${column}, ${contents}, ${given ? "given" : "editable"}${invalid ? ", invalid" : ""}`;
}

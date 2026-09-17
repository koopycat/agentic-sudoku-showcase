# Sudoku Game Specification

## Purpose

Defines a small, accessible Sudoku experience that makes the showcase useful as a real browser product and provides stable behavior for end-to-end testing.

## Requirements

### Requirement: Playable puzzle

The system SHALL display a 9-by-9 Sudoku board containing immutable given digits and editable empty cells from a valid starter puzzle.

#### Scenario: Game loads

- **WHEN** a user opens the application
- **THEN** the system displays all 81 cells with given digits visually distinguishable from editable cells

#### Scenario: Given digit is protected

- **WHEN** a user attempts to edit a cell containing a given digit
- **THEN** the given digit remains unchanged

### Requirement: Cell entry and clearing

The system SHALL allow a user to select an editable cell, enter a digit from 1 through 9, and clear a previously entered digit using pointer, keyboard, or on-screen controls.

#### Scenario: Enter a digit

- **WHEN** a user selects an editable cell and chooses a digit from 1 through 9
- **THEN** the selected cell displays that digit

#### Scenario: Clear a digit

- **WHEN** a user clears an editable cell containing a user-entered digit
- **THEN** the cell becomes empty

### Requirement: Conflict feedback

The system SHALL visually identify user-entered digits that duplicate another digit in the same row, column, or 3-by-3 box without preventing continued editing.

#### Scenario: Conflicting digit entered

- **WHEN** a user enters a digit already present in the cell's row, column, or box
- **THEN** the system marks the conflicting entry as invalid

#### Scenario: Conflict corrected

- **WHEN** a user changes or clears an entry so it no longer conflicts
- **THEN** the system removes the invalid indication

### Requirement: Completion feedback

The system SHALL announce success only when every cell is filled and the board is a valid Sudoku solution.

#### Scenario: Puzzle solved

- **WHEN** the user completes the board with a valid solution
- **THEN** the system presents a success message that is exposed to assistive technology

#### Scenario: Board is full but invalid

- **WHEN** every editable cell is filled but the board contains a conflict
- **THEN** the system does not present a success message

### Requirement: Reset puzzle

The system SHALL provide a reset action that restores the original starter puzzle after user confirmation when progress would be lost.

#### Scenario: Confirm reset

- **WHEN** a user with entered digits confirms the reset action
- **THEN** all user-entered digits and transient game feedback are removed while given digits remain

#### Scenario: Cancel reset

- **WHEN** a user declines reset confirmation
- **THEN** the current board remains unchanged

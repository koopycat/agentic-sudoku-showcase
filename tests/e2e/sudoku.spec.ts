import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const solution =
  "534678912672195348198342567859761423426853791713924856961537284287419635345286179";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("loads an accessible 81-cell puzzle with protected givens", async ({
  page,
}) => {
  const board = page.getByRole("grid", { name: "Sudoku board" });
  await expect(board).toBeVisible();
  await expect(page.getByRole("gridcell")).toHaveCount(81);
  await expect(
    page.getByRole("gridcell", { name: /Row 1, column 1, 5, given/ }),
  ).toBeDisabled();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("enters, clears, and corrects a conflict using visible controls", async ({
  page,
}) => {
  await page
    .getByRole("gridcell", { name: /Row 1, column 3, empty, editable/ })
    .click();
  await page.getByRole("button", { name: "Enter 5" }).click();
  await expect(page.getByRole("status")).toContainText("conflicting");
  await expect(
    page.getByRole("gridcell", {
      name: /Row 1, column 3, 5, editable, invalid/,
    }),
  ).toHaveAttribute("aria-invalid", "true");
  await page.getByRole("button", { name: "Enter 4" }).click();
  await expect(page.getByRole("status")).toContainText("No conflicts");
  await page.getByRole("button", { name: "Erase cell" }).click();
  await expect(
    page.getByRole("gridcell", { name: /Row 1, column 3, empty, editable/ }),
  ).toBeVisible();
});

test("supports keyboard entry and reset cancellation/confirmation", async ({
  page,
}) => {
  const cell = page.getByRole("gridcell", {
    name: /Row 1, column 3, empty, editable/,
  });
  await cell.click();
  await page.keyboard.press("4");
  await expect(
    page.getByRole("gridcell", { name: /Row 1, column 3, 4, editable/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset" }).click();
  await page.getByRole("button", { name: "Keep progress" }).click();
  await expect(
    page.getByRole("gridcell", { name: /Row 1, column 3, 4, editable/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset" }).click();
  await page.getByRole("button", { name: "Reset puzzle" }).click();
  await expect(
    page.getByRole("gridcell", { name: /Row 1, column 3, empty, editable/ }),
  ).toBeVisible();
});

test("announces a valid completed puzzle", async ({ page }) => {
  const cells = page.getByRole("gridcell");
  for (let index = 0; index < 81; index += 1) {
    const cell = cells.nth(index);
    if (await cell.isEnabled()) {
      await cell.click();
      await page.keyboard.press(solution[index]);
    }
  }
  await expect(page.getByRole("status")).toContainText("Puzzle verified");
});

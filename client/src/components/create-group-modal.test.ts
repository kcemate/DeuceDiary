import { describe, it, expect } from "vitest";
import { CreateGroupModal } from "./create-group-modal";

describe("CreateGroupModal", () => {
  it("exports CreateGroupModal as a function", () => {
    expect(typeof CreateGroupModal).toBe("function");
  });
});

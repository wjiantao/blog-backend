import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/repositories/comment.repository", () => ({
  commentRepository: {
    findById: vi.fn(),
    updateStatus: vi.fn(),
    count: vi.fn(),
    list: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("../src/repositories/post.repository", () => ({
  postRepository: {
    findById: vi.fn(),
  },
}));

import { commentService } from "../src/services/comment.service";
import { commentRepository } from "../src/repositories/comment.repository";

const mockedCommentRepository = vi.mocked(commentRepository);

describe("commentService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates comment status", async () => {
    mockedCommentRepository.findById.mockResolvedValue({ id: 1 } as never);
    mockedCommentRepository.updateStatus.mockResolvedValue({ id: 1, status: "approved" } as never);

    const result = await commentService.updateStatus(1, "approved");

    expect(result).toEqual({ id: 1, status: "approved" });
  });
});

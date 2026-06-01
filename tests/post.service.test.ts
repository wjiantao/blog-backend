import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/repositories/post.repository", () => ({
  postRepository: {
    countPublic: vi.fn(),
    listPublic: vi.fn(),
    countAdmin: vi.fn(),
    listAdmin: vi.fn(),
    findBySlug: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    findById: vi.fn(),
    delete: vi.fn(),
    replaceTags: vi.fn(),
    isSlugTaken: vi.fn(),
  },
}));

vi.mock("../src/repositories/tag.repository", () => ({
  tagRepository: {
    existsByIds: vi.fn(),
  },
}));

import { postService } from "../src/services/post.service";
import { postRepository } from "../src/repositories/post.repository";
import { tagRepository } from "../src/repositories/tag.repository";

const mockedPostRepository = vi.mocked(postRepository);
const mockedTagRepository = vi.mocked(tagRepository);

describe("postService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates unique slug when slug is taken", async () => {
    mockedTagRepository.existsByIds.mockResolvedValue(true);
    mockedPostRepository.isSlugTaken
      .mockResolvedValueOnce({ id: 1 } as never)
      .mockResolvedValueOnce(null);
    mockedPostRepository.create.mockResolvedValue({ id: 2 } as never);
    mockedPostRepository.replaceTags.mockResolvedValue(undefined);
    mockedPostRepository.findById.mockResolvedValue({ id: 2, slug: "hello-world-1" } as never);

    const result = await postService.create({
      title: "Hello World",
      excerpt: "This is a valid excerpt for a new post.",
      contentMarkdown: "Long enough markdown content.",
      categoryId: null,
      tagIds: [1],
      status: "draft",
      publishedAt: null,
    });

    expect(mockedPostRepository.create).toHaveBeenCalledWith(expect.objectContaining({ slug: "hello-world-1" }));
    expect(result).toEqual({ id: 2, slug: "hello-world-1" });
  });
});

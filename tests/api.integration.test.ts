import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/services/post.service", () => ({
  postService: {
    listPublic: vi.fn(),
    getPublicBySlug: vi.fn(),
    listAdmin: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../src/services/auth.service", () => ({
  authService: {
    login: vi.fn(),
  },
}));

vi.mock("../src/services/comment.service", () => ({
  commentService: {
    create: vi.fn(),
    listAdmin: vi.fn(),
    updateStatus: vi.fn(),
  },
}));

import { app } from "../src/app";
import { authService } from "../src/services/auth.service";
import { commentService } from "../src/services/comment.service";
import { postService } from "../src/services/post.service";

const mockedAuthService = vi.mocked(authService);
const mockedPostService = vi.mocked(postService);
const mockedCommentService = vi.mocked(commentService);

describe("API integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("supports login", async () => {
    mockedAuthService.login.mockResolvedValue({ accessToken: "token", user: { username: "admin" } } as never);

    const response = await request(app).post("/api/admin/auth/login").send({ username: "admin", password: "secret123" });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBe("token");
  });

  it("blocks admin endpoint without token", async () => {
    const response = await request(app).post("/api/admin/posts").send({});
    expect(response.status).toBe(401);
  });

  it("returns public posts list", async () => {
    mockedPostService.listPublic.mockResolvedValue({ items: [{ id: 1 }], pagination: { page: 1 } } as never);

    const response = await request(app).get("/api/posts?page=1&pageSize=10");

    expect(response.status).toBe(200);
    expect(response.body.items[0].id).toBe(1);
  });

  it("accepts comment submission", async () => {
    mockedCommentService.create.mockResolvedValue({ id: 1, status: "pending" } as never);

    const response = await request(app)
      .post("/api/comments")
      .send({ postId: 1, nickname: "reader", content: "Great post" });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("pending");
  });
});

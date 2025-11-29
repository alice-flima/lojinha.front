import { vi } from "vitest";

export const prismaMock = {
  compra: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  produto: {
    findMany: vi.fn(),
  },
  compraProduto: {
    create: vi.fn(),
    deleteMany: vi.fn(),
  },
  user: {
    findUnique: vi.fn(),
  },
  $transaction: vi.fn(async (callback) => callback(prismaMock)),
};

export const mockAuthSession = {
  user: {
    id: "usuariomock",
    email: "teste@email.com",
  },
};

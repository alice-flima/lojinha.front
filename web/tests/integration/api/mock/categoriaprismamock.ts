import { vi } from "vitest";

const prismaCategoriaMock = {
  categoria: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
};

export default prismaCategoriaMock;

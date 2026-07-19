import type { Role } from "@/lib/generated/prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
    };
  }
  interface User {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}

// "next-auth/jwt" re-exports from "@auth/core/jwt" via `export *`, which
// TS declaration merging does not follow — augment the origin module too.
declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}

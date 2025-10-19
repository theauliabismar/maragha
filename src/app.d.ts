import type { User } from '@auth/core/types';

declare global {
  namespace App {
    interface Locals {
      auth(): Promise<Session | null>;
    }
    interface Session {
      user?: User & {
        permissions?: Record<string, { canCreate: boolean, canRead: boolean, canUpdate: boolean, canDelete: boolean }>;
      };
    }
  }
}

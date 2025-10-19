# Development Next Steps

With the project foundation in place, here is the plan for building the application's features.

## Phase 1: Authentication and Core Back-Office

1.  **Configure Auth.js:**
    *   Set up the Auth.js configuration file (`src/lib/server/auth.ts`).
    *   Implement the email/password provider.
    *   Connect Auth.js to the database using the Drizzle adapter.

2.  **Build Authentication UI:**
    *   Create login and registration pages under `src/routes/(portal)/`.
    *   Use `carbon-svelte` components to build the forms.

3.  **Implement Route Protection:**
    *   Create a layout for the back-office `(back-office)` that checks for an active user session.
    *   Redirect unauthenticated users from back-office routes to the login page.

4.  **Build Core CRUD for Back-Office:**
    *   Start with the management pages for `Penulis` (Authors), `Kategori` (Categories), and `Penerbit` (Publishers).
    *   Create API endpoints and frontend components for creating, reading, updating, and deleting these records.

## Phase 2: Book and Page Management

1.  **Implement Book Management:**
    *   Build the CRUD interface for `Buku` (Books).
    *   This will involve more complex forms to handle relationships with authors, categories, and publishers.

2.  **Implement Page Management:**
    *   Create the interface for managing `Halaman` (Pages) within a book.
    *   This will be the core translation interface, allowing for side-by-side text entry.

## Phase 3: RBAC and Public Portal

1.  **Implement RBAC:**
    *   Build the administrative interfaces for managing `Pengguna` (Users), `Jabatan` (Roles), and `Hak` (Permissions).
    *   Integrate permission checks into the back-office CRUD operations.

2.  **Build the Public Portal:**
    *   Create the book browsing and reading interface for registered users.
    *   Implement the user's personal bookshelf feature.

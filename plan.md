# Arabic Book Translation Platform - Preliminary Plan called maragha

This document outlines the initial plan for the Arabic book translation web application.

## 1. Core Concept

The application will consist of two main parts:
1.  **Back Office:** A secure area for managing the translation process, including books, authors, categories, and user access control.
2.  **Public Portal:** A portal for registered users to browse and read published (translated) books.

## 2. Technology Stack

-   **Framework:** SvelteKit 2
-   **Database:** SQLite
-   **Authentication:** Auth.js (SvelteKitAuth)
-   **UI Components:** shadcn-svelte

## 3. Database Schema

The database will use SQLite and will be structured as follows.

### Tables

-   **`pengguna`** (Users)
-   **`jabatan`** (Roles)
-   **`pengguna_jabatan`** (User-Role join table)
-   **`hak`** (Permissions)
-   **`buku`** (Books)
-   **`halaman`** (Pages)
-   **`penulis`** (Authors)
-   **`buku_penulis`** (Book-Author join table)
-   **`kategori`** (Categories)
-   **`buku_kategori`** (Book-Category join table)
-   **`penerbit`** (Publishers)

### Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    pengguna {
        string id PK
        string username
        string password_hash
    }

    jabatan {
        string id PK
        string nama
    }

    pengguna_jabatan {
        string pengguna_id FK
        string jabatan_id FK
    }

    hak {
        string id PK
        string jabatan_id FK
        string table_name
        boolean can_create
        boolean can_read
        boolean can_update
        boolean can_delete
    }

    buku {
        int id PK
        int revisi PK
        string judul
        string edisi "nullable"
        string status "enum('draft', 'terbit', 'batal')"
        datetime dibuatPada
        string dibuatOleh FK
        datetime diubahPada
        string diubahOleh FK
        int penerbit_id "nullable" FK
    }

    halaman {
        int id PK
        int buku_id FK
        int pageNumber
        string tulisan
        string terjemah "nullable"
        string komentar "nullable"
        string tangkapan "nullable"
        string status "enum('draft', 'ulas', 'setuju', 'revisi')"
    }

    penulis {
        int id PK
        string nama
    }

    buku_penulis {
        int buku_id FK
        int penulis_id FK
    }

    kategori {
        int id PK
        string nama
    }

    buku_kategori {
        int buku_id FK
        int kategori_id FK
    }

    penerbit {
        int id PK
        string nama
    }

    pengguna ||--o{ pengguna_jabatan : "has"
    jabatan ||--o{ pengguna_jabatan : "has"
    jabatan ||--o{ hak : "defines"
    pengguna }o--|| buku : "created"
    pengguna }o--|| buku : "updated"
    penerbit }o--|| buku : "publishes"
    buku ||--o{ halaman : "contains"
    buku }o--o{ buku_penulis : "written by"
    penulis ||--o{ buku_penulis : "writes"
    buku }o--o{ buku_kategori : "belongs to"
    kategori ||--o{ buku_kategori : "groups"

```

## 4. Back-Office Features

The back-office will be a protected area requiring authentication and authorization.

### 4.1. Role-Based Access Control (RBAC)

-   **Pengguna (Users):** Can be assigned one or more `Jabatan` (Roles).
-   **Jabatan (Roles):** Defines a set of permissions. Examples: Administrator, Translator, Editor, Reviewer.
-   **Hak (Permissions):** Specifies CRUD access (`can_create`, `can_read`, `can_update`, `can_delete`) for each table (`buku`, `penerbit`, `penulis`, `kategori`, `halaman`). Permissions are assigned to roles.

### 4.2. CRUD Operations

The back-office will provide interfaces for managing the following:

-   **Buku (Books):**
    -   Create new book entries (title, author, category, etc.).
    -   Read/View a list of all books and their details.
    -   Update book information, including status (`draft`, `terbit`, `batal`).
    -   Delete books (soft or hard delete to be decided).
-   **Halaman (Pages):**
    -   Create and manage pages within a book.
    -   Add original Arabic text (`tulisan`).
    -   Add translations (`terjemah`).
    -   Update page status (`draft`, `ulas`, `setuju`, `revisi`).
    -   Add comments and screenshots.
-   **Penulis (Authors), Kategori (Categories), Penerbit (Publishers):**
    -   Standard CRUD operations to manage these lookup tables.
-   **Pengguna (Users) & Jabatan (Roles):**
    -   Admin-level interface to manage users and assign roles.
    -   Admin-level interface to define roles and their permissions.

## 5. Public Portal Features

The public portal will be accessible to registered users.

### 5.1. User Authentication

-   User registration and login.
-   Password reset functionality.
-   Users can manage their own profiles.

### 5.2. Book Library

-   Browse a gallery of all published books (`status` = `terbit`).
-   Search and filter books by `judul`, `penulis`, or `kategori`.
-   View book details, including author, publisher, and a brief synopsis.

### 5.3. Reading Experience

-   A clean, readable interface for viewing book pages.
-   Side-by-side view of the original Arabic text (`tulisan`) and the translation (`terjemah`).
-   Navigation between pages of a book.
-   Users can maintain a personal collection or "bookshelf" of books they are reading.

## 6. Libraries and Tools

-   **Authentication:** [Auth.js](https://authjs.dev/) (SvelteKitAuth) is a complete open-source authentication solution for SvelteKit. It is feature-rich, secure, and well-maintained, making it an excellent choice for this project.
-   **UI Components:** [carbon-svelte](https://svelte.carbondesignsystem.com/) is an excellent choice for building the UI. It offers a set of accessible and customizable components that will speed up development.
-   **ORM/Query Builder:** [Drizzle ORM](https://orm.drizzle.team/) is a TypeScript ORM that works well with SQLite and SvelteKit. It will help us interact with the database in a type-safe way.

## 7. Project Structure

Here is a proposed directory structure for the SvelteKit project:

```
/
├── src/
│   ├── lib/
│   │   ├── server/
│   │   │   ├── db/
│   │   │   │   ├── index.ts       # Drizzle ORM setup
│   │   │   │   └── schema.ts      # Database schema definitions
│   │   │   └── auth.ts            # Auth.js (SvelteKitAuth) configuration
│   │   ├── components/            # Shared Svelte components (UI)
│   │   └── utils/                 # Utility functions
│   ├── routes/
│   │   ├── (portal)/              # Routes for the public portal
│   │   │   ├── +layout.svelte
│   │   │   ├── +page.svelte
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── books/
│   │   │       └── [id]/
│   │   │           └── +page.svelte
│   │   └── (back-office)/         # Routes for the back-office
│   │       ├── +layout.svelte
│   │       ├── +page.svelte
│   │       ├── admin/
│   │       │   ├── users/
│   │       │   └── roles/
│   │       └── manage/
│   │           ├── books/
│   │           ├── authors/
│   │           └── categories/
│   └── app.html
├── static/
└── package.json

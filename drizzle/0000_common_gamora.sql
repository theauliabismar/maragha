CREATE TABLE `account` (
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `penulis` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nama` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `buku_penulis` (
	`buku_id` integer,
	`penulis_id` integer,
	PRIMARY KEY(`buku_id`, `penulis_id`),
	FOREIGN KEY (`buku_id`) REFERENCES `buku`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`penulis_id`) REFERENCES `penulis`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `buku_kategori` (
	`buku_id` integer,
	`kategori_id` text,
	PRIMARY KEY(`buku_id`, `kategori_id`),
	FOREIGN KEY (`buku_id`) REFERENCES `buku`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`kategori_id`) REFERENCES `kategori`(`nama`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `buku` (
	`id` integer NOT NULL,
	`revisi` integer NOT NULL,
	`judul` text NOT NULL,
	`edisi` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`dibuatPada` integer NOT NULL,
	`dibuatOleh` text,
	`diubahPada` integer NOT NULL,
	`diubahOleh` text,
	`penerbit_id` integer,
	PRIMARY KEY(`id`, `revisi`),
	FOREIGN KEY (`dibuatOleh`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`diubahOleh`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`penerbit_id`) REFERENCES `penerbit`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `kategori` (
	`nama` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `halaman` (
	`id` integer PRIMARY KEY NOT NULL,
	`buku_id` integer,
	`pageNumber` integer NOT NULL,
	`tulisan` text NOT NULL,
	`terjemah` text,
	`komentar` text,
	`tangkapan` text,
	`status` text DEFAULT 'draft' NOT NULL,
	FOREIGN KEY (`buku_id`) REFERENCES `buku`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `hak` (
	`id` text PRIMARY KEY NOT NULL,
	`jabatan_id` text,
	`table_name` text NOT NULL,
	`can_create` integer DEFAULT false NOT NULL,
	`can_read` integer DEFAULT false NOT NULL,
	`can_update` integer DEFAULT false NOT NULL,
	`can_delete` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`jabatan_id`) REFERENCES `jabatan`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `penerbit` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nama` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `jabatan` (
	`id` text PRIMARY KEY NOT NULL,
	`nama` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pengguna_jabatan` (
	`pengguna_id` text,
	`jabatan_id` text,
	PRIMARY KEY(`pengguna_id`, `jabatan_id`),
	FOREIGN KEY (`pengguna_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`jabatan_id`) REFERENCES `jabatan`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`emailVerified` integer,
	`image` text,
	`password` text
);
--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);

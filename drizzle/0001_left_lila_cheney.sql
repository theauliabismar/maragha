CREATE TABLE `buku_pengguna` (
	`pengguna_id` text,
	`buku_id` integer,
	PRIMARY KEY(`pengguna_id`, `buku_id`),
	FOREIGN KEY (`pengguna_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`buku_id`) REFERENCES `buku`(`id`) ON UPDATE no action ON DELETE no action
);

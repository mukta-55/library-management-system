# Library Management System

A full-stack library management system. The `api/` folder contains the NestJS backend, which uses a PostgreSQL database through Prisma.

## Schema Decisions

### Why Book references Genre instead of embedding it

`Book` stores a `genreId` foreign key that points to a row in the `Genre` table. The relation is declared in `api/prisma/schema.prisma` with `@relation(fields: [genreId], references: [id])`. Genre data is not copied into each book.

- **Single source of truth:** a genre's `name` and `slug` are stored once, in one `Genre` row. Renaming a genre is a single update that every book reflects immediately. If the genre were embedded in each book, the same values would be repeated across many rows and could drift out of sync.
- **Referential integrity:** PostgreSQL is a relational database and enforces the foreign key, so a book cannot reference a genre that does not exist.
- **Querying from both sides:** `Genre` has a `books Book[]` field, so books can be fetched by genre and a genre can be loaded with its books, without duplicating data.
- **Typed access:** Prisma generates a typed client from the schema, so relations are checked by the editor and the compiler.

### Other modeling choices

- `Role` is an enum with the values `PATRON` and `LIBRARIAN`, so a user's role can only be one of those two values. `User.role` defaults to `PATRON`.
- `isbn` on `Book`, `email` on `User`, and `name` and `slug` on `Genre` are `@unique`.
- `Book` tracks `totalCopies` and `availableCopies`, both defaulting to `1`.

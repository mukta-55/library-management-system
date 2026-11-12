import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const catalog = [
  {
    name: 'Fiction',
    slug: 'fiction',
    books: [
      { title: 'Things Fall Apart', author: 'Chinua Achebe' },
      { title: 'Pride and Prejudice', author: 'Jane Austen' },
      { title: 'To Kill a Mockingbird', author: 'Harper Lee' },
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    ],
  },
  {
    name: 'Science Fiction',
    slug: 'science-fiction',
    books: [
      { title: 'Dune', author: 'Frank Herbert' },
      { title: 'Neuromancer', author: 'William Gibson' },
      { title: 'Foundation', author: 'Isaac Asimov' },
      { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin' },
    ],
  },
  {
    name: 'Fantasy',
    slug: 'fantasy',
    books: [
      { title: 'The Hobbit', author: 'J.R.R. Tolkien' },
      { title: 'A Wizard of Earthsea', author: 'Ursula K. Le Guin' },
      { title: 'The Name of the Wind', author: 'Patrick Rothfuss' },
      { title: 'Mistborn: The Final Empire', author: 'Brandon Sanderson' },
    ],
  },
  {
    name: 'Mystery',
    slug: 'mystery',
    books: [
      { title: 'And Then There Were None', author: 'Agatha Christie' },
      { title: 'The Hound of the Baskervilles', author: 'Arthur Conan Doyle' },
      { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson' },
      { title: 'Gone Girl', author: 'Gillian Flynn' },
    ],
  },
  {
    name: 'Non-Fiction',
    slug: 'non-fiction',
    books: [
      { title: 'Sapiens', author: 'Yuval Noah Harari' },
      {
        title: 'The Immortal Life of Henrietta Lacks',
        author: 'Rebecca Skloot',
      },
      { title: 'Educated', author: 'Tara Westover' },
      { title: 'Born a Crime', author: 'Trevor Noah' },
    ],
  },
];

async function main() {
  let n = 1;

  for (const entry of catalog) {
    const genre = await prisma.genre.upsert({
      where: { name: entry.name },
      update: {},
      create: { name: entry.name, slug: entry.slug },
    });

    for (const book of entry.books) {
      const isbn = '978000000' + String(n).padStart(4, '0');
      n++;

      await prisma.book.upsert({
        where: { isbn },
        update: {},
        create: {
          title: book.title,
          author: book.author,
          isbn,
          totalCopies: 3,
          availableCopies: 3,
          genreId: genre.id,
        },
      });
    }
  }

  const genreCount = await prisma.genre.count();
  const bookCount = await prisma.book.count();
  console.log(`Seeded ${genreCount} genres and ${bookCount} books.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

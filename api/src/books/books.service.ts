import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  findAll(genreId?: string, search?: string, page?: string, limit?: string) {
    const where: Prisma.BookWhereInput = {};

    if (genreId) {
      const id = Number(genreId);
      if (Number.isNaN(id)) {
        throw new BadRequestException('genreId must be a number');
      }
      where.genreId = id;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    const pageNumber = Math.max(parseInt(page ?? '', 10) || 1, 1);
    const take = Math.max(parseInt(limit ?? '', 10) || 10, 1);
    const skip = (pageNumber - 1) * take;

    return this.prisma.book.findMany({
      where,
      include: { genre: true },
      skip,
      take,
    });
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException(`Book ${id} not found`);
    return book;
  }

  create(dto: CreateBookDto) {
    return this.prisma.book.create({ data: dto });
  }

  async update(id: number, dto: UpdateBookDto) {
    await this.findOne(id);
    return this.prisma.book.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.book.delete({ where: { id } });
  }
}

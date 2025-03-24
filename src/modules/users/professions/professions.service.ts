import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProfessionDto } from './professions.dto';
import { Profession } from './professions.entity';

@Injectable()
export class ProfessionsService {
  constructor(
    @InjectRepository(Profession)
    private professionRepository: Repository<Profession>,
  ) {}

  async findByUser(userId: number): Promise<Profession[]> {
    const professions = await this.professionRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!professions || professions.length === 0) {
      throw new NotFoundException(`Không tìm thấy profession cho user ID ${userId}`);
    }

    return professions;
  }

  async update(id: number, dto: UpdateProfessionDto): Promise<Profession> {
    const profession = await this.professionRepository.findOne({ where: { id } });

    if (!profession) {
      throw new NotFoundException(`Profession với ID ${id} không được tìm thấy`);
    }

    Object.assign(profession, dto);
    return this.professionRepository.save(profession);
  }
}

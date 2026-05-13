import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entity/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  create(dto: CreateAdminDto): Promise<Admin> {
    const admin = this.adminRepository.create(dto);
    return this.adminRepository.save(admin);
  }

  findAll(): Promise<Admin[]> {
    return this.adminRepository.find({ relations: ['rooms'] });
  }

  async findOne(admin_id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: { admin_id },
      relations: ['rooms'],
    });

    if (!admin) {
      throw new NotFoundException(`Admin #${admin_id} not found`);
    }

    return admin;
  }

  async update(admin_id: number, dto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.findOne(admin_id);
    Object.assign(admin, dto);
    return this.adminRepository.save(admin);
  }

  async remove(admin_id: number): Promise<void> {
    const result = await this.adminRepository.delete({ admin_id });

    if (!result.affected) {
      throw new NotFoundException(`Admin #${admin_id} not found`);
    }
  }
}

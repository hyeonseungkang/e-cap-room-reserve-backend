import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from './entity/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(dto: CreateAdminDto): Promise<Admin> {
    const data = { ...dto };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const admin = this.adminRepository.create(data);
    return this.adminRepository.save(admin);
  }

  findByEmail(email: string): Promise<Admin | null> {
    return this.adminRepository.findOne({ where: { email } });
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
    const data = { ...dto };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    Object.assign(admin, data);
    return this.adminRepository.save(admin);
  }

  async remove(admin_id: number): Promise<void> {
    const result = await this.adminRepository.delete({ admin_id });

    if (!result.affected) {
      throw new NotFoundException(`Admin #${admin_id} not found`);
    }
  }
}

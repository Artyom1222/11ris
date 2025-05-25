import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from '../entities/admin.entity';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { EntityNotFoundException } from '../../../common/exceptions/not-found.exception';
import { DuplicateResourceException } from '../../../common/exceptions/duplicate-resource.exception';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async findAll(): Promise<Admin[]> {
    return this.adminRepository.find();
  }

  async findOne(id: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    
    if (!admin) {
      throw new EntityNotFoundException('Администратор');
    }
    
    return admin;
  }

  async findByLogin(login: string): Promise<Admin | null> {
    return this.adminRepository.findOne({ where: { login } });
  }

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const existingAdmin = await this.findByLogin(createAdminDto.login);
    
    if (existingAdmin) {
      throw new DuplicateResourceException('Администратор с таким логином уже существует');
    }
    
    const hashedPassword = await this.hashPassword(createAdminDto.password);
    
    const admin = this.adminRepository.create({
      login: createAdminDto.login,
      password: hashedPassword,
      isActive: createAdminDto.isActive !== undefined ? createAdminDto.isActive : true,
    });
    
    return this.adminRepository.save(admin);
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.findOne(id);
    
    if (updateAdminDto.login && updateAdminDto.login !== admin.login) {
      const existingAdmin = await this.findByLogin(updateAdminDto.login);
      
      if (existingAdmin && existingAdmin.id !== id) {
        throw new DuplicateResourceException('Администратор с таким логином уже существует');
      }
      
      admin.login = updateAdminDto.login;
    }
    
    if (updateAdminDto.password) {
      admin.password = await this.hashPassword(updateAdminDto.password);
    }
    
    if (updateAdminDto.isActive !== undefined) {
      admin.isActive = updateAdminDto.isActive;
    }
    
    return this.adminRepository.save(admin);
  }

  async remove(id: string): Promise<void> {
    const admin = await this.findOne(id);
    await this.adminRepository.remove(admin);
  }

  async validatePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}

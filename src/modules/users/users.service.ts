import { CreateUserDto, ExistingUserDto } from './user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserProfile } from './profiles/profiles.entity';
import { UserRole } from 'src/common/constants/enum';
import { Profession } from './professions/professions.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,

    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    @InjectRepository(Profession)
    private professionRepository: Repository<Profession>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async comparePasswords(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashPassword);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    const doesUserExist = !!user;

    if (!doesUserExist) return null;

    const doesPasswordMatch = await this.comparePasswords(
      password,
      user.password,
    );

    if (!doesPasswordMatch) return null;

    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: id },
    });
  }

  async findByEmail(email: string): Promise<User | any> {
    return this.userRepository.findOne({
      where: { email: email },
    });
  }

  async register(CreateUserDto: CreateUserDto): Promise<User | any> {
    try {
      const { email, password, role } = CreateUserDto;

      const existingUser = await this.findByEmail(email);

      if (existingUser) return 'Email taken!';

      const hashPassword = await this.hashPassword(password);

      const newUser = this.userRepository.create({
        email,
        password: hashPassword,
        role,
      });
      const savedUser = await this.userRepository.save(newUser);

      // Tự động tạo Profile mặc định cho User
      const profile = this.userProfileRepository.create({
        user: savedUser,
      });
      await this.userProfileRepository.save(profile);

      // Thêm chuyên ngành rỗng cho User
      if (role === UserRole.TEACHER) {
        const profession = this.professionRepository.create({
          user: savedUser,
        });
        await this.professionRepository.save(profession);
      }

      return savedUser;
    } catch (error) {
      throw new HttpException(
        'Không thể tạo người dùng. Lỗi: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(
    existingUserDto: ExistingUserDto,
  ): Promise<{ token: string } | null | User | any> {
    const { email, password } = existingUserDto;
    const user = await this.validateUser(email, password);

    if (!user) return null;

    const jwt = await this.jwtService.signAsync({ user });
    console.log(jwt);

    return {token: jwt};
  }
}

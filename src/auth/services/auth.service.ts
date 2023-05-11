import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from 'auth/dto/auth-credentials.dto';
import { User } from 'auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'auth/jwt-payload.interface';
import { response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { mail, username, password } = authCredentialsDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.usersRepository.create({
            mail,
            username,
            password: hashedPassword,
        });

        try {
            await this.usersRepository.save(user);
        }
        catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Email already exists')
            }
            else {
                throw new InternalServerErrorException();
            }
        }
    }

    async signIn(mail: string, password: string): Promise<{ accessToken }> {
        const user = await this.usersRepository.findOne({
            where: { mail }
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = { mail };
            const accessToken: string = await this.jwtService.sign(payload);
            return { accessToken };
        } else {
            throw new UnauthorizedException('Check your credentials');
        }
    }
}

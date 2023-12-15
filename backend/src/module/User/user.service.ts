/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
    BadRequestException,
    Body,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import * as fs from 'node:fs';
import { Users } from 'src/Schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterUserDto } from './dto/register.dto';
import * as crypto from 'crypto';
import { Login } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as path from 'path';
@Injectable()
export class UserService {
    constructor(
        @InjectModel(Users.name) private UsersModel: Model<Users>,
        private readonly jwtService: JwtService,
    ) { }

    // Đăng kí tài khoản
    public async RegisterAccout(
        @Body() registerUserDto: RegisterUserDto,
    ): Promise<object> {
        try {
            const id = await this.GetMaxID();
            const created_at = Math.round(new Date().getTime());
            const password = this.createMd5(registerUserDto.password);
            const conditions = {
                id,
                created_at,
                password,
                birthDay: new Date(registerUserDto.birthDay).getTime(),
                userName: registerUserDto.userName,
                name: registerUserDto.name
            }
            await this.UsersModel.create(conditions);
            const token = await this.generateToken(conditions);
            const refreshToken = await this.generateToken(conditions);
            return {
                id,
                token,
                refreshToken,
            };
        } catch (error) {
            console.log(error);
            throw new BadRequestException(error.message, 'Bad request');
        }
    }

    // lấy id lớn nhất
    public async GetMaxID(): Promise<number> {
        try {
            const response = await this.UsersModel.findOne({}, { id: 1 })
                .sort({ id: -1 })
                .lean();
            if (response) {
                return response.id + 1;
            } else {
                return 1;
            }
        } catch (error) {
            throw new BadRequestException('Bad request');
        }
    }

    // tạo mật khẩu md5
    private createMd5(password: string): string {
        return crypto.createHash('md5').update(password).digest('hex');
    }

    // kiểm tra mật khẩu
    private verifyPassword(
        inputPassword: string,
        hashedPassword: string,
    ): boolean {
        const md5Hash = crypto
            .createHash('md5')
            .update(inputPassword)
            .digest('hex');
        return md5Hash === hashedPassword;
    }

    // hàm tạo token
    private generateToken(payload: any): Promise<string> {
        return this.jwtService.signAsync(payload);
    }

    // check tài khoản tồn tại
    public async checkAccountExists(userName: string): Promise<boolean> {
        try {
            const check = await this.UsersModel.findOne({ userName }).lean();
            return !!check;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    // hàm đăng nhập
    public async login(@Body() login: Login): Promise<object> {
        const hashedPassword = this.createMd5(login.password);
        const checkExists = await this.UsersModel.findOne({ userName: login.userName, password: hashedPassword }).lean();
        if (!checkExists) throw new NotFoundException("Tài khoản hoặc mật khẩu không chính xác");
        const token = await this.generateToken(checkExists);
        const refreshToken = await this.generateToken(checkExists);
        return { token, refreshToken }
    }

    // upload file 
    public async uploadFile(file: any, time: number, pathFolder: string) {
        const path1 = `./storage/pictures/${pathFolder}/`;
        const filePath = `./storage/pictures/${pathFolder}/${time}_${file.originalname}`;
        const fileCheck = path.extname(filePath);
        if (['.jpg', '.png'].includes(fileCheck.toLocaleLowerCase()) === false) {
            return false;
        }
        if (!fs.existsSync(path1)) {
            fs.mkdirSync(path1, { recursive: true });
        }
        fs.writeFileSync(filePath, file.buffer);
        return `/pictures/${pathFolder}/${time}_${file.originalname}`;
    }

    // lưu file đã upload vào base
    public async saveFileOnBase(id: number, path: string): Promise<void> {
        try {
            await this.UsersModel.findOneAndUpdate({ id }, { avatar: path });
        } catch (error) {
            throw new BadRequestException(error.message, 'Bad request');
        }
    }

    // lấy thông tin người dùng (thiếu lấy danh sách bạn bè online và offline)
    public async getInfoUser(id: number): Promise<object> {
        const response = await this.UsersModel.aggregate([
            { $match: { id } }
        ]);
        for (let i = 0; i < response.length; i++) {
            const element = response[i];
            element.avatar = `${process.env.DOMAIN}${element.avatar}`;
        }
        return response

    }

    // tìm kiếm người dùng
    public async SearchUser(key: string): Promise<object> {
        console.log("🚀 ~ file: user.service.ts:153 ~ UserService ~ SearchUser ~ key:", key)
        const response = await this.UsersModel.find({name:new RegExp(key, 'i')});
        for (let i = 0; i < response.length; i++) {
            const element = response[i];
            if (element.avatar) element.avatar = `${process.env.DOMAIN}${element.avatar}`;
        }
        return response
    }
}

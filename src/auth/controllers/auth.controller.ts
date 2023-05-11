import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialsDto } from 'auth/dto/auth-credentials.dto';
import { AuthService } from 'auth/services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Post('/signup')
    signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/signin')
    async signIn(
        @Body('mail') mail: string,
        @Body('password') password: string,
    ): Promise<{ accessToken }> {
        return await this.authService.signIn(mail, password);
    }
}

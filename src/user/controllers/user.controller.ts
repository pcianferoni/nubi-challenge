import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FindUserOutput } from '../dto/find-user.output';
import { UpdateUserOutput } from '../dto/update-user.output';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { PublicAccess } from '../../auth/decorators/public.decorator';
import { OwnUserAccess } from '../../auth/decorators/own-user.decorator';
import { RegisteredUser } from '../../auth/decorators/registered-user.decorator';
import { SortingDirection } from '../../constants/sorting';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // callbacks
  @PublicAccess()
  @Post()
  @ApiResponse({ status: 201, description: 'User successfully created' })
  create(@Body() createUserDto: CreateUserDto, @Res() response): void {
    this.userService.create(createUserDto, (error, user) => {
      if (error) {
        response.status(400).json({ error });
      } else {
        response.status(200).json({ user, message: 'User created!' });
      }
    });
  }

  @RegisteredUser()
  @Get()
  @ApiResponse({
    status: 200,
    type: FindUserOutput,
    description: 'List of users obtained successfully',
  })
  find(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDirection') sortDirection?: SortingDirection,
    @Query('match') match?: { [key: string]: string },
  ): Promise<FindUserOutput> {
    const pagination = { page, limit };
    const sorting = { sortBy, sortDirection };
    const matching = match;
    return this.userService.find(pagination, sorting, matching);
  }

  // promises
  @OwnUserAccess()
  @Patch(':email')
  @ApiResponse({ status: 201, type: UpdateUserOutput, description: 'User successfully updated' })
  update(
    @Param('email') email: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserOutput> {
    return this.userService
      .update(email, updateUserDto)
      .then((user) => ({ user, message: 'User updated!' }));
  }

  @OwnUserAccess()
  @Delete(':email')
  @ApiResponse({ status: 201, description: 'User successfully deleted' })
  remove(@Param('email') email: string): Promise<{ message: string }> {
    return this.userService.remove(email);
  }
}

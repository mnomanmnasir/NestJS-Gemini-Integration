import {
    Body,
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';

import { GeminiService } from './gemini.service';
import { GetAIMessageDTO } from './model/get-ai-response.dto';

@Controller('gemini')
export class GeminiController {
    constructor(private readonly service: GeminiService) { }

    /* The `@Post('')` decorator in the code snippet is used to define a POST route in a NestJS
    controller. In this case, the route is for the endpoint under the 'gemini' path. When a POST
    request is made to this endpoint, the `getResponse` method in the `GeminiController` class will
    be executed. */
    @Post('')
    @UsePipes(new ValidationPipe({ transform: true }))
    getResponse(@Body() data: GetAIMessageDTO) {
        return this.service.generativeText(data);
    }
}

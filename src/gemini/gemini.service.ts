import { ChatSession, GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetAIMessageDTO } from './model/get-ai-response.dto';
// import { u4 } from 'uuid'
import { v4 as uuidv4 } from 'uuid';

/* `GEMINI_MODEL` is a constant variable in the `GeminiService` class that holds the name of the
specific GenerativeModel to be used for generating text. In this case, the value of
`GEMINI_MODEL` is set to `'gemini-1.5-flash'`, which is the model identifier used when
initializing the GenerativeModel instance in the constructor of the `GeminiService` class.
This model will be used by the Google Generative AI service to generate text based on user
prompts. */
const GEMINI_MODEL = 'gemini-1.5-flash';

@Injectable()

/* The `GeminiService` class is a service in a TypeScript application that interacts with
the Google Generative AI service to generate text based on user prompts. Here's a
summary of what `GeminiService` is doing: */
export class GeminiService {
    private readonly googleAI: GoogleGenerativeAI;
    private readonly model: GenerativeModel;
    private chatSessions: { [sessionId: string]: ChatSession } = {}
    private readonly logger = new Logger(GeminiService.name)

    /* The `constructor` in the `GeminiService` class is initializing the class instance by setting up
    the Google Generative AI service and the specific GenerativeModel to be used for generating
    text. Here's a breakdown of what it does: */
    constructor(configService: ConfigService) {
        const geminiApiKey = configService.get('GEMINI_API_KEY')
        this.googleAI = new GoogleGenerativeAI(geminiApiKey);
        this.model = this.googleAI.getGenerativeModel({
            model: GEMINI_MODEL,

        })
    }

    /* The `getChatSession` method in the `GeminiService` class is responsible for managing
   chat sessions with the Google Generative AI model. Here's a breakdown of what it does: */
    private getChatSession(sessionId?: string) {
        const sessionIdToUse = sessionId ?? uuidv4(); // ✅ fixed   
        let result = this.chatSessions[sessionIdToUse]

        if (!result) {
            result = this.model.startChat();
            this.chatSessions[sessionIdToUse] = result
        }
        return {
            sessionId: sessionIdToUse,
            chat: result
        }
    }

    /* The `generativeText` method in the `GeminiService` class is responsible for generating
   text using the Google Generative AI model. Here's a breakdown of what it does: */
    async generativeText(data: GetAIMessageDTO) {
        try {
            const { sessionId, chat } = this.getChatSession(data.sessionId)
            const result = await chat.sendMessage(data.prompt)

            return {
                result: await result.response.text(),
                sessionId
            }

        } catch (error) {
            this.logger.error("Error sending message to gemini API", error)
        }
    }
}

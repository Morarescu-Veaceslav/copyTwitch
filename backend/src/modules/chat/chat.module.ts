import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';

@Module({
  providers: [ChatResolver, ChatService],
  exports: [ChatService]
})
export class ChatModule {}

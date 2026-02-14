import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AppFeature } from './app.entity';

@Module({
  imports: [MongooseModule.forFeature([AppFeature], 'test')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

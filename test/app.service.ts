import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { App, type AppDocument } from './app.entity';
import { db_name } from './constants';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(App.name, db_name)
    private readonly model: Model<App>,
  ) {}

  async getHello(): Promise<AppDocument> {
    const inserted: AppDocument = await this.model.insertOne({
      name: 'Kripto Root',
    });
    return inserted;
  }
}

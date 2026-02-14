import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument } from 'mongoose';

@Schema()
export class App {
  @Prop()
  name: string;
}

export type AppDocument = HydratedDocument<App>;
export const AppSchema = SchemaFactory.createForClass(App);
export const AppFeature: ModelDefinition = {
  name: App.name,
  schema: AppSchema,
  collection: 'apps',
};

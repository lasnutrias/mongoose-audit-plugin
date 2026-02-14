import { Schema, UpdateQuery } from 'mongoose';
import { AuditOptions } from './audit.options';

/**
 * Plugin that allows for adding user audit fields into the entities.
 *
 * @param schema schema to attach the plugin to
 * @param options options to control the fields names and how to get the user
 */
export function AuditPlugin(schema: Schema, options: AuditOptions = {}) {
  // 1. Determinar nombres de campos (conceptos de cortocircuito)
  const createdByField =
    options.createdBy === true || options.createdBy === undefined
      ? 'createdBy'
      : options.createdBy;

  const updatedByField =
    options.updatedBy === true || options.updatedBy === undefined
      ? 'updatedBy'
      : options.updatedBy;

  const getUser = () => options.currentUser?.() || 'UNKNOWN_USER';

  // 2. Añadir campos al esquema dinámicamente si no son false
  const schemaAdditions: Record<string, { type: any }> = {};
  if (createdByField) schemaAdditions[createdByField] = { type: String };
  if (updatedByField) schemaAdditions[updatedByField] = { type: String };
  schema.add(schemaAdditions);

  // 3. Hook para Creación (save)
  schema.pre('save', function () {
    const user = getUser();

    if (this.isNew && createdByField) {
      this.set(createdByField, user);
    }

    if (updatedByField) {
      this.set(updatedByField, user);
    }
  });

  // 4. Hook para Actualizaciones (Queries)
  schema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function () {
    const user = getUser();
    const update = this.getUpdate() as UpdateQuery<any>;
    const $set: Record<string, any> = {};
    const $setOnInsert: Record<string, any> = {};
    if (updatedByField) {
      $set[updatedByField] = user;
    }
    if (createdByField) {
      $setOnInsert[createdByField] = user;
    }
    this.setUpdate({
      ...update,
      $set: { ...update?.$set, ...$set },
      $setOnInsert: { ...update?.$setOnInsert, ...$setOnInsert },
    });
  });
}

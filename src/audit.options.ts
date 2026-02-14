/**
 * Options for customizing the autit fields names.
 */
export interface AuditOptions {
  /**
   * Controls whether to use a default field name, custom field name or do not produce the field at all.
   * true or undefined will use default field name 'createdBy'. A string value will customize the field name. False will not produce the field.
   */
  createdBy?: string | boolean;
  /**
   * Controls whether to use a default field name, custom field name or do not produce the field at all.
   * true or undefined will use default field name 'updatedBy'. A string value will customize the field name. False will not produce the field.
   */
  updatedBy?: string | boolean;
  /**
   * Closure that produces a user name to use in the createdBy and updatedBy processing. IS recomended that the value is taken from a requestscope.
   * @returns a function that produces the user name.
   */
  currentUser?: () => string;
}

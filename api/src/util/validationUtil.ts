function isNonEmptyString(value: any): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateStringAndReturnId(id: any): string {
  if (!isNonEmptyString(id)) {
    throw new Error(`Id is not a a valid string: [${id}]`);
  }
  return id;
}

export function validateArrayOfStringsAndReturn(ids: string[]): string[] {
  return ids.map((id) => validateStringAndReturnId(id));
}

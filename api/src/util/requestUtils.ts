import { HttpRequest } from '@azure/functions';
import { validateStringAndReturnId } from './validationUtil';
import { InputError } from '../types/error';

export function getIdFromBody(requestBody): string {
  try {
    const id = requestBody['id'].toString();
    return validateStringAndReturnId(id);
  } catch {
    throw new InputError('Number Id provided is not well formed');
  }
}

export function getIdFromParams(request: HttpRequest): string {
  try {
    return validateStringAndReturnId(request.params['id'].trim());
  } catch {
    throw new InputError('String Id provided is not well formed');
  }
}

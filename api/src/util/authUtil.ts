import { HttpRequest } from '@azure/functions';
import { AccessError } from '../types/error';

// TODO: create a library to share these
enum Roles {
  anonymous = 'anonymous',
  authenticated = 'authenticated',
  admin = 'admin',
}

function getUserInfo(request: HttpRequest) {
  const header = request.headers.get('x-ms-client-principal');
  if (header) {
    const decoded = Buffer.from(header, 'base64').toString('ascii');
    return JSON.parse(decoded);
  }
  return null;
}

export function getUserName(request: HttpRequest): string {
  const userInfo = getUserInfo(request);
  if (userInfo) {
    return userInfo.userDetails;
  }
  return null;
}

function getUserRoles(request: HttpRequest): string[] {
  const userInfo = getUserInfo(request);
  if (userInfo) {
    return userInfo.userRoles;
  }
  return null;
}

export function isUserAdmin(request: HttpRequest) {
  const roles = getUserRoles(request);
  return !!roles && roles.includes(Roles.admin.toString());
}

export function requireAdmin(request: HttpRequest) {
  if (!isUserAdmin(request)) {
    throw new AccessError('You are not an Admin!');
  }
}

export function requireAuthenticated(request: HttpRequest) {
  const roles = getUserRoles(request);
  if (!roles || !roles.includes(Roles.authenticated.toString())) {
    throw new AccessError('You are not an Authenticated!');
  }
}

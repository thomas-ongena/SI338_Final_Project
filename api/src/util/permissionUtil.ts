import { HttpRequest } from '@azure/functions';
import { getUserName, isUserAdmin } from './authUtil';
import { AccessError } from '../types/error';
import permissionTable, { LOC_DUN_KEY } from '../cosmosTables/permissionTable';

export async function validateUserHasAccessToLocDun(request: HttpRequest, locDun: string) {
  if (isUserAdmin(request)) {
    return true;
  } else {
    const userName = getUserName(request);
    const item = await permissionTable.getItembyId(userName);
    const locDuns = item[LOC_DUN_KEY] || [];
    if (!locDuns.includes(locDun)) {
      throw new AccessError(`User [${userName}] does not have access to locDun [${locDun}]`);
    }
  }
}

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { PatchOperation, PatchOperationType } from '@azure/cosmos';
import { removeCosmosMetadata, removeCosmosMetadataFromArray } from '../util/cosmosUtil';
import { getUserName, isUserAdmin, requireAdmin, requireAuthenticated } from '../util/authUtil';
import { BaseError } from '../types/error';
import { validateArrayOfStringsAndReturn } from '../util/validationUtil';
import permissionTable, { LOC_DUN_KEY } from '../cosmosTables/permissionTable';
import locDunContentTable from '../cosmosTables/locDunContentTable';
import { getIdFromBody } from '../util/requestUtils';

// Main handler function for multiple HTTP methods
export async function multiEndpointHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const url = new URL(request.url);
    const path = url.pathname;
    let responseBody;

    // Routing logic based on HTTP method and path
    if (request.method === 'GET' && path === '/api/listLocDuns') {
      responseBody = await listLocDuns(request, context);
    } else if (request.method === 'GET' && path === '/api/manage/listAllUserPermissions') {
      responseBody = await listAllUserPermissions(request, context);
    } else if (request.method === 'PUT' && path === '/api/manage/putUserPermission') {
      responseBody = await putUserPermission(request, context);
    } else if (request.method === 'DELETE' && path === '/api/manage/deleteUser') {
      responseBody = await deleteUser(request, context);
    } else {
      // Unsupported route/method response
      responseBody = { status: 404, body: 'Endpoint not found' };
    }

    return responseBody;
  } catch (error) {
    // If an error is not caught the function will just hang forever
    if (error instanceof BaseError) {
      context.log('A known Error', error);
      return { status: error.StatusCode, body: error.message };
    } else {
      context.log('An Unexpected Error occured', error);
      return {
        status: 500,
        body: 'Failed to fetch loc dun mappings.',
      };
    }
  }
}

export async function listLocDuns(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processing request for listLocDuns`);
  requireAuthenticated(request);
  const userName = getUserName(request);
  context.log(`fetching loc duns ${userName} has access to`);

  if (isUserAdmin(request)) {
    context.log('User is admin fetching all loc duns');
    const allLocDunIds = (await locDunContentTable.listAllItems()).map((item) => item['id']);
    return {
      status: 200,
      body: JSON.stringify(allLocDunIds),
    };
  }

  // fetch the user and add them to the table if they are not already there
  let locDuns = [];
  const item = await permissionTable.getItembyId(userName);

  if (!item) {
    context.log(`First time [${userName}] is here, adding them to the table`);
    await permissionTable.upsertItem({ id: userName, [LOC_DUN_KEY]: [] });
    locDuns = [];
  } else {
    locDuns = item[LOC_DUN_KEY];
  }

  return {
    status: 200,
    body: JSON.stringify(locDuns),
  };
}

app.http('listLocDuns', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: multiEndpointHandler,
});

export async function listAllUserPermissions(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processing request for listAllUserPermissions`);
  requireAdmin(request);

  const items = await permissionTable.listAllItems();

  return {
    status: 200,
    body: JSON.stringify(removeCosmosMetadataFromArray(items)),
  };
}

app.http('listAllUserPermissions', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'manage/listAllUserPermissions',
  handler: multiEndpointHandler,
});

export async function putUserPermission(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processing request for putUserPermission`);
  requireAdmin(request);

  const userNameOfAdmin = getUserName(request);

  const requestBody = await request.json();
  const userNameOfTarget = getIdFromBody(requestBody);
  const locDunPermissions = validateArrayOfStringsAndReturn(requestBody[LOC_DUN_KEY]);

  const patchOperations: PatchOperation[] = [
    {
      op: PatchOperationType.add,
      path: `/${LOC_DUN_KEY}`,
      value: locDunPermissions,
    },
    { op: PatchOperationType.add, path: '/updatedBy', value: userNameOfAdmin },
    {
      op: PatchOperationType.add,
      path: '/updatedAt',
      value: new Date().toISOString(),
    },
  ];

  const item = await permissionTable.getItembyId(userNameOfTarget);
  let newItem: any;

  if (item) {
    context.log('User found in table - patching');
    newItem = await permissionTable.patchItemById(userNameOfTarget, patchOperations);
  } else {
    context.log('User not found in table - upserting');
    const toInsert = {
      id: userNameOfTarget,
      [LOC_DUN_KEY]: locDunPermissions,
      updatedAt: new Date().toISOString(),
      updatedBy: userNameOfAdmin,
    };
    newItem = await permissionTable.upsertItem(toInsert);
  }

  return {
    status: 200,
    body: JSON.stringify(removeCosmosMetadata(newItem)),
  };
}

app.http('putUserPermission', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'manage/putUserPermission',
  handler: multiEndpointHandler,
});

export async function deleteUser(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processing request for deleteUserById`);
  requireAdmin(request);

  const userNameOfAdmin = getUserName(request);
  const requestBody = await request.json();
  const userNameOfTarget = getIdFromBody(requestBody);

  context.log(`Deleting userName: [${userNameOfTarget}] by admin: [${userNameOfAdmin}]`);

  const user = await permissionTable.getItembyId(userNameOfTarget);

  if (user) {
    await permissionTable.deleteItemById(userNameOfTarget);
  } else {
    context.log(`User: [${userNameOfTarget}] was not found. Nothing to delete`);
  }

  return {
    status: 200,
    body: `User ${userNameOfTarget} successfully deleted.`,
  };
}

app.http('deleteUser', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'manage/deleteUser',
  handler: multiEndpointHandler,
});

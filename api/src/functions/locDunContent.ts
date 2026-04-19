import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { CosmosClient, PartitionKeyBuilder } from '@azure/cosmos';
import { removeCosmosMetadata, removeCosmosMetadataFromArray } from '../util/cosmosUtil';
import { getUserName, requireAdmin } from '../util/authUtil';
import { getIdFromBody, getIdFromParams } from '../util/requestUtils';
import { BaseError } from '../types/error';
import { validateUserHasAccessToLocDun } from '../util/permissionUtil';
import LocDunContentTable from '../cosmosTables/locDunContentTable';

// Main handler function for multiple HTTP methods
export async function multiEndpointHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const url = new URL(request.url);
    const path = url.pathname;
    let responseBody;

    // Routing logic based on HTTP method and path
    if (request.method === 'GET' && path === '/api/manage/listLocDunContent') {
      responseBody = await listLocDunContent(request, context);
    } else if (request.method === 'GET' && path === '/api/getLocDunById') {
      responseBody = await getLocDunById(request, context);
    } else if (request.method === 'PUT' && path === '/api/manage/putLocDunById') {
      responseBody = await putLocDunById(request, context);
    } else if (request.method === 'DELETE' && path === '/api/manage/deleteLocDunById') {
      responseBody = await deleteLocDunById(request, context);
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

export async function listLocDunContent(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processing request for listLocDunContent`);
  requireAdmin(request);

  context.log(`Http function processed request for url "${request.url}"`);
  context.log('Fetching all LOC DUN content mappings from Cosmos DB');

  const items = await LocDunContentTable.listAllItems();
  return {
    status: 200,
    body: JSON.stringify(removeCosmosMetadataFromArray(items)),
  };
}

app.http('listLocDunContent', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'manage/listLocDunContent',
  handler: multiEndpointHandler,
});

export async function getLocDunById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processing request for getLocDunById`);

  const userName = getUserName(request);
  context.log(`Http function processed request for url "${request.url}"`);
  const id = getIdFromParams(request);
  await validateUserHasAccessToLocDun(request, id);

  context.log(`Fetching LOC DUN content for id: [${id}] for userName [${userName}]`);

  const item = await LocDunContentTable.getItembyId(id);

  if (!item) {
    return {
      status: 404,
      body: `Item with id: [${id}] not found.`,
    };
  } else {
    return {
      status: 200,
      body: JSON.stringify(removeCosmosMetadata(item)),
    };
  }
}

app.http('getLocDunById', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: multiEndpointHandler,
});

export async function putLocDunById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processing request for putLocDunById`);
  requireAdmin(request);

  const userNameOfAdmin = getUserName(request);

  // TODO Get a type for this
  const requestBody = await request.json();

  const id = getIdFromBody(requestBody);
  const entries = requestBody['entries'] || [];

  context.log(`Updating LOC DUN content for id: [${id}] by userName [${userNameOfAdmin}]`);

  const item = {
    id: id,
    entries: entries,
    updatedBy: userNameOfAdmin,
    updatedAt: new Date().toISOString(),
  };

  const upsertedItem = LocDunContentTable.upsertItem(item);

  return {
    status: 200,
    body: JSON.stringify(removeCosmosMetadata(upsertedItem)),
  };
}

app.http('putLocDunById', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'manage/putLocDunById',
  handler: multiEndpointHandler,
});

export async function deleteLocDunById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processing request for deleteLocDunById`);
  requireAdmin(request);

  const userName = getUserName(request);
  const requestBody = await request.json();
  const id = getIdFromBody(requestBody);

  context.log(`Deleting LOC DUN content for id: [${id}] by userName [${userName}]`);

  const item = await LocDunContentTable.getItembyId(id);

  if (item) {
    await LocDunContentTable.deleteItemById(id);
  } else {
    context.log(`Item with id: [${id}] was not found. Nothing to delete`);
  }

  return {
    status: 200,
    body: `Item with id ${id} successfully deleted.`,
  };
}

app.http('deleteLocDunById', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'manage/deleteLocDunById',
  handler: multiEndpointHandler,
});

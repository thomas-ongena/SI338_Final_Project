export function removeCosmosMetadata<T extends Record<string, any>>(obj: T): T {
  const { _rid, _etag, _self, _attachments, _ts, ...filteredObj } = obj;
  return filteredObj as T;
}

export function removeCosmosMetadataFromArray<T extends Record<string, any>>(items: T[]): T[] {
  return items.map((item) => removeCosmosMetadata(item));
}

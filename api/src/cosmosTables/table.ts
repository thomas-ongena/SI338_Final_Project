import { Container, CosmosClient, PartitionKeyBuilder, PatchOperation } from '@azure/cosmos';

export class CosmosTable {
  protected containerName: string;
  protected container: Container;

  constructor(containerName: string) {
    const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING || '');
    const database = client.database('tmgWebsiteTables');
    this.containerName = containerName;
    this.container = database.container(containerName);
  }

  public async listAllItems() {
    const { resources: items } = await this.container.items.readAll().fetchAll();
    return items;
  }

  public async getItembyId(id: string) {
    const partitionKey = new PartitionKeyBuilder().addValue(id).build();
    const { resource: item } = await this.container.item(id, partitionKey).read();
    return item;
  }

  public async upsertItem(item) {
    const { resource: upsertedItem } = await this.container.items.upsert(item);
    return upsertedItem;
  }

  public async deleteItemById(id: string) {
    const partitionKey = new PartitionKeyBuilder().addValue(id).build();
    await this.container.item(id, partitionKey).delete();
  }

  public async patchItemById(id: string, patchOperations: PatchOperation[]) {
    const partitionKey = new PartitionKeyBuilder().addValue(id).build();
    const { resource: item } = await this.container.item(id, partitionKey).patch(patchOperations);
    return item;
  }
}

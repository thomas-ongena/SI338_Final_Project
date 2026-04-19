import { CosmosTable } from './table';

export const LOC_DUN_KEY = 'locDuns';

const permissionTable = new CosmosTable('permission');
export default permissionTable;

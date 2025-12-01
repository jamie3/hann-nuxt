import { Kysely, Insertable, Updateable, Selectable } from 'kysely';

export abstract class BaseRepository<DB, TableName extends keyof DB & string> {
  protected db: Kysely<DB>;
  protected tableName: TableName;

  constructor(db: Kysely<DB>, tableName: TableName) {
    this.db = db;
    this.tableName = tableName;
  }

  async insert(data: Insertable<DB[TableName]>): Promise<Selectable<DB[TableName]>> {
    return await this.db
      .insertInto(this.tableName)
      .values(data)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async update(
    id: string | number,
    data: Updateable<DB[TableName]>
  ): Promise<Selectable<DB[TableName]>> {
    return await this.db
      .updateTable(this.tableName)
      .set(data)
      .where('id' as any, '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async findAll(): Promise<Selectable<DB[TableName]>[]> {
    return await this.db
      .selectFrom(this.tableName)
      .selectAll()
      .where('is_deleted' as any, '=', false)
      .execute();
  }

  async findById(id: string | number): Promise<Selectable<DB[TableName]> | undefined> {
    return await this.db
      .selectFrom(this.tableName)
      .selectAll()
      .where('id' as any, '=', id)
      .where('is_deleted' as any, '=', false)
      .executeTakeFirst();
  }

  async delete(id: string | number): Promise<void> {
    await this.db
      .updateTable(this.tableName)
      .set({ is_deleted: true } as any)
      .where('id' as any, '=', id)
      .execute();
  }
}

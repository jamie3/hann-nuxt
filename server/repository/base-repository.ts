import { Kysely } from 'kysely';

export abstract class BaseRepository<
  DB,
  TableName extends keyof DB & string,
  SelectType,
  InsertType,
  UpdateType,
> {
  protected db: Kysely<DB>;
  protected tableName: TableName;

  constructor(db: Kysely<DB>, tableName: TableName) {
    this.db = db;
    this.tableName = tableName;
  }

  async insert(data: InsertType): Promise<SelectType> {
    return (await this.db
      .insertInto(this.tableName)
      .values(data as any)
      .returningAll()
      .executeTakeFirstOrThrow()) as Promise<SelectType>;
  }

  async update(id: string | number, data: UpdateType): Promise<SelectType> {
    // Automatically set updated_at timestamp
    const dataWithTimestamp = {
      ...(data as any),
      updated_at: new Date(),
    };

    return (await this.db
      .updateTable(this.tableName)
      .set(dataWithTimestamp as any)
      .where('id' as any, '=', id)
      .returningAll()
      .executeTakeFirstOrThrow()) as SelectType;
  }

  async findAll(): Promise<SelectType[]> {
    return (await this.db
      .selectFrom(this.tableName)
      .selectAll()
      .where('is_deleted' as any, '=', false)
      .execute()) as Promise<SelectType[]>;
  }

  async findById(id: string | number): Promise<SelectType | undefined> {
    return (await this.db
      .selectFrom(this.tableName)
      .selectAll()
      .where('id' as any, '=', id)
      .where('is_deleted' as any, '=', false)
      .executeTakeFirst()) as Promise<SelectType | undefined>;
  }

  async delete(id: string | number): Promise<void> {
    await this.db
      .updateTable(this.tableName)
      .set({ is_deleted: true, updated_at: new Date() } as any)
      .where('id' as any, '=', id)
      .execute();
  }
}

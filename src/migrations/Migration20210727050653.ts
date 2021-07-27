import { Migration } from '@mikro-orm/migrations';

export class Migration20210727050653 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" rename column "_id" to "id";');


    this.addSql('alter table "post" rename column "name" to "title";');
  }

}

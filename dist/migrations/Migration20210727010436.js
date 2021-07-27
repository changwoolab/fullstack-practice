"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20210727010436 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20210727010436 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "post" ("_id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" text not null);');
    }
}
exports.Migration20210727010436 = Migration20210727010436;
//# sourceMappingURL=Migration20210727010436.js.map
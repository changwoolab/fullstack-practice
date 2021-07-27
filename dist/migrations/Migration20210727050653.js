"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20210727050653 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20210727050653 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "post" rename column "_id" to "id";');
        this.addSql('alter table "post" rename column "name" to "title";');
    }
}
exports.Migration20210727050653 = Migration20210727050653;
//# sourceMappingURL=Migration20210727050653.js.map
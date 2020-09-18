import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { Logger } from '../logger';
import ListItemReferencesToValueObjects from './list-item-references-to-value-objects';
export class SchemaMigrationService {
  constructor(server, options) {
    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "migrations", void 0);

    this.logger = new Logger(server, 'SchemaMigrationService');
    this.migrations = [new ListItemReferencesToValueObjects(server)];
  }

  migrate(formDef) {
    var _formDef$version;

    const orderedMigrations = this.migrations.sort((a, b) => a.getInitialVersion() - b.getInitialVersion());
    const initialFormDefVersion = (_formDef$version = formDef.version) !== null && _formDef$version !== void 0 ? _formDef$version : 0;
    const applicableMigrations = orderedMigrations.filter(migration => migration.getInitialVersion() >= initialFormDefVersion);
    applicableMigrations.forEach(migration => {
      var _formDef$version2;

      const migrationInitialVersion = migration.getInitialVersion();
      const currentFormDefVersion = (_formDef$version2 = formDef.version) !== null && _formDef$version2 !== void 0 ? _formDef$version2 : 0;

      if (currentFormDefVersion === migrationInitialVersion) {
        this.logger.info(`Migrating form ${formDef.name} from version ${migrationInitialVersion} to ${migrationInitialVersion + 1}`);
        formDef = migration.migrate(formDef);
        formDef.version = this.getResultantVersion(migrationInitialVersion);
      } else if (migrationInitialVersion > currentFormDefVersion) {
        this.logger.error(`Found a migration from version ${migrationInitialVersion} but the schema is only at version ${currentFormDefVersion}`);
      }
    });

    if (orderedMigrations.length > 0) {
      if (this.getResultantVersion(orderedMigrations[orderedMigrations.length - 1].getInitialVersion()) < initialFormDefVersion) {
        this.logger.error(`New schema version ${initialFormDefVersion} has no corresponding migration`);
      }
    }

    return formDef;
  }

  getResultantVersion(migrationInitialVersion) {
    return migrationInitialVersion + 1;
  }

}
//# sourceMappingURL=schema-migrations.js.map
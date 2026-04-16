import { dialect } from './connection.ts';
import * as path from "@std/path";
import type { Database } from './db_schema.ts';
import { FileMigrationProvider, Kysely, Migrator } from 'kysely';

const db = new Kysely<Database>({dialect}); 

const migrator = new Migrator({ db, 
    provider: new FileMigrationProvider({
        fs: {
            readdir: (p) => Promise.resolve(Array.from(Deno.readDirSync(p), (entry) => entry.name)),
        },
        path,
        migrationFolder: path.join(Deno.cwd(), "src/infra/persistence/migrations"),
    })
})

async function runMigrations() {
    const { error, results } = await migrator.migrateToLatest();

    //logs
    results?.forEach((it) => {
        if (it.status === "Success") {
        console.log(`✅ [SUCCESS] Migration applied: ${it.migrationName}`);
        } else if (it.status === "Error") {
        console.error(`❌ [ERROR] Migration failed: ${it.migrationName}`);
        } else if (it.status === "NotExecuted") {
        console.log(`ℹ️ [SKIP] Migration already applied: ${it.migrationName}`);
        }
    });

    if (error) {
        console.error("failed to run migrations", error);
        Deno.exit(1);
    } else {
        console.log("migrations completed successfully");
        Deno.exit(0);
    }
}

runMigrations();
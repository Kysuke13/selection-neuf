import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlPath = join(__dirname, "..", "supabase", "migrations", "20260928122700_create_leads.sql");
const sql = readFileSync(sqlPath, "utf8");

const password = process.env.SUPABASE_DB_PASSWORD;
const ref = process.env.SUPABASE_PROJECT_REF ?? "iwpsjkumiqnvddihltwu";
const host = process.env.SUPABASE_DB_HOST ?? "aws-1-eu-west-1.pooler.supabase.com";

if (!password) {
  console.error("SUPABASE_DB_PASSWORD manquant dans l'environnement.");
  process.exit(1);
}

const client = new pg.Client({
  host,
  port: 5432,
  user: `postgres.${ref}`,
  password,
  database: "postgres",
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  console.log("Connecté à la base distante. Application de la migration leads...");
  await client.query(sql);
  console.log("OK: table 'leads' créée / à jour.");

  const check = await client.query(
    "select column_name, data_type from information_schema.columns where table_schema='public' and table_name='leads' order by ordinal_position"
  );
  console.log("Colonnes de public.leads:");
  for (const row of check.rows) {
    console.log(`  - ${row.column_name} (${row.data_type})`);
  }

  const rls = await client.query(
    "select policyname, cmd from pg_policies where schemaname='public' and tablename='leads'"
  );
  console.log("Policies RLS:", rls.rows.map((r) => `${r.policyname} [${r.cmd}]`).join(", ") || "(aucune)");
} catch (err) {
  console.error("ECHEC:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}

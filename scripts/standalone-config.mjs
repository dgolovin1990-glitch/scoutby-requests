import { readFileSync,writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const local=process.argv.includes('--local');
const id=local?'00000000-0000-4000-8000-000000000000':process.env.D1_DATABASE_ID;
if(!id||!/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/.test(id))throw Error('Set D1_DATABASE_ID to the ID of your own Cloudflare D1 database.');
const built=JSON.parse(readFileSync('dist/server/wrangler.json','utf8'));
const config={name:process.env.WORKER_NAME||'scoutby-requests',main:'./dist/server/index.js',no_bundle:true,find_additional_modules:true,compatibility_date:built.compatibility_date,compatibility_flags:built.compatibility_flags,rules:built.rules,assets:{directory:'./dist/client'},workers_dev:true,d1_databases:[{binding:'DB',database_name:process.env.D1_DATABASE_NAME||'scoutby-requests-db',database_id:id,migrations_dir:'./drizzle'}]};
const filename=local?'wrangler.local.json':'wrangler.deploy.json';writeFileSync(filename,JSON.stringify(config,null,2)+'\n');console.log('Prepared '+filename+'; tokens are read by Wrangler from the environment, never written here.');

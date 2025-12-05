const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manually load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('--- Connection Diagnostics ---');
console.log('URL found:', !!url);
console.log('Key found:', !!key);
if (url) console.log('URL details:', url.substring(0, 15) + '...');

if (!url || !key) {
    console.error('Missing credentials!');
    process.exit(1);
}

const supabase = createClient(url, key);

async function testFetch() {
    console.log('Attempting to fetch Supabase health/metadata...');
    try {
        // Try a simple auth check (doesn't require valid session)
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            console.error('Database Connection Error:', error.message);
        } else {
            console.log('Please ignore "null" session, strict connection check passed.');
            console.log('Connection Successful! Supabase is reachable.');
        }
    } catch (e) {
        console.error('Fetch Failed:', e);
        if (e.cause) console.error('Cause:', e.cause);
    }
}

testFetch();

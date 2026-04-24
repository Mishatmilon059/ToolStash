import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const [key, val] = line.split('=');
    if (key && val) acc[key.trim()] = val.trim();
    return acc;
  }, {});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
    console.log("Testing unauthenticated insert (like the frontend Dev Bypass)...");

    try {
        const toolData = {
            user_id: '11111111-1111-1111-1111-111111111111', // The hardcoded frontend bypass ID
            name: 'Notebook LM',
            description: 'Google AI notebook for research',
            category: 'Research',
            url: 'https://notebooklm.google.com',
            status: 'new'
        };

        console.log("Inserting 'Notebook LM' tool...");
        const { data: insertData, error: insertError } = await supabase
            .from('ai_tools')
            .insert([toolData])
            .select()
            .single();

        if (insertError) throw insertError;
        console.log("   ✅ Tool inserted successfully. Tool ID:", insertData.id);

        console.log("Fetching tools back...");
        const { data: fetchData, error: fetchError } = await supabase
            .from('ai_tools')
            .select('*');

        if (fetchError) throw fetchError;
        console.log("   ✅ Tools in database count:", fetchData.length);
        console.log("   ✅ First tool name:", fetchData[0].name);

        console.log("\n🚀 EVERYTHING IS WORKING END-TO-END!");

    } catch (err) {
        console.error("\n❌ TEST FAILED:", err.message);
    }
}

runTest();

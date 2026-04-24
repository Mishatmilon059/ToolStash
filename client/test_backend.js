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
    console.log("Starting Backend Verification...");

    const testEmail = `testuser_${Date.now()}@gmail.com`;
    const testPassword = 'Password123!';

    try {
        // 1. Sign up a test user
        console.log("1. Signing up test user:", testEmail);
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword,
        });

        if (authError) throw authError;
        console.log("   ✅ User signed up successfully. ID:", authData.user.id);

        const userId = authData.user.id;

        // 2. Insert Notebook LM into ai_tools
        console.log("2. Inserting 'Notebook LM' tool...");
        const toolData = {
            user_id: userId,
            name: 'Notebook LM',
            description: 'Google AI notebook for research',
            category: 'Research',
            url: 'https://notebooklm.google.com'
        };

        const { data: insertData, error: insertError } = await supabase
            .from('ai_tools')
            .insert([toolData])
            .select()
            .single();

        if (insertError) throw insertError;
        console.log("   ✅ Tool inserted successfully. Tool ID:", insertData.id);

        // 3. Fetch the tool back to verify read RLS
        console.log("3. Fetching the tool back...");
        const { data: fetchData, error: fetchError } = await supabase
            .from('ai_tools')
            .select('*')
            .eq('id', insertData.id)
            .single();

        if (fetchError) throw fetchError;
        console.log("   ✅ Tool fetched successfully:", fetchData.name);

        // 4. Update the tool status
        console.log("4. Updating tool status to 'useful'...");
        const { data: updateData, error: updateError } = await supabase
            .from('ai_tools')
            .update({ status: 'useful' })
            .eq('id', insertData.id)
            .select()
            .single();

        if (updateError) throw updateError;
        console.log("   ✅ Tool updated. New status:", updateData.status);

        console.log("\n🚀 ALL BACKEND TESTS PASSED!");

    } catch (err) {
        console.error("\n❌ TEST FAILED:", err.message);
    }
}

runTest();

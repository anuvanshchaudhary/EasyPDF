const fs = require('fs');
const path = require('path');
const https = require('https');

// Load env
const envPath = path.resolve(process.cwd(), '.env.local');
let apiKey = '';
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    const match = content.match(/GEMINI_API_KEY=(.*)/);
    if (match) {
        apiKey = match[1].trim().replace(/['"]/g, '');
    }
}

if (!apiKey) {
    console.error('No API Key found in .env.local');
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error('API Error:', json.error.message);
            } else if (json.models) {
                console.log('Available Models:');
                const geminiModels = json.models
                    .filter(m => m.name.includes('gemini'))
                    .map(m => m.name.replace('models/', ''));
                console.log(geminiModels.join('\n'));
            } else {
                console.log('No models found.');
            }
        } catch (e) {
            console.error('Parse error:', e.message);
            console.log('Raw response:', data);
        }
    });
}).on('error', (e) => {
    console.error('Request error:', e.message);
});

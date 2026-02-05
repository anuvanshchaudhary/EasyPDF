const apiKey = "AIzaSyDApLZCwJBv8OMQB5NzTri4PdmCxWoPp1w"; // Replace with your actual key

async function testSummary() {
    try {
        console.log('Testing gemini-2.5-flash...');

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: "Write a brief summary of what artificial intelligence is in 2-3 sentences."
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500,
                    }
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            console.log('✅ SUCCESS!');
            console.log('Response:', data.candidates[0].content.parts[0].text);
        } else {
            console.error('❌ FAILED:', data);
        }
    } catch (error) {
        console.error('❌ ERROR:', error);
    }
}

testSummary();
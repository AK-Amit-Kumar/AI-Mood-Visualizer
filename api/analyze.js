export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const { text } = request.body;

    if (!text) {
        return response.status(400).json({ error: 'No text provided' });
    }

    try {
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Analyze the emotion in this text and return ONLY valid JSON with no other text, no markdown, no backticks:
{ "mood": "happy|sad|angry|calm|anxious|excited", "intensity": 0.0 to 1.0 }

Text: "${text}"`
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0,
                        maxOutputTokens: 1024 //changed from 100
                    }
                })
            }
        );

        if (!geminiResponse.ok) {
            const errorData = await geminiResponse.json();
            return response.status(geminiResponse.status).json({ error: errorData });
        }

        const geminiData = await geminiResponse.json();
        // const rawText = geminiData.candidates[0].content.parts[0].text.trim();
        let rawText = geminiData.candidates[0].content.parts[0].text.trim();
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

        let moodData;
        try {
            moodData = JSON.parse(rawText);
        } catch (parseError) {
            return response.status(500).json({ error: 'Gemini returned invalid JSON', raw: rawText });
        }

        moodData.mood = moodData.mood.toLowerCase().trim();

        return response.status(200).json(moodData);

    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
}
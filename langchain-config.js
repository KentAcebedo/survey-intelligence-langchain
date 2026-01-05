import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

/**
 * Fetch available models from Google API
 * This will show us exactly what models your API key can access
 */
async function getAvailableModels(apiKey) {
    try {
        console.log('🔍 Fetching available models from Google API...');
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
        );
        
        if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.models && data.models.length > 0) {
            console.log('📋 Found available models:');
            const modelNames = data.models.map(model => {
                // Extract model name (remove 'models/' prefix if present)
                const name = model.name.replace('models/', '');
                console.log(`   - ${name} (${model.displayName || 'no display name'})`);
                return name;
            });
            return modelNames;
        } else {
            console.warn('⚠️ No models found in API response');
            return [];
        }
    } catch (error) {
        console.error('❌ Error fetching models:', error);
        return [];
    }
}

export async function initializeGeminiModel(apiKey) {
    if (!apiKey) {
        throw new Error('Google AI API key is required');
    }

    // Step 1: Get available models from API
    const availableModels = await getAvailableModels(apiKey);
    
    // Step 2: Build list of models to try
    // Priority: Use models from API first, then fallback to common names
    const modelsToTry = [
        ...availableModels,           // Models from API (highest priority)
        "gemini-pro",                 // Common free model
        "gemini-1.5-flash",           // Fast model
        "gemini-1.5-pro",             // More capable
    ];
    
    // Remove duplicates and empty values
    const uniqueModels = [...new Set(modelsToTry.filter(m => m))];
    
    if (uniqueModels.length === 0) {
        throw new Error(
            'No models found. Please check:\n' +
            '1. Your API key is valid\n' +
            '2. The Generative Language API is enabled\n' +
            '3. Visit: https://generativelanguage.googleapis.com/v1/models?key=YOUR_KEY'
        );
    }
    
    console.log(`🔄 Trying ${uniqueModels.length} model(s)...`);

    let lastError = null;

    for (const modelName of uniqueModels) {
        try {
            console.log(`  Testing: ${modelName}...`);
            
            const model = new ChatGoogleGenerativeAI({
                modelName: modelName,
                temperature: 0.7,
                apiKey: apiKey,
            });
            
            // Test with proper message format
            const testResponse = await model.invoke([
                { role: "user", content: "hi" }
            ]);
            
            console.log(`✅ SUCCESS! Initialized with: ${modelName}`);
            return model;
            
        } catch (error) {
            const errorMsg = error.message || String(error);
            console.warn(`  ❌ ${modelName} failed:`, errorMsg.substring(0, 100));
            lastError = error;
        }
    }

    // If all fail, provide detailed error
    const errorDetails = lastError?.message || 'Unknown error';
    throw new Error(
        `❌ All ${uniqueModels.length} model(s) failed to initialize.\n\n` +
        `Last error: ${errorDetails}\n\n` +
        `Available models found: ${availableModels.length > 0 ? availableModels.join(', ') : 'none'}\n\n` +
        `Troubleshooting:\n` +
        `1. Check your API key: https://makersuite.google.com/app/apikey\n` +
        `2. Verify API is enabled in Google Cloud Console\n` +
        `3. Try visiting: https://generativelanguage.googleapis.com/v1/models?key=${apiKey.substring(0, 15)}...`
    );
}
import { createAnalysisChain, createRecommendationChain } from "./analysis-chain.js";

// store csv data
let csvData = null;

const csvFileInput = document.getElementById('csvFileInput');
const csvPreview = document.getElementById('csvPreview');
const fileName = document.getElementById('fileName');
const rowCount = document.getElementById('rowCount');
const surveyInput = document.getElementById('surveyInput');
const analyzeButton = document.getElementById('analyzeButton');
const resultArea = document.getElementById('resultArea');

// convert csv text into array objects
function parseCSV(csvText){
    const lines = csvText.trim().split('\n');

    if (lines.length === 0){
        throw new Error('CSV file is empty');
    }

    // csv headers
    const headers = lines[0].split(',').map(h => h.trim());

    const rows = [];
    for (let i = 1; i < lines.length; i++){
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};

        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });

        rows.push(row);
    }

    return { headers, rows};
}

async function handleCSVUpload(event){
    const file = event.target.files[0];

    if (!file) {
        return;
    }

    // validate if csv file
    if (!file.name.endsWith('.csv')){
        alert('Please upload a CSV file');
        return;
    }

    try {
        const fileText = await readFileAsText(file);

        const parsed = parseCSV(fileText);
        showCSVPreview(file.name, parsed.rows.length);
        extractAndFillTextarea(parsed);
    } catch (error){
        console.error('Error reading CSV:', error);
        alert('Error reading csv file: ' + error.message);
    }
}

function readFileAsText(file){
    return new Promise((resolve, reject)=> {
        const reader = new FileReader();

        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    }); 
}

function showCSVPreview(name, count){
    fileName.textContent = name;
    rowCount.textContent = `${count} `;
    csvPreview.classList.remove('hidden');
}

function extractAndFillTextarea(parsed){
    const { headers, rows } = parsed;
    
    const textColumn = headers.find(h => 
        h.toLowerCase().includes('response') ||
        h.toLowerCase().includes('comment') ||
        h.toLowerCase().includes('feedback') ||
        h.toLowerCase().includes('answer') ||
        h.toLowerCase().includes('text')
    ) || headers[0];

    // Extract all responses and join with newlines
    const responses = rows
        .map(row => row[textColumn])
        .filter(text => text && text.trim() !== '') // Remove empty rows
        .join('\n');
    
    // Fill the textarea
    surveyInput.value = responses;
}

async function runAnalysis(){
    // get api key
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    if (!apiKey) {
        alert('Please enter your Google AI API key');
        return;
    }

    // get survey text
    const surveyText = surveyInput.value.trim();
    if(!surveyText){
        alert('Please enter survey responses or upload a CSV file');
        return;
    }

    // Count number of responses (split by newlines)
    const responseCount = surveyText.split('\n').filter(line => line.trim().length > 0).length;
    console.log(`Analyzing ${responseCount} survey responses...`);

    resultArea.innerHTML = '<p class="text-blue-600">🔄 Analyzing survey responses... This may take a moment.</p>';
    analyzeButton.disabled = true;
    analyzeButton.textContent = 'Analyzing...';

    try {
        // create chains
        console.log('Creating chains...');
        const analysisChain = await createAnalysisChain(apiKey);
        const recommendationChain = await createRecommendationChain(apiKey);

        // Enhanced prompt with response count
        const enhancedSurveyText = `Total number of responses: ${responseCount}\n\n${surveyText}`;

        // run analysis
        console.log('Running analysis chain');
        const analysisResult = await analysisChain.invoke({
            surveyText: enhancedSurveyText
        });

        // ... rest of your existing code for extracting analysisText ...

        // Extract text from AI response
        let analysisText;
        if (analysisResult && analysisResult.content) {
            if (typeof analysisResult.content === 'string') {
                analysisText = analysisResult.content;
            } else if (Array.isArray(analysisResult.content)) {
                analysisText = analysisResult.content.map(c => c.text || c.content || String(c)).join('\n');
            } else {
                analysisText = String(analysisResult.content);
            }
        } else if (analysisResult && analysisResult.text) {
            analysisText = analysisResult.text;
        } else {
            analysisText = JSON.stringify(analysisResult, null, 2);
        }

        console.log('Extracted analysis:', analysisText);

        // run recommendation chain
        console.log('Running recommendation chain...');
        const recommendationResult = await recommendationChain.invoke({
            analysis: analysisText
        });

        // Extract recommendation text
        let recommendationText;
        if (recommendationResult && recommendationResult.content) {
            if (typeof recommendationResult.content === 'string') {
                recommendationText = recommendationResult.content;
            } else if (Array.isArray(recommendationResult.content)) {
                recommendationText = recommendationResult.content.map(c => c.text || c.content || String(c)).join('\n');
            } else {
                recommendationText = String(recommendationResult.content);
            }
        } else if (recommendationResult && recommendationResult.text) {
            recommendationText = recommendationResult.text;
        } else {
            recommendationText = JSON.stringify(recommendationResult, null, 2);
        }

        // display with enhanced formatting
        displayResults(analysisText, recommendationText);

    } catch (error){
        console.error('Analysis error:', error);
        resultArea.innerHTML = `
            <p class="text-red-600 font-semibold">Error:</p>
            <p class="text-red-600">${error.message}</p>
            <p class="text-sm text-gray-600 mt-2">Check your API key and try again.</p>
        `;
    } finally {
        analyzeButton.disabled = false;
        analyzeButton.textContent = 'Analyze Survey';
    }
}



// display result
function displayResults(analysis, recommendation) {
    // Extract statistics from analysis text (if in structured format)
    const stats = extractStatistics(analysis);
    
    resultArea.innerHTML = `
        <div class="space-y-6">
            <!-- Statistics Dashboard -->
            ${stats ? `
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <h3 class="text-xl font-bold text-gray-800 mb-4">📊 Survey Statistics</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-white p-4 rounded-lg shadow-sm">
                        <div class="text-3xl font-bold text-blue-600">${stats.total || 'N/A'}</div>
                        <div class="text-sm text-gray-600">Total Responses</div>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm">
                        <div class="text-3xl font-bold text-green-600">${stats.positive || 'N/A'}</div>
                        <div class="text-sm text-gray-600">Positive</div>
                        ${stats.positivePercent ? `<div class="text-xs text-gray-500">${stats.positivePercent}%</div>` : ''}
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm">
                        <div class="text-3xl font-bold text-red-600">${stats.negative || 'N/A'}</div>
                        <div class="text-sm text-gray-600">Negative</div>
                        ${stats.negativePercent ? `<div class="text-xs text-gray-500">${stats.negativePercent}%</div>` : ''}
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm">
                        <div class="text-3xl font-bold text-gray-600">${stats.neutral || 'N/A'}</div>
                        <div class="text-sm text-gray-600">Neutral</div>
                        ${stats.neutralPercent ? `<div class="text-xs text-gray-500">${stats.neutralPercent}%</div>` : ''}
                    </div>
                </div>
            </div>
            ` : ''}
            
            <!-- Analysis Section -->
            <div class="border-b border-gray-200 pb-4">
                <h3 class="text-xl font-semibold text-gray-800 mb-3">📈 Detailed Analysis</h3>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <pre class="whitespace-pre-wrap text-sm text-gray-700 font-sans">${analysis}</pre>
                </div>
            </div>
            
            <!-- Recommendation Section -->
            <div>
                <h3 class="text-xl font-semibold text-gray-800 mb-3">💡 Strategic Recommendations</h3>
                <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <pre class="whitespace-pre-wrap text-sm text-gray-700 font-sans">${recommendation}</pre>
                </div>
            </div>
        </div>
    `;
}

/**
 * Extract statistics from analysis text
 * This function tries to parse numbers and percentages from the AI response
 */
function extractStatistics(analysisText) {
    if (!analysisText) return null;
    
    const stats = {};
    
    // Try to extract total responses
    const totalMatch = analysisText.match(/Total Responses?:\s*(\d+)/i);
    if (totalMatch) stats.total = totalMatch[1];
    
    // Extract positive sentiment
    const positiveMatch = analysisText.match(/Positive Sentiment:\s*(\d+)\s*\(([\d.]+)%\)/i);
    if (positiveMatch) {
        stats.positive = positiveMatch[1];
        stats.positivePercent = positiveMatch[2];
    }
    
    // Extract negative sentiment
    const negativeMatch = analysisText.match(/Negative Sentiment:\s*(\d+)\s*\(([\d.]+)%\)/i);
    if (negativeMatch) {
        stats.negative = negativeMatch[1];
        stats.negativePercent = negativeMatch[2];
    }
    
    // Extract neutral sentiment
    const neutralMatch = analysisText.match(/Neutral Sentiment:\s*(\d+)\s*\(([\d.]+)%\)/i);
    if (neutralMatch) {
        stats.neutral = neutralMatch[1];
        stats.neutralPercent = neutralMatch[2];
    }
    
    // Only return stats if we found at least one
    return Object.keys(stats).length > 0 ? stats : null;
}

analyzeButton.addEventListener('click', runAnalysis);
csvFileInput.addEventListener('change', handleCSVUpload);
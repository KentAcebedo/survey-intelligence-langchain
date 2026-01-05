// Ai analysis pipeline
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { initializeGeminiModel } from "./langchain-config.js";

// Enhanced prompt that requests statistics and counts
const analysisPrompt = ChatPromptTemplate.fromMessages([
    ["system", `You are an expert business analyst specializing in customer feedback analysis.
Your task is to analyze survey responses and provide comprehensive statistical insights.`],
    ["human", `Analyze the following survey responses and provide a detailed analysis:

{surveyText}

Please provide your analysis in the following structured format:

## SURVEY STATISTICS
- Total Responses: [count]
- Positive Sentiment: [count] ([percentage]%)
- Negative Sentiment: [count] ([percentage]%)
- Neutral Sentiment: [count] ([percentage]%)

## TOPIC BREAKDOWN
List each topic mentioned and the count:
- [Topic 1]: [count] responses
- [Topic 2]: [count] responses
- etc.

## PRIORITY ANALYSIS
- High Priority Issues: [count]
- Medium Priority Issues: [count]
- Low Priority Issues: [count]

## DETAILED RESPONSE ANALYSIS
For each response, provide:
1. Response: [the actual response text]
2. Sentiment: [positive/negative/neutral]
3. Topic: [main topic]
4. Priority: [high/medium/low]
5. Key Insight: [brief insight]

## KEY FINDINGS
- Most common topic: [topic] ([count] mentions)
- Most critical issue: [description]
- Most positive aspect: [description]
- Overall sentiment trend: [description]`]
]);

const recommendationPrompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a strategic business consultant. 
Based on analyzed survey data with statistics, provide actionable recommendations.`],
    ["human", `Based on this comprehensive survey analysis:
{analysis}

Generate a strategic recommendation that:
- References specific statistics and counts from the analysis
- Addresses the most common issues (by count/percentage)
- Prioritizes actions based on both frequency and impact
- Provides specific, actionable steps with timelines
- Is written in executive-friendly language
- Includes data-driven insights (e.g., "X% of customers mentioned Y")`]
]);

/**
 * CREATE ANALYSIS CHAIN
 */
export async function createAnalysisChain(apiKey) {
    const model = await initializeGeminiModel(apiKey);
    const analysisChain = analysisPrompt.pipe(model);
    return analysisChain;
}

/**
 * CREATE RECOMMENDATION CHAIN
 */
export async function createRecommendationChain(apiKey) {
    const model = await initializeGeminiModel(apiKey);
    const recommendationChain = recommendationPrompt.pipe(model);
    return recommendationChain;
}
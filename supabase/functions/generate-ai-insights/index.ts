
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('OpenAI API Key available:', !!openAIApiKey);
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured. Please add your OPENAI_API_KEY in Supabase Edge Functions settings.');
    }

    const { 
      departmentName, 
      avgEngagement, 
      avgCohesion, 
      avgFriction, 
      teamGoalDistribution,
      verbalComments = []
    } = await req.json();

    console.log('Received data:', { departmentName, avgEngagement, avgCohesion, avgFriction, teamGoalDistribution, verbalComments: verbalComments.length });

    // Validate input data
    if (!departmentName) {
      throw new Error('Department name is required');
    }

    // Build the prompt for AI analysis
    let prompt = `Department: ${departmentName}
Avg Engagement: ${avgEngagement.toFixed(1)}/5
Avg Cohesion: ${avgCohesion.toFixed(1)}/5
Avg Friction: ${avgFriction.toFixed(1)}/5

Team Goal Distribution:
${Object.entries(teamGoalDistribution).map(([goal, count]) => `- ${goal}: ${count} responses`).join('\n')}`;

    if (verbalComments.length > 0) {
      prompt += `\n\nRecent Team Comments:\n${verbalComments.slice(0, 5).map(comment => `"${comment}"`).join('\n')}`;
    }

    prompt += `\n\nBased on the above team data, provide exactly 3 specific, actionable recommendations to improve team performance. Focus on the most critical areas that need attention. Keep each recommendation concise and practical.`;

    console.log('Sending prompt to OpenAI:', prompt);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert team dynamics consultant. Provide actionable, specific recommendations based on team metrics and feedback. Format your response as numbered bullet points with clear action items.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    console.log('OpenAI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      
      // Parse error for better user feedback
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.code === 'invalid_api_key') {
          throw new Error('Invalid OpenAI API key. Please check your configuration.');
        } else if (errorData.error?.code === 'insufficient_quota') {
          throw new Error('OpenAI API quota exceeded. Please check your usage limits.');
        }
      } catch (parseError) {
        // Fallback to generic error if we can't parse the response
      }
      
      throw new Error(`OpenAI API error: ${response.status} - Please check your API key and try again.`);
    }

    const data = await response.json();
    console.log('OpenAI response data:', data);
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenAI API');
    }
    
    const insights = data.choices[0].message.content;

    if (!insights || insights.trim().length === 0) {
      throw new Error('No insights generated. Please try again.');
    }

    return new Response(JSON.stringify({ insights }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-ai-insights function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate insights', 
        details: error.message 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

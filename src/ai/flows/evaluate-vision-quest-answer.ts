'use server';
/**
 * @fileOverview A Genkit flow to semantically evaluate a player's submitted answer against four puzzle images.
 *
 * - evaluateVisionQuestAnswer - A function that handles the answer evaluation process.
 * - EvaluateVisionQuestAnswerInput - The input type for the evaluateVisionQuestAnswer function.
 * - EvaluateVisionQuestAnswerOutput - The return type for the evaluateVisionQuestAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateVisionQuestAnswerInputSchema = z.object({
  images: z
    .array(
      z
        .string()
        .describe(
          "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        )
    )
    .length(4)
    .describe('An array of four image data URIs that form the puzzle.'),
  playerAnswer: z
    .string()
    .describe("The player's submitted word or phrase to connect the images."),
});
export type EvaluateVisionQuestAnswerInput = z.infer<
  typeof EvaluateVisionQuestAnswerInputSchema
>;

const EvaluateVisionQuestAnswerOutputSchema = z.object({
  isCorrect: z
    .boolean()
    .describe(
      "True if the player's answer semantically connects all four images, false otherwise."
    ),
  confidenceScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'A confidence score (0-100) indicating how certain the AI is about its decision.'
    ),
  reasoning: z
    .string()
    .describe(
      'A concise explanation for why the answer was deemed correct or incorrect, referencing connections to the images.'
    ),
});
export type EvaluateVisionQuestAnswerOutput = z.infer<
  typeof EvaluateVisionQuestAnswerOutputSchema
>;

export async function evaluateVisionQuestAnswer(
  input: EvaluateVisionQuestAnswerInput
): Promise<EvaluateVisionQuestAnswerOutput> {
  return evaluateVisionQuestAnswerFlow(input);
}

const evaluationPrompt = ai.definePrompt({
  name: 'visionQuestAnswerEvaluationPrompt',
  input: {schema: EvaluateVisionQuestAnswerInputSchema},
  output: {schema: EvaluateVisionQuestAnswerOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest', // Explicitly use a multimodal model
  prompt: `You are the VisionQuest AI consensus judge, designed to evaluate player answers in a puzzle game.
Your task is to analyze four provided images and a player's submitted word or phrase.

The player's answer must semantically connect ALL four images. It should capture the core theme, common element, or underlying concept that is present across every image. Your judgment should be based purely on semantic relevance and conceptual connection, not on literal or exact word matching.

After your analysis, provide:
1. A boolean indicating whether the answer is semantically correct.
2. A confidence score (0-100) representing how certain you are about your decision.
3. A concise reasoning for your judgment, specifically explaining the connections (or lack thereof) between the answer and the images.

Here are the four images and the player's answer:

Image 1: {{media url=images.[0]}}
Image 2: {{media url=images.[1]}}
Image 3: {{media url=images.[2]}}
Image 4: {{media url=images.[3]}}

Player's Answer: {{{playerAnswer}}}`,
});

const evaluateVisionQuestAnswerFlow = ai.defineFlow(
  {
    name: 'evaluateVisionQuestAnswerFlow',
    inputSchema: EvaluateVisionQuestAnswerInputSchema,
    outputSchema: EvaluateVisionQuestAnswerOutputSchema,
  },
  async input => {
    const {output} = await evaluationPrompt(input);
    if (!output) {
      throw new Error('No output received from the evaluation prompt.');
    }
    return output;
  }
);

import { generateText } from 'ai';

export default async function handler(req, res) {
  const hasKey = Boolean(process.env.AI_GATEWAY_API_KEY);
  try {
    const { text } = await generateText({
      model: 'openai/gpt-5-mini',
      prompt: 'Reply with exactly: OK'
    });
    return res.status(200).json({ hasKey, ok: true, reply: text });
  } catch (error) {
    return res.status(500).json({
      hasKey,
      ok: false,
      name: error?.name || null,
      message: error?.message || String(error),
      statusCode: error?.statusCode || error?.status || null
    });
  }
}
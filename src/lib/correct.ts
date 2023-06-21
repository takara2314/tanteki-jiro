import type { OpenAIApi } from 'openai';
import type { AxiosError } from 'axios';
import { cannotGuessText, defaultSystemPrompt } from '../constants/prompt';

// 文章を添削する
const correctText = async (
  client: OpenAIApi,
  text: string,
  customPrompt = defaultSystemPrompt
): Promise<string> => {

  let results;

  if (customPrompt === '') {
    customPrompt = defaultSystemPrompt;
  }

  try {
    // ChatGPT APIに添削をお願いする
    results = await client.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: customPrompt
        },
        {
          role: 'user',
          content: text
        }
      ]
    });

  } catch (e) {
    const statusCode = (e as AxiosError<string>).response?.status ?? 0;
    throw new Error(statusCode.toString());
  }

  const corrected = results.data.choices[0].message?.content ?? '';

  // 明らかに文章ではないものが入力された場合
  if (corrected === cannotGuessText) {
    throw new Error('4444');
  }

  return corrected;
};

export default correctText;

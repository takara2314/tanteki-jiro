import { useState } from 'react';
import { useAsync } from 'react-use';
import checkChromeExtension from '../lib/environ';
import { defaultSystemPrompt } from '../constants/prompt';

// Chromeストレージに保存されたデータを復元するフック
const useRestore = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [systemPrompt, setSystemPrompt] = useState<string>(defaultSystemPrompt);
  const [text, setText] = useState<string>('');
  const [isNoneText, setIsNoneText] = useState<boolean>(true);

  // 最初にAPIキー、システムプロンプト、テキストを復元する
  const { loading } = useAsync(async () => {
    if (!checkChromeExtension()) {
      return;
    }
    const result = await chrome.storage.local.get(['apiKey', 'systemPrompt', 'text']);
    setApiKey(result.apiKey ?? '');
    setSystemPrompt(result.systemPrompt ?? '');
    setText(result.text ?? '');

    if (result.text !== '') {
      setIsNoneText(false);
    }
  }, []);

  return {
    apiKey,
    systemPrompt,
    text,
    isNoneText,
    setApiKey,
    setSystemPrompt,
    setText,
    setIsNoneText,
    loading
  };
};

export default useRestore;

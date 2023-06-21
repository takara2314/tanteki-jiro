import { useCallback, useState, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { howToGetApiKeyPageUrl } from './constants/tips';

interface Props {
  setApiKey: (apiKey: string) => void;
}

// APIキー設定モーダル
const ApiKeySettingModal = ({ setApiKey }: Props) => {
  const [apiKeyTemp, setApiKeyTemp] = useState<string>('');

  const handleChangeApiKeyTemp = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setApiKeyTemp(e.target.value);
  }, [setApiKeyTemp]);

  const handleSetApiKey = useCallback(() => {
    setApiKey(apiKeyTemp);
  }, [setApiKey, apiKeyTemp]);

  return (
    <>
      <motion.div
        className="w-full h-[calc(100vh-3rem)] bg-[rgb(0,0,0,0.5)] absolute bottom-0"
        exit={{ opacity: 0 }}
      />

      <motion.div
        className="m-auto p-5 w-11/12 h-72 text-center bg-white rounded-xl flex flex-col items-center absolute inset-x-0"
        initial={{ top: '100vh' }}
        animate={{ top: '5rem' }}
        exit={{ top: '100vh' }}
      >
        <h2 className="text-amber-700 text-lg font-bold">
          OpenAI APIキーを入力してください
        </h2>

        <p>
          本サービスは、OpenAI社のChatGPTのAPIを使用して添削を行っています。
        </p>

        <a
          href={howToGetApiKeyPageUrl}
          className="mt-5 text-gray-500 hover:text-amber-700 text-sm transition-colors duration-100"
        >
          APIキーを取得するには？
        </a>

        <input
          value={apiKeyTemp}
          onChange={handleChangeApiKeyTemp}
          placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          className="
            mt-2 px-3 py-2 w-full border-2 border-gray-300 rounded-xl
            outline-none outline-offset-1 focus:outline-amber-600 transition-colors duration-300
          "
        />

        <button
          onClick={handleSetApiKey}
          type="submit"
          disabled={apiKeyTemp === ''}
          className={apiKeyTemp === '' ? `
            mt-6 px-5 py-2 text-gray-400 font-medium rounded-xl border-4 border-gray-400
            transition-colors duration-200
          ` : `
            mt-6 px-5 py-2 text-amber-600 font-medium rounded-xl border-4 border-amber-600
          hover:text-white hover:bg-amber-600 transition-colors duration-200
          `}
        >
          OK
        </button>
      </motion.div>
    </>
  );
};

export default ApiKeySettingModal;

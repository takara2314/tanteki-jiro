import { useCallback, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { defaultSystemPrompt } from './constants/prompt';

interface Props {
  apiKey: string;
  systemPrompt: string;
  setApiKey: (apiKey: string) => void;
  setSystemPrompt: (systemPrompt: string) => void;
}

const Settings = ({ apiKey, systemPrompt, setApiKey, setSystemPrompt }: Props) => {
  const handleChangeApiKey = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  }, [setApiKey]);

  const handleChangeSystemPrompt = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setSystemPrompt(e.target.value);
  }, [setSystemPrompt]);

  const handleClickResetSystemPrompt = useCallback(() => {
    setSystemPrompt(defaultSystemPrompt);
  }, [setSystemPrompt]);

  return (
    <motion.section
      className="px-5 pt-5 w-full h-[calc(100vh-3rem)] bg-white flex flex-col items-left absolute top-12 overflow-y-scroll"
      initial={{ left: '100vw' }}
      animate={{ left: 0 }}
      exit={{ left: '100vw' }}
    >
      <div>
        <div className="flex flex-row justify-between items-center">
          <h2 className="font-bold">
            OpenAI APIキー
          </h2>
          <a
            href="https://laboratory.kazuuu.net/how-to-get-an-openai-api-key/"
            className="text-gray-500 hover:text-amber-700 text-sm transition-colors duration-100"
          >
            APIキーを取得するには？
          </a>
        </div>
        <input
          value={apiKey}
          onChange={handleChangeApiKey}
          placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          className="
            mt-2 px-3 py-2 w-full border-2 border-gray-300 rounded-xl
            outline-none outline-offset-1 focus:outline-amber-600 transition-colors duration-300
          "
        />
      </div>

      <div className="mt-5">
        <div className="flex flex-row justify-between items-center">
          <h2 className="font-bold">
            システムプロンプト
          </h2>
          <button
            onClick={handleClickResetSystemPrompt}
            className="text-gray-500 hover:text-amber-700 text-sm transition-colors duration-100"
          >
            初期値に戻す
          </button>
        </div>
        <textarea
          value={systemPrompt}
          onChange={handleChangeSystemPrompt}
          className="
            mt-2 px-3 py-2 w-full h-48 border-2 border-gray-300 rounded-xl resize-none
            outline-none outline-offset-1 focus:outline-amber-600 transition-colors duration-300
          "
        />
      </div>
    </motion.section>
  );
};

export default Settings;

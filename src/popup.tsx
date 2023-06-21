import { useCallback, useEffect, useMemo, useState, ChangeEvent, FormEvent } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import correctText from './lib/correct';
import { cannotGuessText } from './constants/prompt';
import { AnimatePresence } from 'framer-motion';
import type { Section } from './models';
import Settings from './settings';
import Header from './header';
import CorrectButtonArea from './correctButtonArea';
import checkChromeExtension from './lib/environ';
import useRestore from './hooks/useRestore';
import ApiKeySettingModal from './apiKeySettingModal';

const Popup = () => {
  const [section, setSection] = useState<Section>('home');
  const {
    apiKey,
    systemPrompt,
    text,
    isNoneText,
    setApiKey,
    setSystemPrompt,
    setText,
    setIsNoneText,
    loading
  } = useRestore();

  const [isWrongText, setIsWrongText] = useState<boolean>(false);
  const [isPerfectText, setIsPerfectText] = useState<boolean>(false);
  const [isCorrecting, setIsCorrecting] = useState<boolean>(false);
  const [isShowUndoButton, setIsShowUndoButton] = useState<boolean>(false);
  const [pastText, setPastText] = useState<string>('');

  // OpenAI APIの設定
  const config = useMemo(() => new Configuration({
    apiKey: apiKey,
  }), [apiKey]);
  delete config.baseOptions.headers['User-Agent'];

  // OpenAIインスタンス
  const openai = useMemo(() => new OpenAIApi(
    config
  ), [config]);

  // ポップアップを閉じてもAPIキー、システムプロンプト、テキストを保持する
  useEffect(() => {
    if (!checkChromeExtension()) {
      return;
    }
    chrome.storage.local.set({
      'apiKey': apiKey,
      'systemPrompt': systemPrompt,
      'text': text
    });
  }, [apiKey, systemPrompt, text]);

  // テキストを入力したときの処理
  const handleInputText = useCallback((e: FormEvent<HTMLTextAreaElement>) => {
    if (isShowUndoButton) {
      setIsShowUndoButton(false);
    }
    if (isWrongText) {
      setIsWrongText(false);
    }
    if (isPerfectText) {
      setIsPerfectText(false);
    }

    if (e.currentTarget.value === '') {
      setIsNoneText(true);
    } else {
      setIsNoneText(false);
    }
  }, [
    isShowUndoButton, isWrongText, isPerfectText,
    setIsShowUndoButton, setIsWrongText, setIsPerfectText, setIsNoneText
  ]);

  // テキストを変更したときの処理
  const handleChangeText = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }, [setText]);

  // 「端的にする」ボタンを押されたときの処理
  const handleClickCorrection = useCallback(async () => {
    setIsWrongText(false);
    setIsPerfectText(false);
    setIsCorrecting(true);
    setPastText(text);

    try {
      const corrected = await correctText(openai, text, systemPrompt);
      setText(corrected);

      if (corrected === text) {
        setIsPerfectText(true);
      }

    } catch (statusCodeStr) {
      // 異常なステータスコードが返ってきたとき
      const statusCode = Number((statusCodeStr as Error).message);
      setIsWrongText(true);

      switch (statusCode) {
        case 400:
          setText('文章が長すぎます。もう少し短くしてください。');
          break;
        case 401:
          setText('APIキーが誤っています。設定から確認してください。');
          break;
        case 4444:
          setText(cannotGuessText);
          break;
      }
    }

    setIsCorrecting(false);
    setIsShowUndoButton(true);
  }, [openai, text, systemPrompt, setText, setIsWrongText, setIsCorrecting, setIsShowUndoButton]);

  // 「元に戻す」ボタンを押されたときの処理
  const handleClickUndo = useCallback(() => {
    setText(pastText);
    setIsShowUndoButton(false);
    setIsWrongText(false);
    setIsPerfectText(false);
  }, [pastText, setText, setIsShowUndoButton, setIsWrongText, setIsPerfectText]);

  // テキストエリアの背景色
  const textAreaBgColor = useMemo(() => {
    if (isWrongText) {
      return 'bg-red-200';
    }
    if (isPerfectText) {
      return 'bg-green-200';
    }
    return 'bg-gray-200';
  }, [isWrongText, isPerfectText]);

  return (
    <>
      <Header
        section={section}
        setSection={setSection}
      />

      <main className="px-5 pt-5 w-full h-[calc(100vh-3rem)] flex flex-col items-center">
        <div className="w-full h-[65vh] relative">
          <textarea
            value={text}
            onInput={handleInputText}
            onChange={handleChangeText}
            disabled={isCorrecting}
            className={`
              p-3 w-full h-full ${textAreaBgColor} transition-colors duration-300
              rounded-xl outline-none outline-offset-0 focus:outline-amber-600 resize-none
            `}
          />

          {isShowUndoButton && (
            <button
              onClick={handleClickUndo}
              className="
                m-auto w-32 py-1 tracking-wide text-amber-700 font-bold bg-white rounded-xl shadow-lg
                flex flex-col items-center absolute bottom-3 inset-x-0 hover:bg-amber-100 transition-colors duration-300
              "
            >
              元に戻す
            </button>
          )}
        </div>

        <CorrectButtonArea
          isCorrecting={isCorrecting}
          onClick={handleClickCorrection}
          isNoneText={isNoneText}
        />
      </main>

      <AnimatePresence>
        {!loading && apiKey === '' && <ApiKeySettingModal
          setApiKey={setApiKey}
        />}
      </AnimatePresence>

      <AnimatePresence>
        {section === 'settings' && <Settings
          apiKey={apiKey}
          systemPrompt={systemPrompt}
          setApiKey={setApiKey}
          setSystemPrompt={setSystemPrompt}
        />}
      </AnimatePresence>
    </>
  );
};

export default Popup;

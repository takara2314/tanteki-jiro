import { useCallback, useEffect, useMemo, useState, ChangeEvent, FormEvent } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import correctText from './lib/correct';
import { cannotGuessText } from './constants/prompt';
import { AnimatePresence } from 'framer-motion';
import { useAsync } from 'react-use';
import type { Section } from './models';
import Settings from './settings';
import Header from './header';
import CorrectButtonArea from './correctButtonArea';
import checkChromeExtension from './lib/environ';

const Popup = () => {
  // OpenAI APIの設定
  const config = useMemo(() => new Configuration({
    apiKey: 'sk-xxxxx',
  }), []);
  delete config.baseOptions.headers['User-Agent'];

  // OpenAIインスタンス
  const openai = useMemo(() => new OpenAIApi(
    config
  ), [config]);

  const [section, setSection] = useState<Section>('home');

  const [text, setText] = useState<string>('');
  const [isWrongText, setIsWrongText] = useState<boolean>(false);
  const [isCorrecting, setIsCorrecting] = useState<boolean>(false);
  const [isNoneText, setIsNoneText] = useState<boolean>(true);

  // 最初にテキストを復元する
  useAsync(async () => {
    if (!checkChromeExtension()) {
      return;
    }
    const result = await chrome.storage.local.get(['text']);
    setText(result.text);

    if (result.text !== '') {
      setIsNoneText(false);
    }
  }, []);

  // ポップアップを閉じてもテキストを保持する
  useEffect(() => {
    if (!checkChromeExtension()) {
      return;
    }
    chrome.storage.local.set({
      'text': text
    });
  }, [text]);

  // テキストを入力したときの処理
  const handleInputText = useCallback((e: FormEvent<HTMLTextAreaElement>) => {
    if (isWrongText) {
      setIsWrongText(false);
    }

    if (e.currentTarget.value === '') {
      setIsNoneText(true);
    } else {
      setIsNoneText(false);
    }
  }, [isWrongText]);

  // テキストを変更したときの処理
  const handleChangeText = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }, []);

  // 「端的にする」ボタンを押されたときの処理
  const handleClickCorrection = useCallback(async () => {
    setIsWrongText(false);
    setIsCorrecting(true);

    try {
      const corrected = await correctText(openai, text);
      setText(corrected);

    } catch (statusCodeStr) {
      // 異常なステータスコードが返ってきたとき
      const statusCode = Number((statusCodeStr as Error).message);

      switch (statusCode) {
        case 401:
          alert('APIキーが設定されていません');
          break;
        case 4444:
          setIsWrongText(true);
          setText(cannotGuessText);
      }
    }

    setIsCorrecting(false);
  }, [openai, text]);

  return (
    <AnimatePresence>
      <Header
        section={section}
        setSection={setSection}
      />

      <main className="p-5 w-full h-[calc(100vh-3rem)] flex flex-col items-center">
        <textarea
          value={text}
          onInput={handleInputText}
          onChange={handleChangeText}
          disabled={isCorrecting}
          className={`
            p-3 w-full h-[65vh] ${isWrongText ? 'bg-red-200' : 'bg-gray-200'} transition-colors duration-300
            rounded-xl outline-none outline-offset-0 focus:outline-amber-600 resize-none
          `}
        />

        <CorrectButtonArea
          isCorrecting={isCorrecting}
          onClick={handleClickCorrection}
          isNoneText={isNoneText}
        />
      </main>

      {section === 'settings' && <Settings />}
    </AnimatePresence>
  );
};

export default Popup;

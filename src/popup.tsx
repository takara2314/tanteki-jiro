import { useCallback, useEffect, useMemo, useState, ChangeEvent, FormEvent } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import correctText from './lib/correct';
import { cannotGuessText } from './constants/prompt';
import { useAsync } from 'react-use';

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

  const [text, setText] = useState<string>('');
  const [isWrongText, setIsWrongText] = useState<boolean>(false);
  const [isCorrecting, setIsCorrecting] = useState<boolean>(false);
  const [isNoneText, setIsNoneText] = useState<boolean>(true);

  // 最初にテキストを復元する
  useAsync(async () => {
    if (chrome.storage === undefined) {
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
    if (chrome.storage === undefined) {
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
    <main className="w-screen h-screen text-base overflow-hidden">
      <section className="w-full bg-amber-100 flex flex-row">
        <h1 className="
          w-36 h-12 text-2xl text-white bg-amber-700 font-logo tracking-wide
          flex flex-col items-center justify-center relative
          after:w-10 after:border-t-[3rem] after:border-amber-700
          after:border-r-[3rem] after:border-r-transparent
          after:absolute after:-right-[3rem]
        ">
          端的次郎
        </h1>
      </section>

      <section className="p-5 flex flex-col items-center">
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

        {isCorrecting ? (
          <>
            <div
              aria-label="読み込み中"
              className="mt-2 mb-1 animate-spin h-8 w-8 border-4 border-amber-600 rounded-full border-t-transparent"
            />
            <span className="text-sm text-gray-500">
              ポップアップを閉じないでください
            </span>
          </>
        ) : (
          <button
            onClick={handleClickCorrection}
            type="submit"
            disabled={isNoneText}
            className={isNoneText ? `
              mt-3 px-5 py-2 text-gray-400 font-medium rounded-xl border-4 border-gray-400
              transition-colors duration-200
            ` : `
              mt-3 px-5 py-2 text-amber-600 font-medium rounded-xl border-4 border-amber-600
            hover:text-white hover:bg-amber-600 transition-colors duration-200
            `}
          >
            端的にする
          </button>
        )}
      </section>
    </main>
  );
};

export default Popup;

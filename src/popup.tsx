import { useCallback, useMemo, useState, ChangeEvent } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import correctText from './lib/correct';
import { cannotGuessText } from './constants/prompt';

const Popup = () => {
  // OpenAI APIの設定
  const configuration = useMemo(() => new Configuration({
    apiKey: 'sk-xxxxx',
  }), []);

  // OpenAIインスタンス
  const openai = useMemo(() => new OpenAIApi(
    configuration
  ), [configuration]);

  const [text, setText] = useState<string>('');
  const [isWrongText, setIsWrongText] = useState<boolean>(false);
  const [isCorrecting, setIsCorrecting] = useState<boolean>(false);

  const handleChangeText = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }, []);

  // useEffect(() => {
  //   console.log(chrome);
  //   chrome.storage.sync.get(['apiKey']).then((result) => {
  //     setApiKey(result.apiKey);
  //   });
  // }, []);

  // const handleSetting = useCallback(() => {
  //   chrome.storage.sync.set(
  //     {
  //       'apiKey': 'secret'
  //     }
  //   );
  // }, []);

  // 「端的にする」ボタンを押されたときの処理
  const handleClickCorrection = useCallback(async () => {
    try {
      setIsCorrecting(true);
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
          onChange={handleChangeText}
          disabled={isCorrecting}
          className={
            isWrongText
            ? 'p-3 w-full h-[65vh] bg-red-200 transition-colors duration-300 rounded-xl'
            : 'p-3 w-full h-[65vh] bg-gray-200 transition-colors duration-300 rounded-xl'
          }
        />

        <button
          onClick={handleClickCorrection}
          className="
            mt-3 px-5 py-2 text-amber-600 font-medium rounded-xl border-4 border-amber-600
          hover:text-white hover:bg-amber-600 transition-colors
          "
        >
          端的にする
        </button>
      </section>
    </main>
  );
};

export default Popup;

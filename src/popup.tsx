import { useCallback, useEffect, useState } from 'react';

function Popup() {
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    console.log(chrome);
    chrome.storage.sync.get(['apiKey']).then((result) => {
      setApiKey(result.apiKey);
    });
  }, []);

  const handleSetting = useCallback(() => {
    chrome.storage.sync.set(
      {
        'apiKey': 'secret'
      }
    );
  }, []);

  return (
    <main className="w-screen h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold text-red-500">
        こんにちは世界
      </h1>
      {apiKey}
      <button onClick={handleSetting}>
        設定する！
      </button>
    </main>
  );
}

export default Popup;

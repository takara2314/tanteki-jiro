import { useCallback } from 'react';
import { MdSettings } from 'react-icons/md';
import type { Section } from './models';

interface Props {
  section: Section;
  setSection: (section: Section) => void;
}

const Header = ({ section, setSection }: Props) => {
  // 設定ボタンが押されたとき
  const handleClickSettings = useCallback(() => {
    setSection('settings');
  }, [setSection]);

  // 戻るボタンが押されたとき
  const handleClickBack = useCallback(() => {
    setSection('home');
  }, [setSection]);

  return (
    <header className="w-full h-12 bg-amber-100 flex flex-row items-center justify-between">
      <h1
        className="
          w-36 h-full text-2xl text-white bg-amber-700 font-logo tracking-wide
          flex flex-col items-center justify-center cursor-pointer relative
          after:w-10 after:border-t-[3rem] after:border-amber-700
          after:border-r-[3rem] after:border-r-transparent
          after:absolute after:-right-[3rem]
        "
        onClick={handleClickBack}
      >
        端的次郎
      </h1>

      {section === 'home' ? (
        <button
          onClick={handleClickSettings}
          className="mr-5 w-10 h-10 text-xl text-gray-600 bg-transparent hover:bg-amber-200 rounded-full flex flex-col items-center justify-center transition-colors duration-200"
        >
          <MdSettings />
        </button>
      ) : (
        <button
          onClick={handleClickBack}
          className="mr-5 text-gray-600 hover:text-amber-700 transition-colors duration-100"
        >
          ← ホームに戻る
        </button>
      )}
    </header>
  );
};

export default Header;

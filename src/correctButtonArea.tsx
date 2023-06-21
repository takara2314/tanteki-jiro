interface Props {
  isCorrecting: boolean;
  onClick: () => void;
  isNoneText: boolean;
}

// 「端的にする」ボタン付近の要素
const CorrectButtonArea = ({isCorrecting, onClick, isNoneText}: Props) => {
  if (isCorrecting) {
    return (
      <>
        <div
          aria-label="読み込み中"
          className="mt-2 mb-1 animate-spin h-8 w-8 border-4 border-amber-600 rounded-full border-t-transparent"
        />
        <span className="text-sm text-gray-500">
          ポップアップを閉じないでください
        </span>
      </>
    );
  }

  return (
    <button
      onClick={onClick}
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
  );
};

export default CorrectButtonArea;

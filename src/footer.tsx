import { sourceCodePageUrl } from './constants/tips';

const Footer = () => {
  return (
    <footer className="my-3 text-center">
      <small className="text-gray-500 text-base">
        © 2023 Takara Hamaguchi
      </small>
      <div className="mt-1">
        <a
          href={sourceCodePageUrl}
          target="_blank"
          className="text-gray-500 hover:text-amber-700 text-sm transition-colors duration-100"
        >
          「端的次郎」のソースコード
        </a>
      </div>
    </footer>
  );
};

export default Footer;

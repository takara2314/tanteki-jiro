import { sourceCodePageUrl } from './constants/tips';
import { appVersion } from './constants/version';

const Footer = () => {
  return (
    <footer className="my-3 text-center">
      <small className="text-gray-500 text-base">
        © 2023 Takara Hamaguchi
      </small>
      <div className="mt-1 text-gray-500 text-sm">
        {appVersion}
        <span className="mx-1">
          /
        </span>
        <a
          href={sourceCodePageUrl}
          target="_blank"
          className="hover:text-amber-700 transition-colors duration-100"
        >
          「端的次郎」のソースコード
        </a>
      </div>
    </footer>
  );
};

export default Footer;

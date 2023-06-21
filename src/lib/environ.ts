const checkChromeExtension = () => {
  if (typeof chrome === 'undefined') {
    return false;
  }

  if (!chrome.storage) {
    return false;
  }

  return true;
};

export default checkChromeExtension;

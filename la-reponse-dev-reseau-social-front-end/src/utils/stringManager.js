export const firstLetterToUpperCase = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const formatNickname = (nickname) => {
  let nicknameArray = nickname.split('.');
  return nicknameArray
    .map((word) => {
      return firstLetterToUpperCase(word);
    })
    .join(' ');
};

export function cleanerSub(sub) {
  let cleanSub = sub.replace(/[^\w\d]/g, '');
  if (cleanSub.includes('googleoauth2')) {
    cleanSub = cleanSub.replace('googleoauth2', '');
  }
  if (cleanSub.includes('auth0')) {
    cleanSub = cleanSub.replace('auth0', '');
  }
  return cleanSub;
}

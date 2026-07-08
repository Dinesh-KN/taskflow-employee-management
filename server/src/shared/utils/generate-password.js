import crypto from 'crypto';

export const generateTemporaryPassword = (length = 12) => {
  const groups = [
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    'abcdefghijklmnopqrstuvwxyz',
    '0123456789',
    '!@#$%^&*',
  ];

  const allChars = groups.join('');

  const pick = (chars) => chars[crypto.randomInt(chars.length)];

  const password = groups.map(pick);

  while (password.length < length) {
    password.push(pick(allChars));
  }

  return password.sort(() => crypto.randomInt(3) - 1).join('');
};

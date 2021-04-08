// eslint-disable-next-line import/prefer-default-export
export const isUrl = (text: string): boolean => {
  const regex = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi;
  return regex.test(text);
};

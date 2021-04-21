export const nextFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      resolve();
    });
  });

export const normalizeScale = (value: number, min: number, max: number) =>
  (value - min) / (max - min);

export const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

export const camelCaseToText = (text: string): string =>
  capitalize(text.replace(/([A-Z])/g, ' $1').toLowerCase());

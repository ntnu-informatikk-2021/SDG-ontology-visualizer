export const nextFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      resolve();
    });
  });

export const normalizeScale = (value: number, min: number, max: number) =>
  (value - min) / (max - min);

export const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

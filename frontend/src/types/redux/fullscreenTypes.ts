export type FullscreenState = {
  isFullscreen: boolean;
};

export type ToggleFullscreenStateAction = {
  type: typeof SET_FULLSCREEN;
};

export const SET_FULLSCREEN = 'TOGGLE_FULLSCREEN';

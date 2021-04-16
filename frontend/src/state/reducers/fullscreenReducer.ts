import {
  FullscreenState,
  ToggleFullscreenStateAction,
  SET_FULLSCREEN,
} from '../../types/redux/fullscreenTypes';

const defaultState: FullscreenState = {
  isFullscreen: false,
};

const fullscreenReducer = (
  state: FullscreenState = defaultState,
  action: ToggleFullscreenStateAction,
) => {
  switch (action.type) {
    case SET_FULLSCREEN:
      return {
        isFullscreen: !state.isFullscreen,
      };
    default:
      return state;
  }
};

export const toggleFullscreen = (): ToggleFullscreenStateAction => ({
  type: 'TOGGLE_FULLSCREEN',
});

export default fullscreenReducer;

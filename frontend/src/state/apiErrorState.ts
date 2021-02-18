import { atom } from 'recoil';

const apiErrorState = atom({
  key: 'apiError',
  default: false,
});

export default apiErrorState;

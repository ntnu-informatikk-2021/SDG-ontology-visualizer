import React, { createContext, useState } from 'react';

type ContextType = {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
};

type ProviderProps = {
  children: React.ReactNode;
};

const FullscreenContext = createContext<ContextType>({
  isFullscreen: false,
  toggleFullscreen: () => {},
});

export const FullscreenContextProvider: React.FC<ProviderProps> = ({ children }: ProviderProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  return (
    <FullscreenContext.Provider
      value={{
        isFullscreen,
        toggleFullscreen: () => {
          console.log(`toggle fullscreen. New value: ${!isFullscreen}`);
          setIsFullscreen(!isFullscreen);
        },
      }}
    >
      {children}
    </FullscreenContext.Provider>
  );
};

export default FullscreenContext;

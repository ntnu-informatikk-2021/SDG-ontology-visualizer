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

export const FullscreenProvider: React.FC<ProviderProps> = ({ children }: ProviderProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  return (
    <FullscreenContext.Provider
      value={{
        isFullscreen,
        toggleFullscreen: () => setIsFullscreen(!isFullscreen),
      }}
    >
      {children}
    </FullscreenContext.Provider>
  );
};

export default FullscreenContext;

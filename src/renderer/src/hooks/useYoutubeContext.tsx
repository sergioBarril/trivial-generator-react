import { createContext, useContext } from "react";
import useYoutubeEmbed from "./useYoutubeEmbed";

const YoutubeContext = createContext<ReturnType<typeof useYoutubeEmbed> | null>(null);

// eslint-disable-next-line react/prop-types
export const YoutubeProvider = ({ children }) => {
  const hookValue = useYoutubeEmbed();

  return (
    <YoutubeContext.Provider value={hookValue}>
      {children}
      {hookValue.component}
    </YoutubeContext.Provider>
  );
};

export const useYoutubeContext = () => {
  const context = useContext(YoutubeContext);
  if (!context) {
    throw new Error("useYoutubeContext must be used within a YoutubeProvider");
  }
  return context;
};

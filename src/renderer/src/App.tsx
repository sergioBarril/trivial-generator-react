import { Route, Routes } from "react-router-dom";
import MainMenu from "./pages/index/index.root";

import ListEditor from "./pages/list-editor/list-editor.root";
import { useYoutubeContext, YoutubeProvider } from "./hooks/useYoutubeContext";

function YoutubePlayer() {
  const { component } = useYoutubeContext();
  return component;
}

function App(): JSX.Element {
  return (
    <YoutubeProvider>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/list-editor" element={<ListEditor />} />
      </Routes>
      <YoutubePlayer />
    </YoutubeProvider>
  );
}

export default App;

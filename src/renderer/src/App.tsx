import { Route, Routes } from "react-router-dom";
import MainMenu from "./pages/index/index.root";

import ListEditor from "./pages/list-editor/list-editor.root";

function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<MainMenu />} />
      <Route path="/list-editor" element={<ListEditor />} />
    </Routes>
  );
}

export default App;

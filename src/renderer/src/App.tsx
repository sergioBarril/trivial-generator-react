import { Route, Routes } from "react-router-dom";
import MainMenu from "./components/MainMenu";

import ListEditor from "./components/list-editor/ListEditor";

function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<MainMenu />} />
      <Route path="/list-editor" element={<ListEditor />} />
    </Routes>
  );
}

export default App;

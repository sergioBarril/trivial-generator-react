import { Route, Routes } from "react-router-dom";
import MainMenu from "./components/MainMenu";
import { CardWithForm } from "./components/MyCard";

function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<MainMenu />} />
      <Route path="/card" element={<CardWithForm />} />
    </Routes>
  );
}

export default App;

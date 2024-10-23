/*
   const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

       <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>

 */

import MainMenu from "./components/MainMenu";

function App(): JSX.Element {
  return (
    <>
      <div className="grid grid-cols-[10%_1fr_10%] gap-0 grid-rows-1 h-full min-h-full">
        <div />
        <MainMenu />
        <div />
      </div>
    </>
  );
}

export default App;

import MainButton from "./components/MainButton";

import listIcon from "./assets/icons/list.png";
import MainLogo from "./components/MainLogo";

/*
   const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

       <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>

 */

function App(): JSX.Element {
  return (
    <>
      <MainLogo />
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl text-white">
        Trivial Generator
      </h1>
      <div>
        <div className="max-w-xl m-auto flex flex-col align-center justify-center">
          <MainButton iconUrl={listIcon} label="Load List 2" />
        </div>
      </div>
    </>
  );
}

export default App;

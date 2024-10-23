import MainButton from "./MainButton";
import MainLogo from "./MainLogo";

import listIcon from "../assets/icons/list.png";
import newIcon from "../assets/icons/new.png";

function MainMenu() {
  return (
    <div className="grid grid-cols-1 grid-rows-[150px_1fr] gap-14">
      <div className="mx-auto pt-10 h-32 w-32 flex flex-row justify-center align-center gap-10">
        <h1 className="mx-auto text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl text-white">
          Trivial Generator
        </h1>
        <MainLogo className="mx-auto h-32 w-32 float-right" />
      </div>
      <div>
        <div className="max-w-xl m-auto flex flex-row align-center justify-center">
          <MainButton iconUrl={newIcon} label="New List" />
          <MainButton iconUrl={listIcon} label="Edit List" />
        </div>
      </div>
    </div>
  );
}

export default MainMenu;

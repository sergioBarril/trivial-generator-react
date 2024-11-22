import MainButton from "./MainButton";
import MainLogo from "./MainLogo";

import listIcon from "../assets/icons/list.png";
import newIcon from "../assets/icons/new.png";

import { Label } from "./ui/Label";
import { useEffect, useState } from "react";
import CustomInput from "./CustomInput";
import { useNavigate } from "react-router-dom";

function MainMenu() {
  const [listFilePath, setListFilePath] = useState("");
  const [outputDir, setOutputDir] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const handleOutputDirectoryEvent = (_, params) => {
      setOutputDir(params.path);
    };

    return window.electron.ipcRenderer.on("dialog:outputDirectory", handleOutputDirectoryEvent);
  }, []);

  const handleSongFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files && event.target.files?.[0];
    if (newFile) {
      setListFilePath(newFile.path);
    } else {
      setListFilePath("");
    }
  };

  const handleInputDirectoryClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    window.electron.ipcRenderer.send("dialog:openDirectory");
  };

  const handleEditListClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    // window.electron.ipcRenderer.send("list:editList", { listFilePath: listFilePath });
    console.log("pfft");
    navigate("/list-editor");
  };

  const displayedListPath = listFilePath || "No file selected";
  const displayedOutputDir = outputDir || "No selected folder";

  return (
    <div className="dark grid grid-cols-[10%_1fr_10%] gap-0 grid-rows-1 h-full min-h-full">
      <div />
      <div className="grid grid-cols-1 grid-rows-[150px_1fr_110px_45px_1fr_1fr_1fr] gap-10">
        <div className="mx-auto pt-10 h-32 w-32 flex flex-row justify-center align-center gap-10">
          <h1 className="mx-auto text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl text-white">
            Trivial Generator
          </h1>
          <MainLogo className="mx-auto h-32 w-32 float-right" />
        </div>

        <div className="max-w-xl m-auto flex flex-row align-center justify-center">
          <MainButton iconUrl={newIcon} label="New List" />
          <MainButton iconUrl={listIcon} label="Edit List" onClick={handleEditListClick} />
        </div>

        <div className="grid grid-cols-[5%_3fr_5fr] grid-rows-[40px_40px] gap-y-4 gap-x-3">
          <div />
          <Label className="text-2xl text-right">Input file:</Label>
          <Label
            dir="rtl"
            className="font-mono text-lg text-left self-center overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {displayedListPath}
          </Label>

          <div />
          <Label className="text-2xl text-right">Output folder:</Label>
          <Label
            dir="rtl"
            className="font-mono text-lg text-left self-center overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {displayedOutputDir}
          </Label>
        </div>

        <div className="flex flex-row justify-center gap-x-8">
          <CustomInput
            accept="application/json"
            text="Choose a list file"
            onFileChange={handleSongFileChange}
          />
          <CustomInput text="Choose a folder" onClick={handleInputDirectoryClick} />
        </div>
      </div>
      <div />
    </div>
  );
}

export default MainMenu;

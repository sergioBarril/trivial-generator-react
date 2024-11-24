import MainButton from "./index-button";
import MainLogo from "./index-logo";

import listIcon from "../../assets/icons/list.png";
import newIcon from "../../assets/icons/new.png";

import { Label } from "../../components/ui/Label";
import { useEffect, useState } from "react";
import FileInput from "../../components/FileInput";
import { useLocation, useNavigate } from "react-router-dom";
import { ListFile } from "@renderer/types/list.types";
import { animeListSchema } from "@renderer/schemas/list.schemas";
import { Button } from "@renderer/components/ui/Button";

type MainMenuProps = {
  originalListPath?: string;
  originalOutputDir?: string;
};

function MainMenu() {
  const defaultState = (useLocation().state as MainMenuProps | null) || {};

  const originalListPath = defaultState.originalListPath || "";
  const originalOutputDir = defaultState.originalOutputDir || "";

  const [outputDir, setOutputDir] = useState(originalOutputDir);

  const [listFile, setListFile] = useState<ListFile>({
    path: originalListPath,
    content: { author: "", songs: [] }
  });

  const navigate = useNavigate();

  useEffect(() => {
    const handleOutputDirectoryEvent = (_, params) => {
      setOutputDir(params.path);
    };

    return window.electron.ipcRenderer.on("dialog:outputDirectory", handleOutputDirectoryEvent);
  }, []);

  useEffect(() => {
    if (!listFile.path) return;

    const file = window.api.fs.readFileSync(listFile.path, "utf-8").toString();

    const rawListObject = JSON.parse(file);
    const validatedData = animeListSchema.parse(rawListObject);

    setListFile((oldFile) => ({ ...oldFile, content: validatedData }));
  }, [listFile.path]);

  const handleSongFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files && event.target.files?.[0];
    if (newFile) {
      setListFile((prev) => ({ ...prev, path: newFile.path }));
    } else {
      setListFile({ path: "", content: { author: "", songs: [] } });
    }
  };

  const handleInputDirectoryClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    window.electron.ipcRenderer.send("dialog:openDirectory");
  };

  const handleListEditorClick = (mode: "new" | "edit") => {
    navigate("/list-editor", {
      state: { originalListPath: listFile.path, originalOutputDir: outputDir, mode }
    });
  };

  const handleGenerate = () => {
    window.electron.ipcRenderer.send("generate:trivial", { outputDir });
  };

  const displayedListPath = listFile.path || "No file selected";
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
          <MainButton
            iconUrl={newIcon}
            label="New List"
            onClick={() => handleListEditorClick("new")}
          />
          <MainButton
            iconUrl={listIcon}
            label="Edit List"
            disabled={!listFile.path}
            onClick={() => handleListEditorClick("edit")}
          />
          <MainButton iconUrl={listIcon} label="Generate Trivial" disabled />
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

          <div />
          <Label className="text-2xl text-right">Songs:</Label>
          <Label
            dir="rtl"
            className="font-mono text-lg text-left self-center overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {listFile.content?.songs.length ?? 0}
          </Label>
        </div>

        <div className="flex flex-row justify-center gap-x-8">
          <FileInput
            accept="application/json"
            text="Choose a list file"
            onFileChange={handleSongFileChange}
          />
          <FileInput text="Choose a folder" onClick={handleInputDirectoryClick} />
          <Button onClick={handleGenerate}>Generate</Button>
        </div>
      </div>
      <div />
    </div>
  );
}

export default MainMenu;

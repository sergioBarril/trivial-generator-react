import MainLogo from "./index-logo";

import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { ListFile } from "@renderer/types/list.types";
import { animeListSchema } from "@renderer/schemas/list.schemas";
import { Button } from "@renderer/components/ui/Button";
import useYoutubeEmbed from "@renderer/hooks/useYoutubeEmbed";

import { Card, CardContent, CardFooter } from "@renderer/components/ui/Card";
import { Edit, List } from "lucide-react";
import { UploadFile, UploadFolder } from "./upload";

type MainMenuProps = {
  originalListPath?: string;
  originalOutputDir?: string;
};

const EMPTY_LIST_FILE: ListFile = {
  content: {
    author: "",
    songs: []
  },
  path: ""
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

  const { isVideoEmbeddable, component } = useYoutubeEmbed();

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

  const handleOutputDirectoryClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    window.electron.ipcRenderer.send("dialog:openDirectory");
  };

  const handleListEditorClick = (mode: "new" | "edit") => {
    navigate("/list-editor", {
      state: { originalListPath: listFile.path, originalOutputDir: outputDir, mode }
    });
  };

  /**
   * Check if the songs are embeddable in the HTML
   *
   * @returns A map that assigns to each songId true iff it's embeddable.
   */
  const checkEmbeddability = async () => {
    const songIds = listFile.content.songs.map((song) => song.link.split("/").at(-1)!);

    const results = new Map<string, boolean>();

    for (const songId of songIds) {
      const isValid = await isVideoEmbeddable(songId);
      results.set(songId, isValid);
    }

    console.log("Finished getting copyright songs");

    return results;
  };

  const handleGenerate = async () => {
    const embeddableMap = await checkEmbeddability();

    window.electron.ipcRenderer.send("generate:trivial", {
      outputDir,
      listFileContent: listFile.content,
      embeddableMap
    });
  };

  const displayedListPath = window.api.path.basename(listFile.path) || "Choose input file";
  const displayedOutputDir = window.api.path.basename(outputDir) || "Choose output folder";

  const canGenerate = listFile.content.songs.length > 0 && Boolean(outputDir);

  return (
    <div className="dark grid grid-cols-[10%_1fr_10%] gap-0 grid-rows-1 h-full min-h-full">
      <div />
      <div className="grid grid-cols-1 grid-rows-[150px_1fr] gap-20">
        <div className="mx-auto pt-10 h-32 w-32 flex flex-row justify-center align-center gap-10">
          <h1 className="mx-auto text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl text-white">
            Trivial Generator
          </h1>
          <MainLogo className="mx-auto h-32 w-32 float-right" />
        </div>

        <div className="min-h-screen flex items-start justify-center p-4">
          <Card className="w-full max-w-md pt-4">
            <CardContent className="space-y-4">
              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={() => handleListEditorClick("new")}>
                  <List className="mr-2 h-4 w-4" />
                  Create List
                </Button>
                <Button variant="outline" onClick={() => handleListEditorClick("edit")}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit List
                </Button>
              </div>

              <UploadFile
                type="file"
                label="Input File"
                button={displayedListPath}
                path={listFile.path}
                onChange={handleSongFileChange}
                onClickReset={() => setListFile(EMPTY_LIST_FILE)}
              />

              <UploadFolder
                type="folder"
                label="Output folder"
                button={displayedOutputDir}
                path={outputDir}
                onClick={handleOutputDirectoryClick}
                onClickReset={() => setOutputDir("")}
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleGenerate} disabled={!canGenerate}>
                Generate
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div />
      {component}
    </div>
  );
}

export default MainMenu;

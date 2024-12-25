import { useEffect, useRef, useState } from "react";
import { Label } from "../../components/ui/Label";
import { ListEditorTable } from "./table/list-editor-table";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useLocation, useNavigate } from "react-router-dom";
import { animeListSchema, animeSongSchema } from "@renderer/schemas/list.schemas";
import { AnimeSong, AnimeSongList } from "@renderer/types/list.types";
import { SaveAs } from "./save-as";
import { Card, CardContent } from "@renderer/components/ui/Card";

type ListEditorProps = {
  originalListPath?: string;
  originalOutputDir?: string;
  mode: "new" | "edit";
};

function buildDefaultRow() {
  return animeSongSchema.parse({});
}

function ListEditor() {
  const { originalListPath, originalOutputDir, mode } = useLocation().state as ListEditorProps;

  const navigate = useNavigate();

  const [author, setAuthor] = useState("");
  const [data, setData] = useState<AnimeSong[]>([]);
  const [listPath, setListPath] = useState(mode === "edit" ? originalListPath || "" : "");

  const tableDivRef = useRef<HTMLTableElement>(null);

  const handleInputSaveAsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    window.electron.ipcRenderer.send("dialog:saveAs");
  };

  useEffect(() => {
    if (!listPath) return;
    const file = window.api.fs.readFileSync(listPath, "utf-8").toString();

    const rawListObject = JSON.parse(file);
    const validatedData = animeListSchema.parse(rawListObject);

    setAuthor(validatedData.author);
    setData(validatedData.songs);
  }, []);

  useEffect(() => {
    const handleListPathChanged = (_, params) => {
      setListPath(params.path);
    };

    return window.electron.ipcRenderer.on("dialog:listTargetPath", handleListPathChanged);
  }, []);

  const handleCancelClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    navigate("/", {
      state: { originalListPath, originalOutputDir }
    });
  };

  const handleSaveAndQuitClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const songList: AnimeSongList = {
      author,
      songs: data
    };

    const jsonOutput = JSON.stringify(songList, null, "\t");
    window.api.fs.writeFileSync(listPath!, jsonOutput);

    navigate("/", { state: { originalListPath: listPath, originalOutputDir } });
  };

  const handleAddRowClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setData((prevData) => {
      const newRow = buildDefaultRow();
      return [...prevData, newRow];
    });

    // Scroll to the bottom after updating the data
    setTimeout(() => {
      if (tableDivRef.current) {
        tableDivRef.current.scrollTop = tableDivRef.current.scrollHeight;
      }
    }, 0);
  };

  const isCurrentDataValid = data.every((song) => song.link.length);
  const displayedListPath = window.api.path.basename(listPath) || "Choose input file";

  const canSave = isCurrentDataValid && listPath?.length;

  return (
    <div className="container mx-0 max-w-full w-full py-10">
      <h1 className="mx-auto mb-6 text-xl font-extrabold leading-none tracking-tight md:text-2xl lg:text-3xl text-white">
        List Editor
      </h1>
      <ListEditorTable
        data={data}
        setData={setData}
        tableDivRef={tableDivRef}
        className="max-h-[50vh]"
      />

      <div className="mt-10 mb-5 flex flex-row justify-between">
        <Card className="w-full max-w-[50%] pt-4">
          <CardContent className="space-y-4">
            <div className="grid grid-cols-[30%,1fr] grid-flow-row gap-5">
              <Label className="text-2xl text-right w-full">Output File:</Label>
              <SaveAs button={displayedListPath} path={listPath} onClick={handleInputSaveAsClick} />

              <Label className="text-2xl text-right">Author:</Label>
              <Input
                className="w-[150px]"
                placeholder="Author..."
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              ></Input>

              <Label className="text-2xl text-right w-full">Songs:</Label>
              <Label className="text-xl text-start self-end">{data.length}</Label>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full max-w-[20%] max-h-20 pt-4">
          <CardContent className="space-y-4">
            <div className="w-full flex flex-row justify-center gap-6">
              <Button variant="default" onClick={handleAddRowClick}>
                Add row
              </Button>
              <Button variant="destructive" onClick={handleAddRowClick}>
                Import Youtube Playlist
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-row-reverse gap-5">
        <Button onClick={handleSaveAndQuitClick} disabled={!canSave}>
          Save and quit
        </Button>
        <Button variant={"secondary"} onClick={handleCancelClick}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default ListEditor;

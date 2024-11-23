import { useEffect, useRef, useState } from "react";
import { Label } from "../../components/ui/Label";
import { ListEditorTable } from "./table/list-editor-table";
import FileInput from "../../components/FileInput";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useLocation, useNavigate } from "react-router-dom";
import { animeListSchema, AnimeSong, AnimeSongList, animeSongSchema } from "./list-editor.schemas";

type ListEditorProps = {
  defaultListPath?: string;
  defaultOutputDir?: string;
};

function buildDefaultRow() {
  return animeSongSchema.parse({});
}

function ListEditor() {
  const { defaultListPath, defaultOutputDir } = useLocation().state as ListEditorProps;

  const navigate = useNavigate();

  const [author, setAuthor] = useState("");
  const [data, setData] = useState<AnimeSong[]>([]);
  const [listPath, setListPath] = useState(defaultListPath);

  const tableDivRef = useRef<HTMLTableElement>(null);

  const handleInputSaveAsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    window.electron.ipcRenderer.send("dialog:saveAs");
  };

  useEffect(() => {
    if (!defaultListPath) return;
    const file = window.api.fs.readFileSync(defaultListPath, "utf-8").toString();

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
    navigate("/", { state: { defaultListPath, defaultOutputDir } });
  };

  const handleSaveAndQuitClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const songList: AnimeSongList = {
      author,
      songs: data
    };

    const jsonOutput = JSON.stringify(songList, null, "\t");
    window.api.fs.writeFileSync(listPath!, jsonOutput);

    navigate("/", { state: { defaultListPath: listPath, defaultOutputDir } });
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

      <div className="mt-10 flex flex-row">
        <Label className="text-2xl text-right">Output file:</Label>
        <Label
          dir="rtl"
          className="font-mono text-xl ml-5 text-left self-center overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {listPath || "No file yet"}
        </Label>
        <FileInput
          className="ml-5 h-9"
          accept="application/json"
          text="Choose a destination"
          onClick={handleInputSaveAsClick}
        />

        <Button variant="outline" className="ml-auto" onClick={handleAddRowClick}>
          Add row
        </Button>
      </div>

      <div className="flex flex-row mt-8 gap-5">
        <Label className="text-2xl text-right">Author:</Label>
        <Input
          className="w-[150px]"
          placeholder="Author..."
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        ></Input>
      </div>

      <div className="flex flex-row mt-8 gap-5 items-stretch">
        <Label className="text-2xl text-right">Songs:</Label>
        <Label className="text-xl text-start self-end">{data.length}</Label>
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

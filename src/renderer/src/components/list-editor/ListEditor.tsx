import { ListEditorTable } from "./ListEditorTable";
import { songList } from "./ListEditorTable.mock";

function ListEditor() {
  const data = songList.songs;

  return (
    <div className="container mx-auto py-10 h-10 max-h-10">
      <ListEditorTable defaultData={data} className="" />
    </div>
  );
}

export default ListEditor;

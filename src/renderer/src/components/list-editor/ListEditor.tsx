import { ListEditorTable } from "./ListEditorTable";
import { songList } from "./ListEditorTable.mock";

function ListEditor() {
  const data = songList.songs;

  return (
    <div className="container mx-auto py-10">
      <h1 className="mx-auto mb-6 text-xl font-extrabold leading-none tracking-tight md:text-2xl lg:text-3xl text-white">
        List Generator
      </h1>
      <ListEditorTable defaultData={data} className="max-h-[80vh]" />
    </div>
  );
}

export default ListEditor;

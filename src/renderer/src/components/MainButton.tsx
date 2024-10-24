type MainButtonIconProps = { iconUrl: string };
const MainButtonIcon = ({ iconUrl }: MainButtonIconProps) => <img src={iconUrl} width={32} />;

type MainButtonProps = { iconUrl: string; label: string };
function MainButton({ iconUrl, label }: MainButtonProps) {
  return (
    <div className="flex flex-col w-full items-center justify-center bg-grey-lighter mx-5  transition-filter duration-300 hover:drop-shadow-[0_0_1.2em_#6988e6aa]">
      <label className="w-64 flex flex-col items-center px-4 py-7 bg-gray-300 text-gray-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:text-teal-800">
        <MainButtonIcon iconUrl={iconUrl} />
        <span className="mt-2 leading-normal">{label}</span>

        <input name="list-file" id="list-input" type="file" className="hidden" />
      </label>
    </div>
  );
}

export default MainButton;

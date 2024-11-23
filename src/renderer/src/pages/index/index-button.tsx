type MainButtonIconProps = { iconUrl: string };
const MainButtonIcon = ({ iconUrl }: MainButtonIconProps) => <img src={iconUrl} width={32} />;

type MainButtonProps = {
  iconUrl: string;
  label: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
};
function MainButton({ iconUrl, label, onClick, disabled = false }: MainButtonProps) {
  return (
    <div
      onClick={!disabled ? onClick : undefined} // Disable onClick when disabled
      className={`flex flex-col w-full items-center justify-center mx-5 transition-filter duration-300 
        ${disabled ? "bg-gray-300/50 cursor-not-allowed hover:bg-gray-500" : "bg-grey-lighter hover:drop-shadow-[0_0_1.2em_#6988e6aa]"}`}
    >
      <label
        className={`w-64 flex flex-col items-center px-4 py-7 rounded-lg shadow-lg tracking-wide uppercase border 
          ${disabled ? "bg-gray-400/15 hover:bg-gray-500 text-gray-400 border-gray-400" : "bg-gray-300 text-gray-500 border-blue hover:text-teal-800 cursor-pointer"}`}
      >
        <MainButtonIcon iconUrl={iconUrl} />
        <span className="mt-2 leading-normal">{label}</span>
        <input type="button" className="hidden" />
      </label>
    </div>
  );
}

export default MainButton;

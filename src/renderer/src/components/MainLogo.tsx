import trivialIcon from "@renderer/assets/icons/trivial.png";

type MainLogoProps = {
  className?: string;
};

export default function MainLogo({ className }: MainLogoProps) {
  const defaultClassName =
    " select-none transition-filter duration-300 hover:drop-shadow-[0_0_1.2em_#6988e6aa] ";
  const finalClassName = defaultClassName + className;

  return (
    <img
      alt="logo"
      className={finalClassName}
      src={trivialIcon}
      onDragStart={(e) => e.preventDefault()}
    />
  );
}

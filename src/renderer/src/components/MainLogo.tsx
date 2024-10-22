import trivialIcon from "@renderer/assets/icons/trivial.png";

export default function MainLogo() {
  return (
    <img
      alt="logo"
      className=" mb-5 h-32 w-32 select-none transition-filter duration-300 hover:drop-shadow-[0_0_1.2em_#6988e6aa]"
      src={trivialIcon}
      onDragStart={(e) => e.preventDefault()}
    />
  );
}

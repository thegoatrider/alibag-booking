import clsx from "clsx";

export default function Input(props: any) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full",
        "border border-gray-200",
        "rounded-xl",
        "px-4 py-2.5",
        "bg-white",
        "focus:outline-none focus:ring-2 focus:ring-brand/30",
        "transition-all duration-200",
        props.className
      )}
    />
  );
}

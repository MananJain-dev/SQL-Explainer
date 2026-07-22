import type { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export default function Card({
  title,
  children,
}: Props) {

  return (

    <div
      className="
      bg-white
      rounded-2xl
      shadow-md
      border
      border-slate-200
      p-6
      hover:shadow-xl
      transition
      duration-300
    "
    >

      <h2
        className="
        text-2xl
        font-bold
        text-slate-800
        mb-6
      "
      >
        {title}
      </h2>

      {children}

    </div>
  );
}
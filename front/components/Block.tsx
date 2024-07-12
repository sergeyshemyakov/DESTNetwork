import { FC, PropsWithChildren } from "react";

interface BlockProps {
  title: string;
  subtitle: string;
}

export const Block: FC<PropsWithChildren<BlockProps>> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="flex flex-col w-full">
      <div className="max-w-[600] w-full mb-8">
        <h2 className="header-text text-6xl">{title}</h2>
        <p className="text-xl mt-2 text-gray-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
};

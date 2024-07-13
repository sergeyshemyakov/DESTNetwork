import { FC, PropsWithChildren, ReactNode } from "react";

interface BlockProps {
  title: ReactNode | string;
  subtitle?: ReactNode;
}

export const Block: FC<PropsWithChildren<BlockProps>> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="flex flex-col w-full">
      <div className="max-w-[600px] w-full mb-8">
        {typeof title === "string" ? (
          <h2 className="header-text text-6xl flex gap-4 items-center">
            {title}
          </h2>
        ) : (
          title
        )}

        <p className="text-xl mt-2 text-gray-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
};

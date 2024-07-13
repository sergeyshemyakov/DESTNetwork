import { FC, PropsWithChildren, ReactNode } from "react";

interface BlockProps {
  title: ReactNode | string;
  subtitle?: ReactNode | string;
  hasMaxWidth?: boolean;
}

export const Block: FC<PropsWithChildren<BlockProps>> = ({
  title,
  subtitle,
  children,
  hasMaxWidth = true,
}) => {
  return (
    <div className="flex flex-col w-full">
      <div className={`${hasMaxWidth ? "max-w-[600px]" : ""} w-full`}>
        {typeof title === "string" ? (
          <h2 className="header-text text-6xl flex gap-4 items-center mb-6">
            {title}
          </h2>
        ) : (
          title
        )}

        {typeof subtitle === "string" ? (
          <p className="text-xl mt-2 text-gray-500">{subtitle}</p>
        ) : (
          subtitle
        )}
      </div>
      {children}
    </div>
  );
};

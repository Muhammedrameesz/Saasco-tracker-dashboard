import Link from "next/link";
import React from "react";


type PageTitleProps = {
  title: string;
  breadcrumbs?: {
    title: string;
    href?: string;
  }[];
  children?: React.ReactNode;
};

export default function PageTitle(props: Readonly<PageTitleProps>) {
  return (
    <div className=" flex justify-between items-center flex-wrap  w-full  px-3">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {props.title}
        </h2>

        {props.breadcrumbs && (
          <div className="flex items-center ">
            {props.breadcrumbs.map((breadcrumb, index) => (
              <div
                key={index}
                className="text-sm text-gray-500 dark:text-gray-300"
              >
                <Link href={breadcrumb.href || "#"}>{breadcrumb.title}</Link>
                {props?.breadcrumbs &&
                  index < props?.breadcrumbs?.length - 1 && (
                    <span className="px-2">/</span>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
      {props?.children && <div>{props.children}</div>}
    </div>
  );
}

import React from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PaginationProps = {
  totalPages: number;
  limit: number;
  page: number;
  hasNextPage: boolean;
  totalCount: number;
  onChange: (page: number) => void;
};

export default function PaginationComp({
  totalPages,
  page,
  hasNextPage,
  totalCount,
}: PaginationProps) {
  console.log(
    "PaginationComp -> totalPages",
    totalPages,
    page,
    hasNextPage,
    totalCount
  );

  if (totalPages === 0) return null;

  const paginationArray = [];

  // Always include the first page
  paginationArray.push(1);

  // Add null if there’s a gap between the first page and the start of the range
  if (page > 3) {
    paginationArray.push(null);
  }

  // Add pages around the current page
  for (let i = page - 1; i <= page + 1; i++) {
    if (i > 1 && i < totalPages) {
      paginationArray.push(i);
    }
  }

  // Add null if there’s a gap between the end of the range and the last page
  if (page < totalPages - 2) {
    paginationArray.push(null);
  }

  // Always include the last page if totalPages > 1
  if (totalPages > 1) {
    paginationArray.push(totalPages);
  }

  return (
    <Pagination className="my-5">
      <PaginationContent>
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious href={`?page=${page - 1}`} />
          </PaginationItem>
        )}

        {/* <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem> */}

        {paginationArray.map((i, index) => {
          if (i === null) {
            return (
              <PaginationItem key={index}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={index}>
              <PaginationLink
                href={`?page=${i}`}
                isActive={i === page}
                className={i === page ? "bg-gray-100" : ""}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        {hasNextPage && (
          <PaginationItem>
            <PaginationNext href={`?page=${page + 1}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

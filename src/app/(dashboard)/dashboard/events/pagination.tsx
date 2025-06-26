import clsx from "clsx";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 4) pages.push("...");

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) pages.push(i);

      if (currentPage < totalPages - 3) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number" && page !== currentPage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center items-center p-4 space-x-2 bg-white mt-5 flex-wrap">
      <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-md shadow-sm mr-5">
        Showing
        <span className="font-semibold text-gray-800 ml-1">
          {currentPage}
        </span>{" "}
        of <span className="font-semibold text-gray-800">{totalPages}</span>
      </span>

      <button
        type="button"
        disabled={currentPage === 1}
        className={clsx(
          "px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 cursor-pointer",
          "bg-[#ff6600] text-white shadow-sm hover:bg-[#e65c00]",
          "disabled:opacity-40 disabled:cursor-not-allowed"
        )}
        onClick={() => handlePageClick(currentPage - 1)}
      >
        ← Prev
      </button>

      {generatePageNumbers().map((page, index) => (
        <button
          key={index}
          type="button"
          disabled={page === "..."}
          className={clsx(
            "mx-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 border cursor-pointer",
            page === currentPage
              ? "bg-[#ff6600] text-white border-transparent shadow-sm"
              : "bg-white text-neutral-700 border-neutral-300 hover:border-[#ff6600] hover:text-[#ff6600]",
            page === "..." &&
              "cursor-default text-neutral-400 border-none hover:text-neutral-400"
          )}
          onClick={() => handlePageClick(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        disabled={currentPage === totalPages}
        className={clsx(
          "px-4 ml-1.5 py-2 rounded-md font-medium text-sm transition-all duration-200 cursor-pointer",
          "bg-[#ff6600] text-white shadow-sm hover:bg-[#e65c00]",
          "disabled:opacity-40 disabled:cursor-not-allowed"
        )}
        onClick={() => handlePageClick(currentPage + 1)}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;

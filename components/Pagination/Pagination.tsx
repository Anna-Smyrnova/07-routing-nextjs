"use client";

import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (nextPage: number) => void;
}

export default function Pagination({
  totalPages,
  currentPage,
  setCurrentPage,
}: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={2}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => setCurrentPage(selected + 1)}
      forcePage={currentPage - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
      breakLabel="..."
    />
  );
}
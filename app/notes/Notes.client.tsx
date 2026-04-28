"use client";

import { useState, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { NoteTag } from "@/types/note";

import NoteForm from "@/components/NoteForm/NoteForm";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import css from "@/components/NotesPage/NotesPage.module.css"

import { fetchNotes } from "@/lib/api";

interface NoteProps {
  tag?: NoteTag;
}

export default function NotesClient({ tag }: NoteProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 300);

  const updateCurrentPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", {search: searchQuery, currentPage, tag}],
    queryFn: () => fetchNotes( {search: searchQuery, page: currentPage, tag, perPage:12}),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
       <SearchBox value={searchQuery} onSearch={handleSearch} />

        {isSuccess && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={updateCurrentPage}
          />
        )}

        <button onClick={openModal} className={css.button}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading, please wait...</p>}

      {!isLoading && isSuccess && notes.length > 0 && (
        <NoteList notes={notes} />
      )}

      {!isLoading && isSuccess && notes.length === 0 && (
        <p>Notes not found</p>
      )}

      {isError && <p>There was an error, please try again...</p>}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}
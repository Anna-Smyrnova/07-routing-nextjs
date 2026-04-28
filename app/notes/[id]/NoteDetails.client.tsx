"use client";

import { fetchNoteById } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import css from "../../../components/NoteDetails/NoteDetails.module.css";


export default function NoteDetailsClient({ id }: { id: string }) {



const { data: note, isLoading, error } = useQuery({
  queryKey: ["note", id],
  queryFn: () => fetchNoteById(id),
  enabled: Boolean(id),
  refetchOnMount: false,
});


  if (isLoading) return <p>Loading, please wait...</p>;
  if (error) return <p>Something went wrong.</p>;
  if (!note) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
       <div className={css.item}>
        <div className={css.header}>
         

          <h2>{note.title}</h2>
        </div>

        <p className={css.tag}>{note.tag}</p>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>
          {new Date(note.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
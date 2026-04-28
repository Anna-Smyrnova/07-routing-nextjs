
"use client";

import { fetchNoteById } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import css from "@/components/NoteDetails/NoteDetails.module.css";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Modal from "@/components/Modal/Modal";



export default function NotePreview() {
const {id} = useParams<{id: string}>();
const router = useRouter();

const handleGoBack = () => {
  router.back();
}

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
    <Modal onClose={handleGoBack}>
    <div className={css.container}>
         <button onClick ={handleGoBack}>← Back</button>

       <div className={css.item}>
        <div className={css.tag}>{note.tag}</div>
        <div className={css.header}>
                 
          <h2>{note.title}</h2>
        </div>
        
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>
          {new Date(note.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
    </Modal>
  );
}


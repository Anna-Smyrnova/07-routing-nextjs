import axios from "axios";
import type { Note, NewNote} from "@/types/note";


axios.defaults.baseURL = "https://notehub-public.goit.study/api";

axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`;




interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}

interface Category {
page?: number;
perPage?: number;
tag?: string;
search?: string;
}

export const fetchNotes = async (params: Category): Promise<FetchNotesResponse> => {
const response = await axios.get<FetchNotesResponse>('/notes', {
    params,
});
return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axios.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (newNote: NewNote): Promise<Note> => {
const response = await axios.post<Note>('/notes', newNote);
return response.data;
};


export const deleteNote = async (noteId: string): Promise<Note>  => {
const response = await axios.delete<Note>(`/notes/${noteId}`);
return response.data;
}
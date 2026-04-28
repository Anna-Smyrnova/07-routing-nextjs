import { fetchNotes } from "@/lib/api"

import { QueryClient } from "@tanstack/react-query";
import { NoteTag } from "@/types/note";
import NotesClient from "@/app/notes/Notes.client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

type NotesbyCategoryProps = {
params: {slug: string[]};
};

export default async function NotesByCategory({params}:NotesbyCategoryProps) {
    const { slug } = await params;
    const tag = slug[0];
    const searchTag = tag === 'all' ? undefined : tag;

    const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", "", 1, searchTag],
    queryFn: () => fetchNotes({
        page: 1,
        search: "",
        tag: searchTag as NoteTag
    }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={searchTag as NoteTag} />
    </HydrationBoundary>
  );
}




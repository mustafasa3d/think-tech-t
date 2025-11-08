import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import type { Character, Episode } from "../types";
import { CharacterCardSkeleton, Skeleton } from "../components/Skeleton";
import { useRecentCharacters } from "../hooks/useRecentCharacters";

function useCharacter(id: string) {
  return useQuery({
    queryKey: ["character", id],
    queryFn: async () => {
      const res = await api.get<Character>(`/character/${id}`);
      return res.data;
    },
    staleTime: 30_000,
    retry: 2,
  });
}

function useEpisodes(ids: number[]) {
  return useQuery({
    queryKey: ["episodes", ids.join(",")],
    queryFn: async () => {
      if (!ids.length) return [] as Episode[];
      const res = await api.get<Episode | Episode[]>(
        `/episode/${ids.join(",")}`
      );
      const data = Array.isArray(res.data) ? res.data : [res.data];
      return data;
    },
    enabled: ids.length > 0,
    staleTime: 60_000,
  });
}

export default function CharacterDetailsPage() {
  const { id = "" } = useParams();
  const { data: character, isLoading } = useCharacter(id);
  const { push } = useRecentCharacters();

  const episodeIds = (character?.episode || [])
    .slice(0, 5)
    .map((u: string) => Number(u.split("/").pop()));
  const { data: episodes } = useEpisodes(episodeIds);

  useEffect(() => {
    if (character) push(character);
  }, [character, push]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4 space-y-4">
        <CharacterCardSkeleton />
      </div>
    );
  }
  if (!character) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="p-6 text-center">Character not found.</div>
      </div>
    );
  }

  // push(character)
  // return <div>dsadsa</div>
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={character.image}
          alt={character.name}
          className="w-48 h-48 rounded object-cover"
        />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{character.name}</h1>
          <div className="text-gray-700">Status: {character.status}</div>
          <div className="text-gray-700">Species: {character.species}</div>
          <div className="text-gray-700">Gender: {character.gender}</div>
          <div className="text-gray-700">Origin: {character.origin?.name}</div>
          <div className="text-gray-700">
            Last known location: {character.location?.name}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">First 5 episodes</h2>
        {!episodes ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i: number) => (
              <Skeleton key={i} className="h-4 w-1/2" />
            ))}
          </div>
        ) : (
          <ul className="list-disc pl-5">
            {episodes.map((e: Episode) => (
              <li key={e.id}>{e.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

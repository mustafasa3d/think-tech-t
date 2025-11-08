import { useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Episode } from "../types";
import { CharacterCardSkeleton, Skeleton } from "../components/Skeleton";
import { useRecentCharacters } from "../components/CharactersPage/hooks/useRecentCharacters";
import { useCharacter } from "../components/CharacterDetailsPage/hooks/useCharacter";
import { useEpisodes } from "../components/CharacterDetailsPage/hooks/useEpisodes";
import CharacterDetailsCard from "../components/CharacterDetailsPage/CharacterDetailsCard";

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

  return (
    <div className="max-w-6xl mx-auto p-4">
      <CharacterDetailsCard character={character} />

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

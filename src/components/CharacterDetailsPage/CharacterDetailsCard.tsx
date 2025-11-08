import type { Character } from "../../types";

function CharacterDetailsCard({ character }: { character: Character }) {
  return (
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
  );
}

export default CharacterDetailsCard;

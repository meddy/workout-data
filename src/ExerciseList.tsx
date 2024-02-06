import { useState } from "react";
import getExerciseMap from "./getExerciseMap";

export interface ExerciseListProps {
  exercises: ReturnType<typeof getExerciseMap>;
  onSelect: (exercise: string) => void;
}

export default function ExerciseList(props: ExerciseListProps) {
  const { exercises, onSelect } = props;

  const [filter, setFilter] = useState<string>("");

  return (
    <div>
      <input
        type="text"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        placeholder="Type to filter items"
        className="p-2 mb-4 border rounded-md w-full"
      />
      <ul className="flex flex-col space-y-4">
        {Object.entries(exercises)
          .sort()
          .filter(([exercise]) =>
            exercise.toLocaleLowerCase().includes(filter.trim().toLowerCase())
          )
          .map(([exercise, history]) => (
            <li key={exercise}>
              <button
                className="text-blue-500 hover:underline focus:outline-none"
                onClick={() => onSelect(exercise)}
              >
                {exercise} ({history.length})
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}

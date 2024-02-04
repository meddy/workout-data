import getExerciseMap from "./getExerciseMap";

export interface ExerciseListProps {
  exercises: ReturnType<typeof getExerciseMap>;
  onSelect: (exercise: string) => void;
}

export default function ExerciseList(props: ExerciseListProps) {
  const { exercises, onSelect } = props;

  return (
    <>
      <ul className="flex flex-col space-y-4">
        {Object.entries(exercises)
          .sort()
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
    </>
  );
}

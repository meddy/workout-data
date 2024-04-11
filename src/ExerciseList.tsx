import { useEffect, useState } from "react";
import getExerciseMap from "./getExerciseMap";

export interface ExerciseListProps {
  exercises: ReturnType<typeof getExerciseMap>;
  onSelect: (exercise: string) => void;
}

function parseDate(date: string) {
  const [month, day, year] = date.split("/");
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

type SortType = "a-z" | "#" | "date";
type SortDirection = "asc" | "desc";

export default function ExerciseList(props: ExerciseListProps) {
  const { exercises, onSelect } = props;

  const [filter, setFilter] = useState<string>("");
  const [sortType, setSortType] = useState<SortType | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(
    null
  );

  useEffect(() => {
    const savedSortType = localStorage.getItem("sortType");
    const savedSortDirection = localStorage.getItem("sortDirection");
    console.log("restored", savedSortType, savedSortDirection);

    if (["a-z", "#", "date"].includes(savedSortType ?? "a-z")) {
      setSortType(savedSortType as SortType);
    }

    if (["asc", "desc"].includes(savedSortDirection ?? "asc")) {
      setSortDirection(savedSortDirection as SortDirection);
    }
  }, []);

  const onSort = (newSortType: SortType) => () => {
    if (sortType === newSortType) {
      const newSortDirection = sortDirection === "asc" ? "desc" : "asc";
      setSortDirection(newSortDirection);
      localStorage.setItem("sortDirection", newSortDirection);
    }

    setSortType(newSortType);
    localStorage.setItem("sortType", newSortType);
  };

  if (!sortType || !sortDirection) {
    return null;
  }

  return (
    <div>
      <input
        type="text"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        placeholder="Type to filter items"
        className="p-2 mb-4 border rounded-md w-full"
      />
      <div className="flex space-x-2 mb-4">
        <button
          onClick={onSort("a-z")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          a-z
        </button>
        <button
          onClick={onSort("#")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          #
        </button>
        <button
          onClick={onSort("date")}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          date
        </button>
      </div>
      <ul className="flex flex-col space-y-4">
        {Object.entries(exercises)
          .filter(([exercise]) =>
            exercise.toLocaleLowerCase().includes(filter.trim().toLowerCase())
          )
          .sort((a, b) => {
            if (sortType === "a-z") {
              return sortDirection === "asc"
                ? a[0].localeCompare(b[0])
                : b[0].localeCompare(a[0]);
            }

            if (sortType === "#") {
              return sortDirection === "asc"
                ? a[1].length - b[1].length
                : b[1].length - a[1].length;
            }

            const aDate = parseDate(a[1][0].date);
            const bDate = parseDate(b[1][0].date);
            return sortDirection === "asc"
              ? aDate.getTime() - bDate.getTime()
              : bDate.getTime() - aDate.getTime();
          })
          .map(([exercise, history]) => (
            <li key={exercise} className="flex justify-between">
              <button
                className="text-blue-500 hover:underline focus:outline-none"
                onClick={() => onSelect(exercise)}
              >
                {exercise} ({history.length})
              </button>
              <div>{history[0].date}</div>
            </li>
          ))}
      </ul>
    </div>
  );
}

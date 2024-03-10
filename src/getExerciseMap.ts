import { ExerciseHistoryProps } from "./ExerciseHistory";

const dateRegex = /(?<date>\d\d?\/\d\d?\/\d\d\d\d)\s*-?\s*(?<workout>.*)/;
const exerciseRegex = /(?<exercise>[\s\w]+)\s*-\s*(?<reps>.*)+/;

export default function getExerciseMap(content: string) {
  const exerciseMap: Record<string, ExerciseHistoryProps["history"]> = {};

  const lines = content.split("\n").map((line) => line.replace("\r", ""));
  const errors: string[] = [];
  let currentDate: string | null = null;
  let currentWorkout: string | null = null;

  lines.forEach((line, index) => {
    const dateMatch = line.match(dateRegex);
    if (dateMatch && dateMatch[1]) {
      currentDate = dateMatch[1];
      currentWorkout = dateMatch[2];
      return;
    }

    if (!currentDate) {
      return;
    }

    if (/\s+SS\s+/.test(line)) {
      const superSets = line.split(" SS ");
      superSets.forEach((superSet) => {
        const match = superSet.match(exerciseRegex);
        if (match) {
          if (!exerciseMap[match[1]]) {
            exerciseMap[match[1]] = [];
          }

          exerciseMap[match[1]].push({
            date: currentDate as string,
            workout: currentWorkout,
            reps: match[2].trim(),
          });
        }
      });
      return;
    }

    const exerciseMatch = line.match(exerciseRegex);
    if (exerciseMatch) {
      if (!currentDate) {
        errors.push(`Orphaned exercise ${index}: ${exerciseMatch}`);
        return;
      }

      if (!exerciseMap[exerciseMatch[1]]) {
        exerciseMap[exerciseMatch[1]] = [];
      }

      exerciseMap[exerciseMatch[1]].push({
        date: currentDate,
        workout: currentWorkout,
        reps: exerciseMatch[2].trim(),
      });

      return;
    }

    currentDate = null;
    currentWorkout = null;

    if (line.trim() === "") {
      return;
    }

    errors.push(`Malformed line ${index}: ${line}`);
  });

  console.warn(errors);

  return exerciseMap;
}

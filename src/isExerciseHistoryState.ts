export default function isExerciseHistoryState(
  state: unknown
): state is { exercise: string } {
  return (
    typeof state === "object" &&
    state !== null &&
    typeof (state as Record<string, unknown>).exercise === "string"
  );
}

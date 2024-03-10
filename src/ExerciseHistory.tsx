export interface ExerciseHistoryProps {
  exercise: string;
  history: Array<{ date: string; workout: string | null; reps: string }>;
}

export default function ExerciseHistory(props: ExerciseHistoryProps) {
  const { exercise, history } = props;
  return (
    <>
      <h2 className="font-semibold mb-4">{exercise}</h2>
      <ul className="flex flex-col space-y-4">
        {history.map((item) => (
          <li key={item.date}>
            {item.workout
              ? `${item.date} - ${item.workout} - ${item.reps}`
              : `${item.date} - ${item.reps}`}
          </li>
        ))}
      </ul>
    </>
  );
}

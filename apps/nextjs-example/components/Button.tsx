export default function Button(props: {
  color: string | undefined;
  onClick: () => void;
  disabled: boolean;
  message: string;
}) {
  const { color, onClick, disabled, message } = props;
  return (
    <button
      className={`bg-${color}-500 text-white font-bold py-2 px-4 rounded mr-4 ${
        disabled ? "opacity-50 cursor-not-allowed" : `hover:bg-${color}-700`
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {message}
    </button>
  );
}

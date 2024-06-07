export default function Col(props: {
  title?: boolean;
  border?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <td
      className={`px-8 py-4 ${props.border ? "border-t" : ""} w-${
        props.title ? "1/4" : "3/4"
      }`}
    >
      {props.children}
    </td>
  );
}

import { SVGProps, forwardRef } from "react";

export const Web3Graphic = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => {
    return (
      <svg
        ref={ref}
        width="142"
        height="108"
        viewBox="0 0 142 108"
        fill="none"
        {...props}
      >
        <g stroke="currentColor" strokeLinejoin="round">
          <path d="m91.26 35.8.06-10.46L71.3 1v10.53L87 30.5m-36.11 5.24-.06-10.45L71.3 1v10.53L55 30.5" />
          <path d="M71 59.55V49.17L50.83 25.3l.06 10.45L57 42.5m14 17.05V49.18l20.33-23.84-.07 10.45L86 42M1 59.68l.22-9.07 35.33-19.8-.1 9L9 55" />
          <path d="M36.55 30.8s-.08 5.92-.1 9l.1-9ZM71 59.51v-9.07L36.55 30.8l-.1 9L63.5 55" />
          <path d="M71 59.51v-9.07L36.44 70.78l-.1 9.14L55.5 68.5" />
          <path d="M1.22 50.6a77387.2 77387.2 0 0 0 35.22 20.18l-.1 9.14L1 59.68l.23-9.07h-.01ZM141 59.68l-.23-9.07-35.33-19.8.11 9L133 55" />
          <path d="m105.44 30.8.11 9-.1-9Z" />
          <path d="M71 59.51v-9.07l34.44-19.64.11 9L78.5 55" />
          <path d="M71 59.51v-9.07l34.56 20.34.1 9.14L87 69" />
          <path d="M140.78 50.6a78487.3 78487.3 0 0 1-35.23 20.18l.11 9.14L141 59.68l-.23-9.07ZM50.83 80.15l.06-6.33 20.1-23.38H71v9.26L55 79" />
          <path d="M71.3 97.6 50.89 73.81l-.06 9.33L71.3 107v-9.4Zm20.03-14.5-.07-9.33L71 50.44v9.26l16 18.8" />
          <path d="m71.3 97.6 19.96-23.83.06 9.33L71.3 107v-9.4Z" />
        </g>
      </svg>
    );
  }
);
Web3Graphic.displayName = "Web3Graphic";

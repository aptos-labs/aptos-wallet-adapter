import { SVGProps, forwardRef } from "react";

export const SolanaIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
      >
        <g clip-path="url(#a)">
          <path
            fill="url(#b)"
            fill-rule="evenodd"
            d="M17.368 64.052A3.214 3.214 0 0 1 19.744 63l73.312.06a1.612 1.612 0 0 1 1.188 2.698l-15.612 17.19A3.213 3.213 0 0 1 76.254 84l-73.31-.06a1.611 1.611 0 0 1-1.188-2.698l15.612-17.19Zm76.876-14.31a1.611 1.611 0 0 1-1.188 2.698l-73.31.06a3.213 3.213 0 0 1-2.378-1.052l-15.612-17.2a1.612 1.612 0 0 1 1.188-2.698l73.312-.06a3.213 3.213 0 0 1 2.376 1.052l15.612 17.2ZM17.368 1.052A3.215 3.215 0 0 1 19.744 0l73.312.06a1.612 1.612 0 0 1 1.188 2.698l-15.612 17.19A3.213 3.213 0 0 1 76.254 21l-73.31-.06a1.611 1.611 0 0 1-1.188-2.698l15.612-17.19Z"
            clip-rule="evenodd"
          />
        </g>
        <defs>
          <linearGradient
            id="b"
            x1="4.168"
            x2="91.832"
            y1="85.832"
            y2="-1.832"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#9945FF" />
            <stop offset=".2" stop-color="#7962E7" />
            <stop offset="1" stop-color="#00D18C" />
          </linearGradient>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h96v84H0z" />
          </clipPath>
        </defs>
      </svg>
    );
  }
);
SolanaIcon.displayName = "SolanaIcon";

import { SVGProps, forwardRef } from "react";

export const EthereumIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        xmlSpace="preserve"
      >
        <path fill="#8A92B2" d="M959.8 80.7 420.1 976.3 959.8 731z" />
        <path
          fill="#62688F"
          d="M959.8 731 420.1 976.3l539.7 319.1zm539.8 245.3L959.8 80.7V731z"
        />
        <path fill="#454A75" d="m959.8 1295.4 539.8-319.1L959.8 731z" />
        <path fill="#8A92B2" d="m420.1 1078.7 539.7 760.6v-441.7z" />
        <path fill="#62688F" d="M959.8 1397.6v441.7l540.1-760.6z" />
      </svg>
    );
  }
);
EthereumIcon.displayName = "EthereumIcon";

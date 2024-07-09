import { SVGProps, forwardRef } from "react";

export const WalletGraphic = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => {
    return (
      <svg
        ref={ref}
        width="128"
        height="102"
        viewBox="0 0 128 102"
        fill="none"
        {...props}
      >
        <path
          fill="currentColor"
          d="m.96 25.93-.36-.35.36.85v-.5Zm7.79-7.81v-.5h-.21l-.15.15.36.35ZM1.3 26.28l7.79-7.8-.7-.71-7.8 7.8.7.71Zm7.44-7.66H10v-1H8.75v1Zm29.22 6.8h-37v1h37.01v-1Z"
        />
        <path
          stroke="currentColor"
          strokeMiterlimit="10"
          d="M82.25 26.08c0 12.25-9.92 22.2-22.14 22.2a22.17 22.17 0 0 1-22.14-22.2H1.1v74.82h118.02V26.08H82.25Zm44.33 67.02h.33V18.27h-5.7"
        />
        <path
          stroke="currentColor"
          strokeMiterlimit="10"
          d="M74.52 42.92a22.4 22.4 0 0 1-11.43 3.3 22.5 22.5 0 0 1-22.46-22.53H9.52M119.22 101l7.78-7.82m-7.88-67.1 7.79-7.81m-44.78 7.72 2.73-2.3m-46.89 2.39 2.39-2.4"
        />
        <path
          stroke="currentColor"
          strokeMiterlimit="10"
          d="M9.86 23.69V5.72h107.97v18.04H84.65"
        />
        <path
          stroke="currentColor"
          strokeMiterlimit="10"
          d="M117.83 20.46h3.39V1H13.25v4.72M9.36 23.69h31.78"
        />
      </svg>
    );
  }
);
WalletGraphic.displayName = "WalletGraphic";

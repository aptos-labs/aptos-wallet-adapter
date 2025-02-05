import { SVGProps, forwardRef } from "react";

export const EthereumIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        height="182"
        width="182"
        viewBox="0 0 182 182"
        style={{ maxHeight: "100%", maxWidth: "100%" }}
      >
        <g>
          <g id="Layer_1" focusable="false">
            <g>
              <path
                d="M90.9,181v-45.2l-55.9-32.7,55.9,77.8Z"
                fill="#f0cdc2"
                stroke="#1616b4"
                strokeLinejoin="round"
              />
              <path
                d="M91.1,181v-45.2l55.9-32.7-55.9,77.8Z"
                fill="#c9b3f5"
                stroke="#1616b4"
                strokeLinejoin="round"
              />
              <path
                d="M90.9,124.6v-57.6l-56.5,25.3,56.5,32.3Z"
                fill="#88aaf1"
                stroke="#1616b4"
                strokeLinejoin="round"
              />
              <path
                d="M91.1,124.6v-57.6l56.5,25.3-56.5,32.3Z"
                fill="#c9b3f5"
                stroke="#1616b4"
                strokeLinejoin="round"
              />
              <path
                d="M34.4,92.3L90.9,1v66l-56.5,25.3Z"
                fill="#f0cdc2"
                stroke="#1616b4"
                strokeLinejoin="round"
              />
              <path
                d="M147.6,92.3L91.1,1v66l56.5,25.3Z"
                fill="#b8faf6"
                stroke="#1616b4"
                strokeLinejoin="round"
              />
            </g>
          </g>
        </g>
      </svg>
    );
  }
);
EthereumIcon.displayName = "EthereumIcon";

import { SVGProps, forwardRef } from "react";

export const SmallAptosLogo = forwardRef<
  SVGSVGElement,
  SVGProps<SVGSVGElement>
>((props, ref) => {
  return (
    <svg
      ref={ref}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12ZM7.17547 3.67976C7.13401 3.72309 7.07649 3.74757 7.01648 3.74757H3.00775C3.69185 2.83824 4.77995 2.25 6.00569 2.25C7.23142 2.25 8.31953 2.83824 9.00362 3.74757H8.28524C8.20824 3.74757 8.13498 3.71468 8.08401 3.65701L7.81608 3.35416C7.77618 3.30896 7.71882 3.28308 7.6585 3.28308H7.6454C7.58805 3.28308 7.53318 3.30646 7.49343 3.34792L7.17547 3.67976ZM8.05656 4.75897H7.39569C7.31869 4.75897 7.24543 4.72593 7.19447 4.66842L6.92638 4.36557C6.88647 4.32036 6.82896 4.29465 6.7688 4.29465C6.70863 4.29465 6.65112 4.32052 6.61121 4.36557L6.38131 4.6254C6.30603 4.71034 6.19801 4.75913 6.08454 4.75913H2.46703C2.36401 5.05278 2.29683 5.36296 2.27002 5.68467H5.68505C5.74506 5.68467 5.80258 5.66019 5.84404 5.61686L6.16201 5.28502C6.20175 5.24356 6.25662 5.22018 6.31398 5.22018H6.32707C6.38739 5.22018 6.44475 5.24606 6.48465 5.29126L6.75258 5.59411C6.80355 5.65178 6.87681 5.68467 6.95381 5.68467H9.74133C9.71452 5.3628 9.64734 5.05263 9.54431 4.75913H8.05641L8.05656 4.75897ZM4.33651 7.63095C4.39652 7.63095 4.45404 7.60648 4.4955 7.56315L4.81347 7.23131C4.85321 7.18985 4.90808 7.16647 4.96544 7.16647H4.97853C5.03885 7.16647 5.09621 7.19234 5.13611 7.23739L5.40404 7.54024C5.45501 7.59791 5.52827 7.6308 5.60527 7.6308H9.38285C9.52438 7.33839 9.62803 7.02463 9.68975 6.69591H6.06383C5.98683 6.69591 5.91357 6.66287 5.8626 6.60535L5.59467 6.3025C5.55477 6.2573 5.49725 6.23158 5.43709 6.23158C5.37692 6.23158 5.31941 6.25746 5.27951 6.3025L5.0496 6.56233C4.97432 6.64728 4.86631 6.69606 4.75268 6.69606H2.32147C2.3832 7.02479 2.487 7.33855 2.62837 7.63095H4.33651ZM5.57359 8.55745H4.59116C4.51417 8.55745 4.44091 8.52441 4.38994 8.46689L4.12201 8.16404C4.0821 8.11884 4.02459 8.09312 3.96442 8.09312C3.90426 8.09312 3.84675 8.119 3.80684 8.16404L3.57694 8.42387C3.50166 8.50882 3.39364 8.55761 3.28001 8.55761H3.26474C3.94915 9.29096 4.92378 9.74998 6.00596 9.74998C7.08815 9.74998 8.06262 9.29096 8.74719 8.55761H5.57359V8.55745Z"
        fill="currentColor"
      />
    </svg>
  );
});
SmallAptosLogo.displayName = "SmallAptosLogo";

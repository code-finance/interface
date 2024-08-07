import { SvgIcon, SvgIconProps } from '@mui/material';

export const WalletIcon = ({ sx, ...rest }: SvgIconProps) => {
  return (
    <SvgIcon
      sx={{ fill: 'none', stroke: '#A5A8B6', ...sx }}
      viewBox="0 0 60 60"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Wallet"
      {...rest}
    >
      <rect
        x="17.6924"
        y="25.5266"
        width="40.6331"
        height="32.5065"
        rx="6"
        fill="black"
        fill-opacity="0.15"
      />
      <path
        d="M10 29.7189V14.7803"
        stroke="white"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M49.438 38.6821V44.6575C49.438 47.2867 47.2868 49.4379 44.6576 49.4379H14.7804C12.1512 49.4379 10 47.2867 10 44.6575V35.6943"
        stroke="white"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M17.8877 18.3657H44.6577C47.2869 18.3657 49.4381 20.5169 49.4381 23.1461V29.1215"
        stroke="white"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M42.9845 12.7487C42.2674 11.1951 40.5943 10 38.6822 10H14.1828C11.9121 10 10 11.9121 10 14.1828C10 16.4535 11.9121 18.3656 14.1828 18.3656H17.7681"
        stroke="white"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M49.4379 38.6823H45.8526C43.2234 38.6823 41.0723 36.5311 41.0723 33.9019C41.0723 31.2727 43.2234 29.1216 45.8526 29.1216H49.4379C50.7525 29.1216 51.8281 30.1972 51.8281 31.5118V36.2921C51.8281 37.6067 50.7525 38.6823 49.4379 38.6823Z"
        stroke="white"
        stroke-width="3"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </SvgIcon>
  );
};

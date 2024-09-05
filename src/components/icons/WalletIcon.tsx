import { SvgIcon, SvgIconProps } from '@mui/material';

export const WalletIcon = ({ sx, ...rest }: SvgIconProps) => {
  return (
    <SvgIcon
      sx={{ fill: 'none', ...sx }}
      viewBox="0 0 60 60"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Wallet"
      {...rest}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
      >
        <rect
          x="17.6924"
          y="25"
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
          d="M17.8877 18.3652H44.6577C47.2869 18.3652 49.4381 20.5164 49.4381 23.1456V29.121"
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
          d="M49.4379 38.6818H45.8526C43.2234 38.6818 41.0723 36.5307 41.0723 33.9015C41.0723 31.2723 43.2234 29.1211 45.8526 29.1211H49.4379C50.7525 29.1211 51.8281 30.1967 51.8281 31.5113V36.2916C51.8281 37.6062 50.7525 38.6818 49.4379 38.6818Z"
          stroke="white"
          stroke-width="3"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </SvgIcon>
  );
};

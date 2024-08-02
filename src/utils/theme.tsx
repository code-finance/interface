import {
  CheckCircleIcon,
  ChevronDownIcon,
  ExclamationCircleIcon,
  ExclamationIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline';
import { SvgIcon, Theme, ThemeOptions } from '@mui/material';
import { createTheme } from '@mui/material/styles';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ColorPartial } from '@mui/material/styles/createPalette';
import React from 'react';

import colors from './colors';
import { withOpacity } from './utils';

const theme = createTheme();
const {
  typography: { pxToRem },
} = theme;

const FONT = 'Inter, Arial';
const FONT_HEADING = 'Poppins';

declare module '@mui/material/styles/createPalette' {
  interface PaletteColor extends ColorPartial {}

  interface TypeText {
    primary: string;
    secondary: string;
    disabledText: string;
    disabledBg: string;
    mainTitle: string;
    subTitle: string;
    subText: string;
    buttonText: string;
    // to be removed
    muted: string;
  }

  interface TypeBackground {
    primary: string;
    secondary: string;
    tertiary: string;
    modulePopup: string;
    point: string;
    contents: string;
    dim: string;
    group: string;
    top: string;
    chip: string;
    // to be removed
    default: string;
    paper: string;
    surface: string;
    surface2: string;
    header: string;
    disabled: string;
  }

  interface Palette {
    positive: {
      main: string;
    };
    negative: {
      main: string;
    };
    gradients: {
      aaveGradient: string;
      newGradient: string;
    };
    other: {
      standardInputLine: string;
    };
    border: {
      activeState: string;
      contentOutline: string;
      pointDivider: string;
      bgDivider: string;
    };
  }

  interface PaletteOptions {
    gradients: {
      aaveGradient: string;
      newGradient: string;
    };
  }
}

interface TypographyCustomVariants {
  h1: React.CSSProperties;
  h2: React.CSSProperties;
  h3: React.CSSProperties;
  h4: React.CSSProperties;
  h5: React.CSSProperties;
  h6: React.CSSProperties;
  body1: React.CSSProperties;
  body2: React.CSSProperties;
  body3: React.CSSProperties;
  body4: React.CSSProperties;
  body5: React.CSSProperties;
  body6: React.CSSProperties;
  body7: React.CSSProperties;
  body8: React.CSSProperties;
  body9: React.CSSProperties;
  detail1: React.CSSProperties;
  detail2: React.CSSProperties;
  detail3: React.CSSProperties;
  detail4: React.CSSProperties;
  detail5: React.CSSProperties;
}

declare module '@mui/material/styles' {
  interface TypographyVariants extends TypographyCustomVariants {}

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions extends TypographyCustomVariants {}

  interface BreakpointOverrides {}

  interface TypeText {
    primary: string;
    secondary: string;
    disabledText: string;
    disabledBg: string;
    mainTitle: string;
    subTitle: string;
    subText: string;
    buttonText: string;
  }

  interface TypeBackground {
    primary: string;
    secondary: string;
    tertiary: string;
    modulePopup: string;
    point: string;
    contents: string;
    dim: string;
    group: string;
    top: string;
    chip: string;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    h1: true;
    h2: true;
    h3: true;
    h4: true;
    h5: true;
    h6: true;
    body1: true;
    body2: true;
    body3: true;
    body4: true;
    body5: true;
    body6: true;
    body7: true;
    body8: true;
    body9: true;
    detail1: true;
    detail2: true;
    detail3: true;
    detail4: true;
    detail5: true;

    // to be removed
    display1: true;
    subheader1: true;
    subheader2: true;
    description: true;
    buttonL: true;
    buttonM: true;
    buttonS: true;
    helperText: true;
    tooltip: true;
    main21: true;
    secondary21: true;
    main16: true;
    secondary16: true;
    main14: true;
    secondary14: true;
    main12: true;
    secondary12: true;
    subtitle1: false;
    subtitle2: false;
    button: false;
    overline: false;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    surface: true;
    gradient: true;
  }
}

export const getDesignTokens = (mode: 'light' | 'dark') => {
  const getColor = (lightColor: string, darkColor: string) =>
    mode === 'dark' ? darkColor : lightColor;

  return {
    breakpoints: {
      keys: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
      values: { xs: 0, sm: 600, md: 900, lg: 1280, xl: 1536, xxl: 1800 },
    },
    palette: {
      mode,
      primary: {
        main: getColor(colors.marine[500], colors.marine[300]),
        // light: getColor('#62677B', '#F1F1F3'),
        // dark: getColor('#292E41', '#D2D4DC'),
        // contrast: getColor('#FFFFFF', '#0F121D'),
      },
      secondary: {
        main: getColor(colors.violet[500], colors.violet[300]),
        // light: getColor('#FF607B', '#F6A5C0'),
        // dark: getColor('#B34356', '#AA647B'),
      },
      positive: {
        main: getColor(colors.green[500], colors.green[300]),
      },
      negative: {
        main: getColor(colors.red[400], colors.red[300]),
      },
      error: {
        main: getColor('#FF2D2D', '#F44336'),
        // light: getColor('#D26666', '#E57373'),
        // dark: getColor('#BC0000', '#D32F2F'),
        // '100': getColor('#4F1919', '#FBB4AF'), // for alert text
        // '200': getColor('#F9EBEB', '#2E0C0A'), // for alert background
      },
      warning: {
        main: getColor('#F89F1A', '#FFA726'),
        // light: getColor('#FFCE00', '#FFB74D'),
        // dark: getColor('#C67F15', '#F57C00'),
        // '100': getColor('#63400A', '#FFDCA8'), // for alert text
        // '200': getColor('#FEF5E8', '#301E04'), // for alert background
      },
      info: {
        main: getColor('#0062D2', '#29B6F6'),
        // light: getColor('#0062D2', '#4FC3F7'),
        // dark: getColor('#002754', '#0288D1'),
        // '100': getColor('#002754', '#A9E2FB'), // for alert text
        // '200': getColor('#E5EFFB', '#071F2E'), // for alert background
      },
      success: {
        main: getColor('#1FC74E', '#38E067'),
        // light: getColor('#90FF95', '#90FF95'),
        // dark: getColor('#318435', '#388E3C'),
        // '100': getColor('#1C4B1E', '#C2E4C3'), // for alert text
        // '200': getColor('#ECF8ED', '#0A130B'), // for alert background
      },
      text: {
        primary: getColor(colors.gray[950], colors.gray[50]),
        secondary: getColor(colors.gray[700], colors.gray[200]),
        disabledText: getColor(colors.gray[300], colors.gray[600]),
        disabledBg: getColor(colors.gray[100], colors.gray[800]),
        mainTitle: getColor(colors.gray[600], colors.gray[300]),
        subTitle: getColor(colors.gray[400], colors.gray[500]),
        subText: getColor(colors.gray[200], colors.gray[700]),
        buttonText: getColor(colors.white, colors.white),
        // disabled: getColor('#ABAEBA', '#5C6070'),
        // muted: getColor('#A5A8B6', '#8E92A3'),
        // highlight: getColor('#383D51', '#C9B3F9'),
      },
      background: {
        primary: getColor(colors.white, colors.gray[850]),
        secondary: getColor(colors.gray[50], colors.gray[800]),
        tertiary: getColor(colors.gray[100], colors.gray[900]),
        modulePopup: getColor(colors.white, withOpacity(colors.gray[700], 0.2)),
        point: getColor(colors.marine[50], withOpacity(colors.marine[900], 0.2)),
        contents: getColor(colors.gray[30], withOpacity(colors.marine[700], 0.5)),
        dim: getColor(withOpacity(colors.black, 0.6), withOpacity(colors.black, 0.6)),
        group: getColor(colors.marine[400], colors.marine[300]),
        top: getColor(withOpacity(colors.marine[300], 0.3), '#28216D'),
        chip: getColor(colors.marine[500], colors.marine[400]),
        // default: getColor('#F1F1F3', '#23242A'),
        // secondary: getColor('#F5F5F5', '#2E3038'),
        // tertiary: getColor('#E3E4E8', '#191A1F'),
        // paper: getColor('#FFFFFF', '#292E41'),
        // surface: getColor('#F7F7F9', '#383D51'),
        // surface2: getColor('#F9F9FB', '#383D51'),
        // header: getColor('#2B2D3C', '#1B2030'),
        // disabled: getColor('#EAEBEF', '#EBEBEF14'),
      },
      divider: getColor(colors.gray[100], colors.gray[800]),
      action: {
        active: getColor('#8E92A3', '#EBEBEF8F'),
        hover: getColor('#F1F1F3', '#EBEBEF14'),
        selected: getColor('#EAEBEF', '#EBEBEF29'),
        disabled: getColor('#BBBECA', '#EBEBEF4D'),
        disabledBackground: getColor('#EAEBEF', '#EBEBEF1F'),
        focus: getColor('#F1F1F3', '#EBEBEF1F'),
      },
      other: {
        standardInputLine: getColor('#383D511F', '#EBEBEF6B'),
      },
      gradients: {
        aaveGradient: 'linear-gradient(248.86deg, #B6509E 10.51%, #2EBAC6 93.41%)',
        newGradient: 'linear-gradient(79.67deg, #8C3EBC 0%, #007782 95.82%)',
      },
      border: {
        activeState: getColor(colors.gray[800], colors.gray[100]),
        contentOutline: getColor(colors.gray[200], colors.gray[700]),
        pointDivider: getColor(
          withOpacity(colors.marine[300], 0.5),
          withOpacity(colors.marine[300], 0.5)
        ),
        bgDivider: getColor(colors.gray[50], colors.gray[950]),
      },
    },
    spacing: 4,
    typography: {
      fontFamily: FONT,
      // subtitle1: undefined,
      // subtitle2: undefined,
      // body1: undefined,
      // body2: undefined,
      // button: undefined,
      // overline: undefined,
      // display1: {
      //   fontFamily: FONT,
      //   fontWeight: 700,
      //   letterSpacing: pxToRem(0.25),
      //   lineHeight: '130%',
      //   fontSize: pxToRem(32),
      // },
      h1: {
        fontFamily: FONT_HEADING,
        fontWeight: 700,
        lineHeight: '130%',
        fontSize: pxToRem(36),
      },
      h2: {
        fontFamily: FONT_HEADING,
        fontWeight: 700,
        lineHeight: '130%',
        fontSize: pxToRem(24),
      },
      h3: {
        fontFamily: FONT_HEADING,
        fontWeight: 700,
        lineHeight: '130%',
        fontSize: pxToRem(18),
      },
      h4: {
        fontFamily: FONT_HEADING,
        fontWeight: 400,
        lineHeight: '130%',
        fontSize: pxToRem(18),
      },
      h5: {
        fontFamily: FONT_HEADING,
        fontWeight: 700,
        lineHeight: '150%',
        fontSize: pxToRem(22),
      },
      h6: {
        fontFamily: FONT_HEADING,
        fontWeight: 700,
        lineHeight: '150%',
        fontSize: pxToRem(30),
      },
      body1: {
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: pxToRem(22),
        lineHeight: '130%',
      },
      body2: {
        fontFamily: FONT,
        fontWeight: 500,
        fontSize: pxToRem(18),
        lineHeight: '130%',
      },
      body3: {
        fontFamily: FONT,
        fontWeight: 400,
        fontSize: pxToRem(18),
        lineHeight: '140%',
      },
      body4: {
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: pxToRem(17),
        lineHeight: '130%',
      },
      body5: {
        fontFamily: FONT,
        fontWeight: 500,
        fontSize: pxToRem(17),
        lineHeight: '130%',
      },
      body6: {
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: pxToRem(16),
        lineHeight: '130%',
      },
      body7: {
        fontFamily: FONT,
        fontWeight: 400,
        fontSize: pxToRem(16),
        lineHeight: '130%',
      },
      body8: {
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: pxToRem(20),
        lineHeight: '130%',
      },
      body9: {
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: pxToRem(26),
        lineHeight: '130%',
      },
      detail1: {
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: pxToRem(14),
        lineHeight: '130%',
      },
      detail2: {
        fontFamily: FONT,
        fontWeight: 500,
        fontSize: pxToRem(14),
        lineHeight: '130%',
      },
      detail3: {
        fontFamily: FONT,
        fontWeight: 400,
        fontSize: pxToRem(14),
        lineHeight: '130%',
      },
      detail4: {
        fontFamily: FONT,
        fontWeight: 400,
        fontSize: pxToRem(13),
        lineHeight: '130%',
      },
      detail5: {
        fontFamily: FONT,
        fontWeight: 400,
        fontSize: pxToRem(15),
        lineHeight: '140%',
      },
      // subheader1: {
      //   fontFamily: FONT,
      //   fontWeight: 600,
      //   letterSpacing: pxToRem(0.15),
      //   lineHeight: pxToRem(20),
      //   fontSize: pxToRem(14),
      // },
      // subheader2: {
      //   fontFamily: FONT,
      //   fontWeight: 500,
      //   letterSpacing: pxToRem(0.1),
      //   lineHeight: pxToRem(16),
      //   fontSize: pxToRem(12),
      // },
      // description: {
      //   fontFamily: FONT,
      //   fontWeight: 400,
      //   letterSpacing: pxToRem(0.15),
      //   lineHeight: '143%',
      //   fontSize: pxToRem(14),
      // },
      // caption: {
      //   fontFamily: FONT,
      //   fontWeight: 400,
      //   letterSpacing: pxToRem(0.15),
      //   lineHeight: pxToRem(16),
      //   fontSize: pxToRem(12),
      // },
      // buttonL: {
      //   fontFamily: FONT,
      //   fontWeight: 500,
      //   letterSpacing: pxToRem(0.46),
      //   lineHeight: pxToRem(24),
      //   fontSize: pxToRem(16),
      // },
      // buttonM: {
      //   fontFamily: FONT,
      //   fontWeight: 500,
      //   lineHeight: pxToRem(24),
      //   fontSize: pxToRem(14),
      // },
      // buttonS: {
      //   fontFamily: FONT,
      //   fontWeight: 600,
      //   letterSpacing: pxToRem(0.46),
      //   lineHeight: pxToRem(20),
      //   textTransform: 'uppercase',
      //   fontSize: pxToRem(10),
      // },
      // helperText: {
      //   fontFamily: FONT,
      //   fontWeight: 400,
      //   letterSpacing: pxToRem(0.4),
      //   lineHeight: pxToRem(12),
      //   fontSize: pxToRem(10),
      // },
      // tooltip: {
      //   fontFamily: FONT,
      //   fontWeight: 400,
      //   letterSpacing: pxToRem(0.15),
      //   lineHeight: pxToRem(16),
      //   fontSize: pxToRem(12),
      // },
      // main21: {
      //   fontFamily: FONT,
      //   fontWeight: 800,
      //   lineHeight: '133.4%',
      //   fontSize: pxToRem(21),
      // },
      // secondary21: {
      //   fontFamily: FONT,
      //   fontWeight: 500,
      //   lineHeight: '133.4%',
      //   fontSize: pxToRem(21),
      // },
      // main16: {
      //   fontFamily: FONT,
      //   fontWeight: 600,
      //   letterSpacing: pxToRem(0.15),
      //   lineHeight: pxToRem(24),
      //   fontSize: pxToRem(16),
      // },
      // secondary16: {
      //   fontFamily: FONT,
      //   fontWeight: 500,
      //   letterSpacing: pxToRem(0.15),
      //   lineHeight: pxToRem(24),
      //   fontSize: pxToRem(16),
      // },
      // main14: {
      //   fontFamily: FONT,
      //   fontWeight: 600,
      //   letterSpacing: pxToRem(0.15),
      //   lineHeight: pxToRem(20),
      //   fontSize: pxToRem(14),
      // },
      // secondary14: {
      //   fontFamily: FONT,
      //   fontWeight: 500,
      //   letterSpacing: pxToRem(0.15),
      //   lineHeight: pxToRem(20),
      //   fontSize: pxToRem(14),
      // },
      // main12: {
      //   fontFamily: FONT,
      //   fontWeight: 600,
      //   letterSpacing: pxToRem(0.1),
      //   lineHeight: pxToRem(16),
      //   fontSize: pxToRem(12),
      // },
      // secondary12: {
      //   fontFamily: FONT,
      //   fontWeight: 500,
      //   letterSpacing: pxToRem(0.1),
      //   lineHeight: pxToRem(16),
      //   fontSize: pxToRem(12),
      // },
    },
  } as ThemeOptions;
};

export function getThemedComponents(theme: Theme) {
  return {
    components: {
      MuiSkeleton: {
        styleOverrides: {
          root: {
            transform: 'unset',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '6px',
            borderColor: theme.palette.divider,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#CBCDD8',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#CBCDD8',
            },
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: {
            '& .MuiSlider-thumb': {
              color: theme.palette.mode === 'light' ? '#62677B' : '#C9B3F9',
            },
            '& .MuiSlider-track': {
              color: theme.palette.mode === 'light' ? '#383D51' : '#9C93B3',
            },
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: '6px',
          },
          sizeLarge: {
            padding: '12px 24px',
            fontWeight: 600,
          },
          sizeMedium: {
            padding: '12px 46.5px',
          },
          sizeSmall: {
            padding: '9px 8px',
          },
        },
        variants: [
          {
            props: { color: 'primary', variant: 'outlined' },
            style: {
              background: theme.palette.background.primary,
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
            },
          },
          {
            props: { color: 'primary', variant: 'text' },
            style: {
              border: '1px solid',
              background: theme.palette.background.primary,
              borderColor: theme.palette.border.contentOutline,
              color: theme.palette.text.primary,
            },
          },
        ],
      },
      MuiTypography: {
        defaultProps: {
          variant: 'description',
          variantMapping: {
            display1: 'h1',
            h1: 'h1',
            h2: 'h2',
            h3: 'h3',
            h4: 'h4',
            subheader1: 'p',
            subheader2: 'p',
            caption: 'p',
            description: 'p',
            buttonL: 'p',
            buttonM: 'p',
            buttonS: 'p',
            main12: 'p',
            main14: 'p',
            main16: 'p',
            main21: 'p',
            secondary12: 'p',
            secondary14: 'p',
            secondary16: 'p',
            secondary21: 'p',
            helperText: 'span',
            tooltip: 'span',
          },
        },
      },
      MuiLink: {
        defaultProps: {
          variant: 'description',
        },
      },
      MuiMenu: {
        defaultProps: {
          PaperProps: {
            elevation: 0,
            variant: 'outlined',
            style: {
              minWidth: 240,
              marginTop: '4px',
            },
          },
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            '.MuiMenuItem-root+.MuiDivider-root, .MuiDivider-root': {
              marginTop: '4px',
              marginBottom: '4px',
            },
          },
          padding: {
            paddingTop: '4px',
            paddingBottom: '4px',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            padding: '12px 16px',
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: theme.palette.primary.light,
            minWidth: 'unset !important',
            marginRight: '12px',
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            marginTop: 0,
            marginBottom: 0,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '4px',
          },
        },
        variants: [
          {
            props: { variant: 'outlined' },
            style: {
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.2), 0px 2px 10px rgba(0, 0, 0, 0.1)',
              background:
                theme.palette.mode === 'light'
                  ? theme.palette.background.paper
                  : theme.palette.background.surface,
            },
          },
          {
            props: { variant: 'elevation' },
            style: {
              boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.05), 0px 0px 1px rgba(0, 0, 0, 0.25)',
              ...(theme.palette.mode === 'dark' ? { backgroundImage: 'none' } : {}),
            },
          },
        ],
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            [theme.breakpoints.up('xs')]: {
              paddingLeft: '20px',
              paddingRight: '20px',
            },
            [theme.breakpoints.up('sm')]: {
              paddingLeft: '24px',
              paddingRight: '24px',
            },
            [theme.breakpoints.up('md')]: {
              paddingLeft: '32px',
              paddingRight: '32px',
            },
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            height: 20 + 6 * 2,
            width: 34 + 6 * 2,
            padding: 6,
          },
          switchBase: {
            padding: 8,
            '&.Mui-checked': {
              transform: 'translateX(14px)',
              '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.success.main,
                opacity: 1,
              },
            },
            '&.Mui-disabled': {
              opacity: theme.palette.mode === 'dark' ? 0.3 : 0.7,
            },
          },
          thumb: {
            color: theme.palette.common.white,
            borderRadius: '6px',
            width: '16px',
            height: '16px',
            boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.12)',
          },
          track: {
            opacity: 1,
            backgroundColor: theme.palette.action.active,
            borderRadius: '8px',
          },
        },
      },
      MuiIcon: {
        variants: [
          {
            props: { fontSize: 'large' },
            style: {
              fontSize: pxToRem(32),
            },
          },
        ],
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: theme.palette.divider,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderRadius: '4px',
            padding: '8px 12px',
            ...theme.typography.caption,
            alignItems: 'flex-start',
            '.MuiAlert-message': {
              padding: 0,
              paddingTop: '2px',
              paddingBottom: '2px',
            },
            '.MuiAlert-icon': {
              padding: 0,
              opacity: 1,
              '.MuiSvgIcon-root': {
                fontSize: pxToRem(20),
              },
            },
            a: {
              ...theme.typography.caption,
              fontWeight: 500,
              textDecoration: 'underline',
              '&:hover': {
                textDecoration: 'none',
              },
            },
            '.MuiButton-text': {
              ...theme.typography.caption,
              fontWeight: 500,
              textDecoration: 'underline',
              padding: 0,
              margin: 0,
              minWidth: 'unset',
              '&:hover': {
                textDecoration: 'none',
                background: 'transparent',
              },
            },
          },
        },
        defaultProps: {
          iconMapping: {
            error: (
              <SvgIcon color="error">
                <ExclamationIcon />
              </SvgIcon>
            ),
            info: (
              <SvgIcon color="info">
                <InformationCircleIcon />
              </SvgIcon>
            ),
            success: (
              <SvgIcon color="success">
                <CheckCircleIcon />
              </SvgIcon>
            ),
            warning: (
              <SvgIcon color="warning">
                <ExclamationCircleIcon />
              </SvgIcon>
            ),
          },
        },
        variants: [
          {
            props: { severity: 'error' },
            style: {
              color: theme.palette.error['100'],
              background: theme.palette.error['200'],
              a: {
                color: theme.palette.error['100'],
              },
              '.MuiButton-text': {
                color: theme.palette.error['100'],
              },
            },
          },
          {
            props: { severity: 'info' },
            style: {
              color: theme.palette.info['100'],
              background: theme.palette.info['200'],
              a: {
                color: theme.palette.info['100'],
              },
              '.MuiButton-text': {
                color: theme.palette.info['100'],
              },
            },
          },
          {
            props: { severity: 'success' },
            style: {
              color: theme.palette.success['100'],
              background: theme.palette.success['200'],
              a: {
                color: theme.palette.success['100'],
              },
              '.MuiButton-text': {
                color: theme.palette.success['100'],
              },
            },
          },
          {
            props: { severity: 'warning' },
            style: {
              color: theme.palette.warning['100'],
              background: theme.palette.warning['200'],
              a: {
                color: theme.palette.warning['100'],
              },
              '.MuiButton-text': {
                color: theme.palette.warning['100'],
              },
            },
          },
        ],
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: FONT,
            fontWeight: 400,
            fontSize: pxToRem(14),
            minWidth: '375px',
            backgroundColor: theme.palette.mode === 'light' ? colors.gray[50] : colors.gray[800],
            '> div:first-of-type': {
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          colorPrimary: {
            color: theme.palette.primary.light,
          },
        },
      },
      MuiSelect: {
        defaultProps: {
          IconComponent: (props) => (
            <SvgIcon sx={{ fontSize: '16px' }} {...props}>
              <ChevronDownIcon />
            </SvgIcon>
          ),
        },
        styleOverrides: {
          outlined: {
            backgroundColor: theme.palette.background.surface,
            padding: '6px 12px',
            color: theme.palette.primary.light,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          bar1Indeterminate: {
            background: theme.palette.gradients.aaveGradient,
          },
          bar2Indeterminate: {
            background: theme.palette.gradients.aaveGradient,
          },
        },
      },
    },
  } as ThemeOptions;
}

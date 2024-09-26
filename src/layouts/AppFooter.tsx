import { Trans } from '@lingui/macro';
import {
  Box,
  Container,
  styled,
  SvgIcon,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link } from 'src/components/primitives/Link';
import { useRootStore } from 'src/store/root';

import DiscordIcon from '/public/icons/discord.svg';
import GithubIcon from '/public/icons/github.svg';
import TwitterIcon from '/public/icons/twitter.svg';
import XIcon from '/public/icons/x.svg';

interface StyledLinkProps {
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const StyledLink = styled(Link)<StyledLinkProps>(({ theme }) => ({
  color: theme.palette.text.mainTitle,
  '&:hover': {
    color: theme.palette.primary.main,
  },
  display: 'flex',
  alignItems: 'center',
  transition: '0.3s',
}));

const FOOTER_ICONS = [
  {
    href: 'https://hey.xyz/u/aave',
    icon: <TwitterIcon />,
    title: 'Twitter',
  },
  {
    href: 'https://twitter.com/aave',
    icon: <XIcon />,
    title: 'X',
  },
  {
    href: 'https://github.com/aave',
    icon: <GithubIcon />,
    title: 'Github',
  },
  {
    href: 'https://discord.com/invite/aave',
    icon: <DiscordIcon />,
    title: 'Discord',
  },
];

export function AppFooter() {
  const [_, setFeedbackOpen] = useRootStore((store) => [
    store.setAnalyticsConfigOpen,
    store.setFeedbackOpen,
  ]);
  const { breakpoints } = useTheme();
  const md = useMediaQuery(breakpoints.down('md'));
  const mdUp = useMediaQuery(breakpoints.up('md'));

  const FOOTER_LINKS = [
    {
      href: 'https://aave.com/term-of-use/',
      label: <Trans>Bug Bounty</Trans>,
      key: 'Terms',
    },
    {
      href: 'https://aave.com/privacy-policy/',
      label: <Trans>Forum</Trans>,
      key: 'Privacy',
    },
    {
      href: 'https://docs.aave.com/hub/',
      label: <Trans>Privacy Policy</Trans>,
      key: 'Docs',
    },
    {
      href: 'https://docs.aave.com/faq/',
      label: <Trans>Term of Conditions</Trans>,
      key: 'FAQS',
    },
    {
      href: 'https://discord.com/invite/aave',
      label: <Trans>Contact Us</Trans>,
      key: 'Send feedback',
      onClick: (event: React.MouseEvent) => {
        event.preventDefault();
        setFeedbackOpen(true);
      },
    },
    // {
    //   href: '/',
    //   label: <Trans>Manage analytics</Trans>,
    //   key: 'Manage analytics',
    //   onClick: (event: React.MouseEvent) => {
    //     event.preventDefault();
    //     setAnalyticsConfigOpen(true);
    //   },
    // },
  ];

  return (
    <Box sx={(theme) => ({ borderTop: `1px solid ${theme.palette.border.contents}` })}>
      <Container
        sx={{
          flex: 0,
          display: 'flex',
          width: '100%',
          paddingBlock: { xs: '28px 60px', md: '20px 60px' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 7,
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            columnGap: { xs: 7, md: 6 },
            alignItems: 'center',
            flexWrap: 'wrap',
            paddingInline: { xs: 3, md: 0 },
          }}
        >
          {FOOTER_LINKS.map((link) => (
            <StyledLink
              onClick={link.onClick}
              key={link.key}
              href={link.href}
              sx={{
                py: {
                  xs: '10px',
                  md: 3,
                },
                '&:hover': {
                  opacity: 0.8,
                },
                userSelect: 'none',
              }}
            >
              <Typography variant={mdUp ? 'h4' : 'detail2'} color="text.mainTitle">
                {link.label}
              </Typography>
            </StyledLink>
          ))}
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 5, md: 3 },
            alignItems: 'center',
            paddingInline: { xs: 3, md: 0 },
          }}
        >
          {FOOTER_ICONS.map((icon) => (
            <StyledLink href={icon.href} key={icon.title} sx={{ p: { md: '5px' } }}>
              <SvgIcon
                sx={{
                  fontSize: { xs: 40, md: 36 },
                }}
              >
                {icon.icon}
              </SvgIcon>
            </StyledLink>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

import { Trans } from '@lingui/macro';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import CallMadeIcon from '@mui/icons-material/CallMade';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  timelineItemClasses,
  TimelineSeparator,
} from '@mui/lab';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';

interface ReferralWalletCycleHistoryItem {
  method: string;
  date: string;
  amount: number;
  remainingDebt: number;
}

interface ReferralWalletCycleItem {
  method: string;
  date: string;
  market: string;
  assets: string;
  debt: number;
  apy: number;
  state: string;
  remainingDebt: number;
  referralReward: number;
  history?: ReferralWalletCycleHistoryItem[];
}

const referralWalletHistory: ReferralWalletCycleItem[] = [
  {
    method: 'Borrow',
    date: 'Jun 1, 2024 2:10 AM',
    market: 'Ethereum',
    assets: 'USDT',
    debt: 800.0,
    apy: 38.62,
    state: 'Completed',
    remainingDebt: 0,
    referralReward: 1.23,
    history: [
      {
        method: 'Repay',
        date: 'Jun 2, 2024 2:29 AM',
        amount: 100.0,
        remainingDebt: 700.11,
      },
      {
        method: 'Borrow',
        date: 'Jun 5, 2024 2:29 AM',
        amount: 100.0,
        remainingDebt: 800.23,
      },
      {
        method: 'Liquidation',
        date: 'Dec 15, 2024 2:29 AM',
        amount: 803.52,
        remainingDebt: 0.0,
      },
    ],
  },
  {
    method: 'Borrow',
    date: 'Jun 1, 2024 2:10 AM',
    market: 'Ethereum',
    assets: 'USDT',
    debt: 800.0,
    apy: 38.62,
    state: 'Completed',
    remainingDebt: 0,
    referralReward: 1.23,
    history: [
      {
        method: 'Repay',
        date: 'Jun 2, 2024 2:29 AM',
        amount: 100.0,
        remainingDebt: 700.11,
      },
      {
        method: 'Borrow',
        date: 'Jun 5, 2024 2:29 AM',
        amount: 100.0,
        remainingDebt: 800.23,
      },
      {
        method: 'Liquidation',
        date: 'Dec 15, 2024 2:29 AM',
        amount: 803.52,
        remainingDebt: 0.0,
      },
    ],
  },
  {
    method: 'Borrow',
    date: 'Jun 1, 2024 2:10 AM',
    market: 'Ethereum',
    assets: 'USDT',
    debt: 800.0,
    apy: 38.62,
    state: 'Completed',
    remainingDebt: 0,
    referralReward: 1.23,
    history: [
      {
        method: 'Repay',
        date: 'Jun 2, 2024 2:29 AM',
        amount: 100.0,
        remainingDebt: 700.11,
      },
      {
        method: 'Borrow',
        date: 'Jun 5, 2024 2:29 AM',
        amount: 100.0,
        remainingDebt: 800.23,
      },
      {
        method: 'Liquidation',
        date: 'Dec 15, 2024 2:29 AM',
        amount: 803.52,
        remainingDebt: 0.0,
      },
    ],
  },
];

interface ReferralStepProps {
  data: ReferralWalletCycleItem;
}
const ReferralStep = ({ data }: ReferralStepProps) => {
  const theme = useTheme();
  const [subtimelineOpen, setSubtimelineOpen] = useState(false);
  const xsm = useMediaQuery(theme.breakpoints.up('xsm'));
  const toggleSubtimeline = () => {
    setSubtimelineOpen((open) => !open);
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          p: '4px 8px 4px 4px',
        }}
      >
        <Avatar sx={{ width: 36, height: 36, mr: 2 }} src={'/icons/Avatar.svg'} />
        <Typography variant="body8" color="text.primary">
          <Trans>0xABCD...1234</Trans>
        </Typography>
        <CallMadeIcon sx={{ width: 24, height: 24, ml: 2 }} />
      </Box>
      <TimelineItem
        sx={{
          display: 'flex',
          mt: xsm ? '12px' : 0,
          px: xsm ? '16px' : 0,
          py: xsm ? '8px' : 0,
          alignItems: 'flex-start',
        }}
      >
        <Divider sx={{ my: 3, borderColor: theme.palette.border.divider }} />
        <TimelineContent
          sx={{
            py: xsm ? '6px' : 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '8px',
              height: '100px',
            }}
          >
            <TimelineSeparator>
              <TimelineDot
                sx={{
                  bgcolor: theme.palette.point.primary,
                  width: '16px',
                  height: '16px',
                }}
              />
            </TimelineSeparator>
            <Box sx={{ display: 'flex', ml: '8px' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '148px',
                }}
              >
                <Typography variant="body6" color={'text.primary'}>
                  <Trans>{data.method}</Trans>
                </Typography>
                <Typography variant="detail2" color={theme.palette.text.mainTitle} mt={1}>
                  <Trans>{data.date}</Trans>
                </Typography>
              </Box>
            </Box>
            {xsm && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  gap: '8px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '126px',
                  }}
                >
                  <Typography variant="detail2" color={theme.palette.text.mainTitle}>
                    <Trans>Market</Trans>
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      mt: '4px',
                    }}
                  >
                    <Avatar
                      sx={{ width: 24, height: 24, mr: '6px', color: 'text.primary' }}
                      src={'/icons/networks/ethereum.svg'}
                    />
                    <Typography variant="body6" color="text.primary">
                      <Trans>Ethereum</Trans>
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '126px' }}>
                  <Typography variant="detail2" color={theme.palette.text.mainTitle}>
                    <Trans>Assets</Trans>
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      mt: '4px',
                    }}
                  >
                    <Avatar
                      sx={{ width: 24, height: 24, mr: '6px', color: 'text.primary' }}
                      src={'/icons/networks/ethereum.svg'}
                    />
                    <Typography variant="body6" color="text.primary">
                      <Trans>USDT</Trans>
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '126px' }}>
                  <Typography variant="detail2" color={theme.palette.text.mainTitle}>
                    <Trans>Debt</Trans>
                  </Typography>
                  <Typography variant="body6" color="text.primary">
                    <Trans>800.00</Trans>
                  </Typography>
                  <FormattedNumber
                    variant="detail2"
                    symbolsVariant="detail2"
                    symbolsColor="text.mainTitle"
                    symbol="USD"
                    value={799.91}
                    sx={{ color: 'text.mainTitle' }}
                    visibleDecimals={2}
                  />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '126px',
                  }}
                >
                  <Typography variant="detail2" color={theme.palette.text.mainTitle} mb="8.5px">
                    <Trans>APY</Trans>
                  </Typography>
                  <FormattedNumber
                    variant="body6"
                    symbolsVariant="body6"
                    symbolsColor="text.primary"
                    percent
                    value={0.3862}
                    sx={{ color: 'text.primary' }}
                    visibleDecimals={2}
                  />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '126px' }}>
                  <Typography variant="detail2" color={theme.palette.text.mainTitle} mb="8.5px">
                    <Trans>State</Trans>
                  </Typography>
                  <Typography variant="body6" color="text.primary">
                    <Trans>Completed</Trans>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '126px' }}>
                  <Typography variant="detail2" color={theme.palette.text.mainTitle}>
                    <Trans>Remaining debt</Trans>
                  </Typography>
                  <Typography variant="body6" color="text.primary">
                    <Trans>0.00</Trans>
                  </Typography>
                  <FormattedNumber
                    variant="detail2"
                    symbolsVariant="detail2"
                    symbolsColor="text.mainTitle"
                    symbol="USD"
                    value={0.0}
                    sx={{ color: 'text.mainTitle' }}
                    visibleDecimals={2}
                  />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '126px' }}>
                  <Typography variant="detail2" color={theme.palette.text.mainTitle}>
                    <Trans>Referral reward</Trans>
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      mt: '4px',
                    }}
                  >
                    <Typography variant="body6" color="text.primary">
                      <Trans>1.23</Trans>
                    </Typography>
                    <Avatar
                      sx={{ width: 24, height: 24, mx: '6px', color: 'text.primary' }}
                      src={'/icons/networks/ethereum.svg'}
                    />
                    <Typography variant="body6" color="text.primary">
                      <Trans>CODE</Trans>
                    </Typography>
                  </Box>
                  <FormattedNumber
                    variant="detail2"
                    symbolsVariant="detail2"
                    symbolsColor="text.mainTitle"
                    symbol="USD"
                    value={9.91}
                    sx={{ color: 'text.mainTitle' }}
                    visibleDecimals={2}
                  />
                </Box>
              </Box>
            )}
            {data.history?.length && (
              <IconButton sx={{ p: 0, ml: xsm ? 'auto' : '90px' }} onClick={toggleSubtimeline}>
                {subtimelineOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>
            )}
          </Box>
          {data.history?.length && subtimelineOpen && (
            <Box
              sx={{
                display: 'flex',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
              }}
            >
              <Timeline
                sx={{
                  px: xsm ? '80px' : '28px',
                  pt: '8px',
                }}
              >
                {data.history.map((elem, index) => (
                  <TimelineItem
                    key={index}
                    sx={{
                      display: 'flex',
                      width: '200px',
                      whiteSpace: 'nowrap', // Prevents wrapping of child elements
                    }}
                  >
                    <TimelineSeparator sx={{ position: 'sticky', zIndex: 1, left: '28px' }}>
                      <TimelineDot
                        sx={{
                          my: 1,
                          background: theme.palette.text.subTitle,
                          width: '16px',
                          height: '16px',
                        }}
                      />
                      {data?.history && index < data.history.length - 1 && (
                        <TimelineConnector
                          sx={{
                            background: theme.palette.text.subTitle,
                            width: '1px',
                          }}
                        />
                      )}
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: 0 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          pt: 0,
                          gap: '8px',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            gap: xsm ? '60px' : '20px',
                            alignItems: 'flex-start',
                            height: xsm ? '84px' : '46px',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              width: '148px',
                              height: xsm ? '84px' : '46px',
                              position: 'sticky',
                              zIndex: 1,
                              bgcolor: 'white',
                              left: '60px',
                              // boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.12)',
                            }}
                          >
                            <Typography variant="body6" color="text.primary" mb={1}>
                              <Trans>{elem.method}</Trans>
                            </Typography>
                            <Typography variant="detail2" color="text.mainTitle">
                              <Trans>{elem.date}</Trans>
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              height: xsm ? '84px' : '46px',
                              zIndex: 0.5,
                            }}
                          >
                            <Typography variant="detail2" color="text.mainTitle" mb={1}>
                              <Trans>Amount</Trans>
                            </Typography>
                            <Typography variant="body6" color="text.primary">
                              <Trans>{elem.amount}</Trans>
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              height: xsm ? '84px' : '46px',
                              zIndex: 0.5,
                            }}
                          >
                            <Typography variant="detail2" color="text.mainTitle" mb={1}>
                              <Trans>Remaining debt</Trans>
                            </Typography>
                            <Typography variant="body6" color="text.primary">
                              <Trans>{elem.remainingDebt}</Trans>
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Box>
          )}
          {!xsm && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                gap: '12px',
                ml: '24px',
                width: '300px',
                mb: '60px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Typography variant="detail2" color={theme.palette.text.mainTitle}>
                  <Trans>Market</Trans>
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    mt: '4px',
                    width: '170px',
                  }}
                >
                  <Avatar
                    sx={{ width: 24, height: 24, mr: '6px', color: 'text.primary' }}
                    src={'/icons/networks/ethereum.svg'}
                  />
                  <Typography variant="body6" color="text.primary">
                    <Trans>Ethereum</Trans>
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Typography variant="detail2" color={theme.palette.text.mainTitle}>
                  <Trans>Assets</Trans>
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    mt: '4px',
                    width: '170px',
                  }}
                >
                  <Avatar
                    sx={{ width: 24, height: 24, mr: '6px', color: 'text.primary' }}
                    src={'/icons/networks/ethereum.svg'}
                  />
                  <Typography variant="body6" color="text.primary">
                    <Trans>USDT</Trans>
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Typography variant="detail2" color={theme.palette.text.mainTitle}>
                  <Trans>Debt</Trans>
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    gap: '4px',
                    width: '170px',
                  }}
                >
                  <Typography variant="body6" color="text.primary">
                    <Trans>800.00</Trans>
                  </Typography>
                  <FormattedNumber
                    variant="detail2"
                    symbolsVariant="detail2"
                    symbolsColor="text.mainTitle"
                    symbol="USD"
                    value={799.91}
                    sx={{ color: 'text.mainTitle' }}
                    visibleDecimals={2}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Typography variant="detail2" color={theme.palette.text.mainTitle} mb="8.5px">
                  <Trans>APY</Trans>
                </Typography>
                <FormattedNumber
                  variant="body6"
                  symbolsVariant="body6"
                  symbolsColor="text.primary"
                  percent
                  value={0.3862}
                  sx={{ color: 'text.primary', width: '170px' }}
                  visibleDecimals={2}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Typography variant="detail2" color={theme.palette.text.mainTitle} mb="8.5px">
                  <Trans>State</Trans>
                </Typography>
                <Typography variant="body6" color="text.primary" sx={{ width: '170px' }}>
                  <Trans>Completed</Trans>
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Typography variant="detail2" color={theme.palette.text.mainTitle}>
                  <Trans>Remaining debt</Trans>
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    gap: '4px',
                    width: '170px',
                  }}
                >
                  <Typography variant="body6" color="text.primary">
                    <Trans>0.00</Trans>
                  </Typography>
                  <FormattedNumber
                    variant="detail2"
                    symbolsVariant="detail2"
                    symbolsColor="text.mainTitle"
                    symbol="USD"
                    value={0.0}
                    sx={{ color: 'text.mainTitle' }}
                    visibleDecimals={2}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Typography variant="detail2" color={theme.palette.text.mainTitle}>
                  <Trans>Referral reward</Trans>
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      mt: '4px',
                      width: '170px',
                    }}
                  >
                    <Typography variant="body6" color="text.primary">
                      <Trans>1.23</Trans>
                    </Typography>
                    <Avatar
                      sx={{ width: 24, height: 24, mx: '6px', color: 'text.primary' }}
                      src={'/icons/networks/ethereum.svg'}
                    />
                    <Typography variant="body6" color="text.primary">
                      <Trans>CODE</Trans>
                    </Typography>
                  </Box>
                  <FormattedNumber
                    variant="detail2"
                    symbolsVariant="detail2"
                    symbolsColor="text.mainTitle"
                    symbol="USD"
                    value={9.91}
                    sx={{ color: 'text.mainTitle' }}
                    visibleDecimals={2}
                  />
                </Box>
              </Box>
            </Box>
          )}
        </TimelineContent>
      </TimelineItem>
    </Box>
  );
};

export const ReferralWalletCycle = () => {
  return (
    <Timeline
      sx={{
        m: 0,
        p: 0,
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      {referralWalletHistory.map((elem) => (
        <ReferralStep data={elem} key={elem.date} />
      ))}
    </Timeline>
  );
};

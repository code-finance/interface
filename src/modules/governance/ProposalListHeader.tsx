import { Trans } from '@lingui/macro';
import { Sort as SortIcon } from '@mui/icons-material';
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  SvgIcon,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React from 'react';
import { useRootStore } from 'src/store/root';
import { GOVERNANCE_PAGE } from 'src/utils/mixPanelEvents';

import { SearchInput } from '../../components/SearchInput';
import { TitleWithSearchBar } from '../../components/TitleWithSearchBar';
import { getProposalStates } from './StateBadge';

type ProposalListHeaderProps = {
  proposalFilter: string;
  handleProposalFilterChange: (value: string) => void;
  handleSearchQueryChange: (value: string) => void;
};

type ProposalListHeaderElementProps = {
  proposalFilter?: string;
  handleSearchQueryChange: (value: string) => void;
  handleChange?: (event: SelectChangeEvent) => void;
};

export const ProposalListHeaderDesktop: React.FC<ProposalListHeaderElementProps> = ({
  proposalFilter,
  handleSearchQueryChange,
  handleChange,
}) => {
  return (
    <>
      <Typography variant="h2" sx={{ flexGrow: 1, minWidth: 300 }} color="text.primary">
        <Trans>Proposals</Trans>
      </Typography>
      <Select
        id="filter"
        value={proposalFilter}
        renderValue={(value) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SvgIcon height={9} width={9}>
              <SortIcon />
            </SvgIcon>
            {value === 'all' ? 'All proposals' : value}
          </Box>
        )}
        sx={{
          minWidth: 157,
          outline: 'none',
          '.MuiSelect-select': {
            pr: '12px !important',
          },
          '.MuiSelect-icon': {
            display: 'none',
          },
          fieldset: {
            borderWidth: '1px !important',
          },
        }}
        onChange={handleChange}
        MenuProps={{
          sx: {
            '.MuiPaper-root': {
              minWidth: '183px !important',
              transform: 'translateX(12px) !important',
            },
          },
        }}
      >
        <MenuItem value="all">
          <Trans>All proposals</Trans>
        </MenuItem>
        {getProposalStates().map((key) => (
          <MenuItem key={key} value={key}>
            {key}
          </MenuItem>
        ))}
      </Select>
      <SearchInput
        wrapperSx={{
          maxWidth: '393px',
          width: '100%',
        }}
        placeholder="Search proposals"
        onSearchTermChange={handleSearchQueryChange}
      />
    </>
  );
};

export const ProposalListHeaderMobile: React.FC<ProposalListHeaderElementProps> = ({
  proposalFilter,
  handleChange,
  handleSearchQueryChange,
}) => {
  return (
    <>
      <TitleWithSearchBar
        title={<Trans>Proposals</Trans>}
        titleProps={{ variant: 'h2' }}
        onSearchTermChange={handleSearchQueryChange}
        searchPlaceholder="Search proposals"
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Typography>
          <Trans>Filter</Trans>
        </Typography>
        <Select id="filter" value={proposalFilter} sx={{ minWidth: 140 }} onChange={handleChange}>
          <MenuItem value="all">
            <Trans>All proposals</Trans>
          </MenuItem>
          {getProposalStates().map((key) => (
            <MenuItem key={key} value={key}>
              {key}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </>
  );
};

export const ProposalListHeader: React.FC<ProposalListHeaderProps> = ({
  proposalFilter,
  handleProposalFilterChange,
  handleSearchQueryChange,
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    trackEvent(GOVERNANCE_PAGE.FILTER, { filter: event.target.value });
    handleProposalFilterChange(event.target.value as string);
  };
  const { breakpoints } = useTheme();

  const sxm = useMediaQuery(breakpoints.up('xsm'));
  const trackEvent = useRootStore((store) => store.trackEvent);

  return (
    <Box
      sx={(theme) => ({
        pb: { xs: 4, md: 16 },
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        flexWrap: 'wrap',
        borderBottom: '1px solid',
        borderColor: theme.palette.border.divider,
      })}
    >
      {!sxm ? (
        <ProposalListHeaderMobile
          proposalFilter={proposalFilter}
          handleChange={handleChange}
          handleSearchQueryChange={handleSearchQueryChange}
        />
      ) : (
        <ProposalListHeaderDesktop
          proposalFilter={proposalFilter}
          handleChange={handleChange}
          handleSearchQueryChange={handleSearchQueryChange}
        />
      )}
    </Box>
  );
};

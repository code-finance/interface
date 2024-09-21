import { Trans } from '@lingui/macro';
import { Box, MenuItem, Select, SelectChangeEvent, Typography, useTheme } from '@mui/material';
import { SearchInput } from 'src/components/SearchInput';

type StatusListHeaderProps = {
  statusFilter: string;
  handleStatusFilterChange: (value: string) => void;
  handleSearchQueryChange: (value: string) => void;
};
type StatusListHeaderElementProps = {
  statusFilter?: string;
  handleSearchQueryChange: (value: string) => void;
  handleChange?: (event: SelectChangeEvent) => void;
};
export const StatusListHeaderDesktop: React.FC<StatusListHeaderElementProps> = ({
  statusFilter,
  handleSearchQueryChange,
  handleChange,
}) => {
  const allStatus = ['Inprogress', 'Completed'];
  const theme = useTheme();
  return (
    <>
      <Select
        id="filter"
        value={statusFilter}
        onChange={handleChange}
        sx={{ minWidth: { xs: '90px', xsm: '120px' } }}
      >
        <MenuItem value="all">
          <Trans>All</Trans>
        </MenuItem>

        {allStatus.map((key) => (
          <MenuItem key={key} value={key}>
            {key}
          </MenuItem>
        ))}
      </Select>
      <SearchInput
        wrapperSx={{
          width: '393px',
        }}
        placeholder="search assets"
        onSearchTermChange={handleSearchQueryChange}
      />
    </>
  );
};
export const StatusListHeader: React.FC<StatusListHeaderProps> = ({
  statusFilter,
  handleStatusFilterChange,
  handleSearchQueryChange,
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    handleStatusFilterChange(event.target.value as string);
  };
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <StatusListHeaderDesktop
        statusFilter={statusFilter}
        handleChange={handleChange}
        handleSearchQueryChange={handleSearchQueryChange}
      />
    </Box>
  );
};

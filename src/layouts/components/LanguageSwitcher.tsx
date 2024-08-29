import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  SvgIcon,
  Typography,
} from '@mui/material';
import React from 'react';

import { dynamicActivateLanguage } from '../../libs/LanguageProvider';

const langMap = {
  en: t`English`,
  es: t`Spanish`,
  fr: t`French`,
  el: t`Greek`,
};

interface LanguageListItemProps {
  component?: typeof MenuItem | typeof ListItem;
  onClick: () => void;
}

export const LanguageListItem = ({ component = ListItem, onClick }: LanguageListItemProps) => {
  const { i18n } = useLingui();

  return (
    <Box
      component={component}
      onClick={onClick}
      sx={{ px: 1.5, py: '9px', display: 'flex', alignItems: 'center' }}
    >
      <ListItemText>
        <Typography variant="body5" color="text.primary">
          <Trans>Language</Trans>
        </Typography>
      </ListItemText>
      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <Typography variant="body5" color="text.primary" sx={{ lineHeight: 1 }}>
          {i18n._(langMap[i18n.locale as keyof typeof langMap])}{' '}
        </Typography>
        <SvgIcon sx={{ color: 'inherit', ml: 1, fontSize: '24px !important' }}>
          <ChevronRightIcon />
        </SvgIcon>
      </Box>
    </Box>
  );
};

export const LanguagesList = ({ component = ListItem, onClick }: LanguageListItemProps) => {
  const { i18n } = useLingui();

  return (
    <>
      <Box sx={{ mb: '4px' }} onClick={onClick}>
        <ListItemText disableTypography>
          <Typography variant="detail2" color="text.mainTitle" component="div" sx={{ mb: '4px' }}>
            <Trans>Select language</Trans>
          </Typography>
        </ListItemText>
      </Box>

      {Object.keys(langMap).map((lang) => (
        <Box component={component} key={lang} onClick={() => dynamicActivateLanguage(lang)}>
          <ListItemIcon
            sx={{ mr: 3, borderRadius: '2px', overflow: 'hidden', width: 20, height: 14 }}
          >
            <img src={`/icons/flags/${lang}.svg`} width="100%" height="100%" alt={`${lang} icon`} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body5" color="text.primary">
              {i18n._(langMap[lang as keyof typeof langMap])}
            </Typography>
          </ListItemText>
          {lang === i18n.locale && (
            <ListItemIcon sx={{ m: 0 }}>
              <SvgIcon fontSize="small" sx={{ color: 'text.primary' }}>
                <CheckIcon />
              </SvgIcon>
            </ListItemIcon>
          )}
        </Box>
      ))}
    </>
  );
};

import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
// react-hook-form
import { Controller, useFormContext } from 'react-hook-form';
//
import FieldsRender from './fields-render';
import TabPanel from '../tab-panel';

export default function RHFLanguageField({ name, langs, fields }) {
  const { control } = useFormContext();

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box>
          <Tabs
            value={value}
            onChange={handleChange}
            sx={(theme) => ({
              borderRight: 1,
              borderRight: 'none',
              borderColor: 'divider',
              '& .MuiTabs-indicator': { backgroundColor: theme.palette.primary.main },
              // '& .Mui-selected': { color: '#96011c!important' },
            })}
          >
            {langs.map((lang, index) => (
              <Tab
                key={index}
                sx={{ px: '4px' }}
                label={(
                  <Badge color='error' variant='dot' invisible={!(error && error[lang.slug])}>
                    {lang.label}
                  </Badge>
                )}
              />
            ))}
          </Tabs>
          {langs.map((lang, index) => (
            <TabPanel
              value={value}
              index={index}
              key={index}
            >
              <Stack spacing={3}>
                {fields.map((field, i) => {
                  const fieldProps = {
                    ...field,
                    name: `${name}.${lang.slug}.${field.name}`,
                    type: field?.type || 'text',
                    label: field?.label || null,
                  }

                  return <FieldsRender field={fieldProps} key={i} />;
                })}
              </Stack>
            </TabPanel>
          ))}
        </Box>
      )}
    />
  );
}

RHFLanguageField.propTypes = {
  name: PropTypes.string,
  langs: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    slug: PropTypes.string
  })),
  fields: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['text', 'editor']),
    name: PropTypes.string
  }))
}
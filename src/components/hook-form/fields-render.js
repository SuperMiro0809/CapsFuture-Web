import PropTypes from 'prop-types';
// @mui
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
// components
import RHFTextField from './rhf-text-field';
import RHFEditor from './rhf-editor';
import RHFLanguageField from './rhf-language-field';

export default function FieldsRender({ field }) {
  const generateId = (name) => {
    const parts = name.split('.');
    return parts.join('-');
  };

  return (
    <>
      {(field.type === 'text' || field.type === 'number' || field.type === 'email' || field.type === 'password') && (
        <Stack spacing={1.5}>
          {field.label && <Typography variant="subtitle2">{field.label}</Typography>}
          <RHFTextField
            {...field}
            name={field.name}
            type={field.type}
            label={undefined}
          />
        </Stack>
      )}

      {field.type === 'editor' && (
        <Stack spacing={1.5}>
          {field.label && <Typography variant="subtitle2">{field.label}</Typography>}
          <RHFEditor
            simple
            name={field.name}
            documentId={generateId(field.name)}
          />
        </Stack>
      )}

      {field.type === 'language-field' && (
        <RHFLanguageField
          name={field.name}
          langs={field.langs}
          fields={field.fields}
        />
      )}
    </>
  );
}

FieldsRender.propTypes = {
  field: PropTypes.object
}
import PropTypes from 'prop-types';
// @mui
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// components
import Label from 'src/components/label';
import Markdown from 'src/components/markdown';

// ----------------------------------------------------------------------

export default function OptionsDialogTableRow({ row, selected, onSelectRow, tableColumns }) {
  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      {tableColumns.map((column, index) => {
        const value = row[column.id];
        const type = column?.type || 'text';

        switch (type) {
          case 'markdown':
            return (
              <TableCell sx={{ whiteSpace: 'nowrap' }} key={index}>
                <Tooltip title={value}>
                  <Typography
                    noWrap
                    variant="inherit"
                    sx={{ maxWidth: 180 }}
                    component='div'
                  >
                    <Markdown>{value}</Markdown>
                  </Typography>
                </Tooltip>
              </TableCell>
            );
          case 'label':
            return (
              <TableCell sx={{ whiteSpace: 'nowrap' }} key={index}>
                <Label
                  variant="soft"
                  color={column?.color || 'primary'}
                >
                  {value}
                </Label>
              </TableCell>
            );
          case 'label-list':
            return (
              <TableCell sx={{ whiteSpace: 'nowrap' }} key={index}>
                {value?.length > 0 ?
                  (
                    <Stack direction='row' spacing={1}>
                      {
                        value.map((el) => (
                          <Label
                            key={el.id}
                            variant="soft"
                            color={column?.color || 'primary'}
                          >
                            {el.name}
                          </Label>
                        ))
                      }
                    </Stack>
                  ) :
                  <>
                    -
                  </>
                }
              </TableCell>
            );
          default:
            return (
              <TableCell sx={{ whiteSpace: 'nowrap' }} key={index}>
                <Tooltip title={value}>
                  <Typography
                    noWrap
                    variant="inherit"
                    sx={{ maxWidth: 180 }}
                  >
                    {value}
                  </Typography>
                </Tooltip>
              </TableCell>
            );
        }
      })}

      {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Tooltip title={title}>
            <ListItemText
              primary={<Markdown children={title} />}
              secondary={name}
              primaryTypographyProps={{
                typography: 'body2',
                maxWidth: 250,
                noWrap: "true",
                variant: "inherit"
              }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.disabled',
                maxWidth: 250,
                noWrap: "true",
                variant: "inherit"
              }}
            />
          </Tooltip>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Tooltip title={description}>
            <Typography
              noWrap
              variant="inherit"
              sx={{ maxWidth: 180 }}
            >
              {description}
            </Typography>
          </Tooltip>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant="soft"
            color='primary'
          >
            {QuestionCategories?.display_name}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {QuestionTags.length > 0 ?
            (
              <Stack direction='row' spacing={1} justifyContent='center'>
                {
                  QuestionTags.map((tag) => (
                    <Label
                      key={tag.id}
                      variant="soft"
                      color='success'
                    >
                      {tag.name}
                    </Label>
                  ))
                }
              </Stack>
            ) :
            <>
              -
            </>
          }
        </TableCell> */}
    </TableRow>
  );
}

OptionsDialogTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  tableColumns: PropTypes.array
};

import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
// components
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';

export default function TableRowCustom({
    row,
    tableHead,
    selected,
    onSelectRow,
    tableOptions,
    confirm,
    setSelectedId
}) {

    return (
        <TableRow hover selected={selected}>
            {tableOptions.checkbox.value && (
                <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell>
            )}

            {tableHead.map((heading) => {
                const value = row[heading.id];
                // const { type = 'text' } = heading;

                // if (type === 'array') {
                //     return (
                //         <TableCell key={heading.id} align={heading.align} style={{ maxHeight: "20px", overflow: "hidden" }}>
                //             <Grid container spacing={1}>

                //                 {value.map((element, index) => {
                //                     const name = element[heading.arrayId][heading.selector];

                //                     return (
                //                         <Grid item key={index}>
                //                             <Tooltip title={name}>
                //                                 <Chip label={name} sx={{ maxWidth: '150px' }} />
                //                             </Tooltip>
                //                         </Grid>
                //                     );
                //                 })}

                //             </Grid>
                //         </TableCell>
                //     );
                // } else if (type === 'switch') {
                //     const handler = heading.handler;

                //     return (
                //         <TableCell key={heading.id} align={heading.align} style={{ maxHeight: "20px", overflow: "hidden" }}>
                //             <CustomSwitch
                //                 checked={!!value}
                //                 onChange={(event) => {
                //                     handler(event, row.id);
                //                     newRequest();
                //                 }}
                //             />
                //         </TableCell>
                //     );
                // } else if (type === 'chip') {
                //     return (
                //         <TableCell key={heading.id} align={heading.align} style={{ maxHeight: "20px", overflow: "hidden" }}>
                //             <ChipColumn
                //                 value={value}
                //                 select={heading.select}
                //                 options={heading.options}
                //                 handler={heading.handler}
                //                 newRequest={newRequest}
                //                 row={row}
                //             />
                //         </TableCell>
                //     );
                // } else if (type === 'button') {
                //     const handler = heading.handler;

                //     return (
                //         <TableCell key={heading.id} align={heading.align} style={{ maxHeight: "20px", overflow: "hidden" }}>
                //             <Button
                //                 variant={heading.button && Object.hasOwn(heading.button, 'variant') ? heading.button.variant : 'contained'}
                //                 color={heading.button && Object.hasOwn(heading.button, 'color') ? heading.button.color : 'primary'}
                //                 textcolor={heading.button && Object.hasOwn(heading.button, 'textColor') ? heading.button.textColor : 'primary'}
                //                 onClick={() => handleOpenDialog(heading.dialog, handler, row.id)}
                //                 disabled={!!value}
                //             >
                //                 {heading.button && Object.hasOwn(heading.button, 'label') ? heading.button.label : heading.label}
                //             </Button>
                //         </TableCell>
                //     );
                // }

                return (
                    <TableCell key={heading.id} align={heading.align} style={{ maxHeight: "20px", overflow: "hidden" }}>
                        <Tooltip title={value}>
                            <span>{value}</span>
                        </Tooltip>
                    </TableCell>
                );
            })}

            {tableOptions.edit.value && (
                <TableCell align='right'>
                    <Tooltip title="Edit" placement="top" arrow>
                        <IconButton
                            component={RouterLink}
                            href={`${row.id}/edit`}
                        >
                            <Iconify icon="solar:pen-bold" />
                        </IconButton>
                    </Tooltip>
                </TableCell>
            )}

            {tableOptions.delete.value && (
                <TableCell align='right'>
                    <Tooltip title="Delete" placement="top" arrow>
                        <IconButton
                            onClick={() => {
                                setSelectedId(row.id);
                                confirm.onTrue();
                            }}
                            sx={{ color: 'error.main' }}
                        >
                            <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                    </Tooltip>
                </TableCell>
            )}

        </TableRow>
    );
}

TableRowCustom.propTypes = {
    row: PropTypes.object,
    tableHead: PropTypes.array,
    selected: PropTypes.bool,
    onSelectRow: PropTypes.func,
    tableOptions: PropTypes.object,
    confirm: PropTypes.object,
    setSelectedId: PropTypes.func
}
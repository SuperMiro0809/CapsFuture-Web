import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';
import Switch from '@mui/material/Switch';
// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
// components
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
//
import { ASSETS } from 'src/config-global';

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
                const { type = 'text' } = heading;

                if (type === 'array') {
                    return (
                        <TableCell key={heading.id} align={heading.align} style={{ maxHeight: "20px", overflow: "hidden" }}>
                            <Grid container spacing={1}>

                                {value.map((element, index) => {
                                    const name = typeof element === 'string' ? element : element[heading.selector];

                                    return (
                                        <Grid item key={index}>
                                            <Tooltip title={name}>
                                                <Chip label={name} sx={{ maxWidth: '150px' }} />
                                            </Tooltip>
                                        </Grid>
                                    );
                                })}

                            </Grid>
                        </TableCell>
                    );
                } else if (type === 'text-with-image') {
                    return (
                        <TableCell key={heading.id} align={heading.align} sx={{ overflow: 'hidden', display: 'flex', alignItems: 'center' }} >
                            {Array.isArray(row[heading.imageSelector]) ? (
                                <Swiper
                                    style={{
                                        '--swiper-navigation-size': '20px',
                                    }}
                                    navigation={true}
                                    modules={[Navigation]}
                                    className='table-column-swiper'
                                >
                                    {row[heading.imageSelector].map((file, index) => (
                                        <SwiperSlide key={index}>
                                            <Avatar
                                                src={`${ASSETS}/${file.filepath}`}
                                                variant='rounded'
                                                sx={{ width: 64, height: 64, mr: 2 }}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            ) : (
                                <Avatar
                                    src={`${ASSETS}/${row[heading.imageSelector]}`}
                                    variant={heading?.imageVariant || 'rounded'}
                                    sx={{ width: 64, height: 64, mr: 2 }}
                                />
                            )}

                            <ListItemText
                                primary={
                                    <Link
                                        noWrap
                                        color="inherit"
                                        variant="subtitle2"
                                    >
                                        {value}
                                    </Link>
                                }
                            />
                        </TableCell>
                    )
                } else if (type === 'switch') {
                    const handler = heading.handler;

                    return (
                        <TableCell key={heading.id} align={heading.align} style={{ maxHeight: "20px", overflow: "hidden" }}>
                            <Switch
                                checked={!!value}
                                onChange={(event) => {
                                    handler(event, row.id);
                                }}
                            />
                        </TableCell>
                    );
                }
                else if (type === 'chip') {
                    return (
                        <TableCell key={heading.id} align={heading.align} style={{ maxHeight: "20px", overflow: "hidden" }}>
                            <Chip
                                color={heading?.getColor ? heading.getColor(value) : 'default'}
                                label={value}
                                sx={{ maxWidth: '150px' }}
                            />
                        </TableCell>
                    );
                }
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

            {tableOptions.custom.map((option, index) => (
                <TableCell align='right' key={index}>
                    <Tooltip title={option.title} placement="top" arrow>
                        <IconButton
                            onClick={(event) => option.handler(row.id)}
                            sx={{ color: option?.color || 'default' }}
                        >
                            {option.icon}
                        </IconButton>
                    </Tooltip>
                </TableCell>
            ))}

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
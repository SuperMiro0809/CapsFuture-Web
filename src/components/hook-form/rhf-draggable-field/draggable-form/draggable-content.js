/* eslint-disable import/no-cycle */

import PropTypes from 'prop-types';
import { m } from 'framer-motion';
// @mui
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Fab from '@mui/material/Fab';
// components
import FieldsRender from 'src/components/hook-form/fields-render';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { varHover } from 'src/components/animate';

export default function DraggableContent({
  fields,
  fieldOptions,
  name: parentName,
  showElementOrder,
  //
  index: parentIndex,
  isLast,
  //
  onRemove,
  provided,
  snapshot,
  handleArrowKeyPressed,
  //
  lastItemRef,
  //
  actions
}) {
  const grid = 6;
  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // styles we need to apply on draggables
    ...draggableStyle
  });

  return (
    <Card
      ref={provided.innerRef}
      {...provided.draggableProps}
      style={getItemStyle(
        snapshot.isDragging,
        provided.draggableProps.style
      )}
      sx={{ borderRadius: '10px' }}
    >
      <CardHeader
        {...(showElementOrder && { title: <Label color='primary'>{parentIndex + 1}</Label> })}
        action={
          <IconButton
            onClick={() => onRemove(parentIndex)}
            disabled={actions?.disableDelete || false}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        }
        sx={{ py: 0, px: 1 }}
        ref={isLast ? lastItemRef : null}
      />
      <Box sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'center',
      }}>
        <Stack alignItems='center' spacing={2}>
          <Fab
            component={m.button}
            onClick={() => handleArrowKeyPressed(parentIndex, parentIndex - 1)} // move up
            whileTap="tap"
            whileHover="hover"
            variants={varHover(1.1, 0.95)}
            variant='soft'
            size='small'
            color='secondary'
            disabled={actions?.disableMove || parentIndex === 0}
          >
            <Iconify icon="solar:arrow-up-linear" />
          </Fab>

          <div {...provided.dragHandleProps}>
            <DragIndicatorIcon color='primary' />
          </div>

          <Fab
            component={m.button}
            onClick={() => handleArrowKeyPressed(parentIndex, parentIndex + 1)} // move down
            whileTap="tap"
            whileHover="hover"
            variants={varHover(1.1, 0.95)}
            variant='soft'
            size='small'
            color='secondary'
            disabled={actions?.disableMove || isLast}
          >
            <Iconify icon="solar:arrow-down-linear" />
          </Fab>
        </Stack>

        <Grid container spacing={3} sx={{ width: '100%', alignItems: 'end' }}>
          {Object.keys(fields).map((key, index) => {
            const field = fieldOptions.find(obj => obj.key === key);

            const { key: fieldName, ...options } = field;

            const data = {
              ...options,
              name: `${parentName}.${parentIndex}.${fieldName}`,
              type: options?.type || 'text',
              label: options?.label || null
            }

            return (
              <Grid
                key={index}
                xs={12}
                {...(options?.grid && options.grid)} // grid options
                {...((options?.getStyles && typeof options?.getStyles === 'function') && 
                  options.getStyles(`${parentName}.${parentIndex}.${fieldName}`) // get custom styles only for current element | expects to return object
                )}
              >
                <FieldsRender
                  field={data}
                />
              </Grid>
            )
          })}
        </Grid>
      </Box>
    </Card>
  );
}

DraggableContent.propTypes = {
  fields: PropTypes.object,
  fieldOptions: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string
  })),
  name: PropTypes.string,
  index: PropTypes.number,
  onRemove: PropTypes.func,
  provided: PropTypes.object,
  snapshot: PropTypes.object,
  showElementOrder: PropTypes.bool,
  actions: PropTypes.shape({
    disableAdd: PropTypes.bool,
    disableDelete: PropTypes.bool,
    disableMove: PropTypes.bool
  })
}
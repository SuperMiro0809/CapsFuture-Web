import PropTypes from 'prop-types';
// @mui
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import IconButton from '@mui/material/IconButton';
// components
import Iconify from 'src/components/iconify';

export default function DraggableContent({
  title,
  index: parentIndex,
  onRemove,
  provided,
  snapshot,
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
      {...provided.dragHandleProps}
      style={getItemStyle(
        snapshot.isDragging,
        provided.draggableProps.style
      )}
      sx={{ borderRadius: '10px' }}
    >
      <CardHeader
        avatar={
          <DragIndicatorIcon color='primary' />
        }
        title={title}
        action={
          <IconButton
            onClick={() => onRemove(parentIndex)}
            disabled={actions?.disableDelete || false}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        }
        sx={{ p: 0 }}
      />
    </Card>

  );
}

DraggableContent.propTypes = {
  title: PropTypes.string,
  index: PropTypes.number,
  onRemove: PropTypes.func,
  provided: PropTypes.object,
  snapshot: PropTypes.object,
  actions: PropTypes.shape({
    disableAdd: PropTypes.bool,
    disableDelete: PropTypes.bool,
    disableMove: PropTypes.bool
  })
}
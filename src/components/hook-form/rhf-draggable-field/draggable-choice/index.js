import { useState } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
// @mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
// i18n
import { useTranslation } from 'react-i18next';
// styles
import { DraggableContainer, HelperText } from '../styles';
// components
import OptionsDialog from './options-dialog';
import DraggableContent from './draggable-content';

export default function DraggableChoiceVariant({
  label,
  options = [],
  helperText,
  buttonLabel = '',
  //
  fields,
  onDragEnd,
  onSave,
  onRemove,
  //
  choiceDialog,
  //
  actions
}) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  return (
    <>
      <OptionsDialog
        open={open}
        onClose={() => setOpen(false)}
        options={options}
        title={label}
        selected={fields}
        setSelected={onSave}
        //
        choiceDialog={choiceDialog}
      />

      <DraggableContainer>
        <Stack spacing={1.5}>
          <Button
            variant="outlined"
            type="button"
            size="large"
            color="primary"
            sx={{ zIndex: 1, backgroundColor: 'background.paper' }}
            onClick={() => setOpen(true)}
            disabled={actions?.disableAdd || false}
          >

            {buttonLabel || t('choose', { ns: 'common' })}
          </Button>

          <DragDropContext onDragEnd={onDragEnd(fields)}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >

                  {(fields || []).map((value, index) => (
                    <Draggable
                      key={value.id}
                      draggableId={`item-${value.id}`}
                      index={index}
                      isDragDisabled={actions?.disableMove || false}
                    >
                      {(providedDraggable, snapshotDraggable) => (
                        <DraggableContent
                          title={value.name}
                          index={index}
                          onRemove={onRemove}
                          provided={providedDraggable}
                          snapshot={snapshotDraggable}
                          //
                          actions={actions}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Stack>
      </DraggableContainer>

      {helperText &&
        <HelperText>
          {helperText}
        </HelperText>
      }
    </>
  );
}

DraggableChoiceVariant.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    content: PropTypes.string
  })),
  helperText: PropTypes.object,
  buttonLabel: PropTypes.string,
  //
  fields: PropTypes.array,
  onDragEnd: PropTypes.func,
  onSave: PropTypes.func,
  onRemove: PropTypes.func,
  //
  choiceDialog: PropTypes.shape({
    tableColumns: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      width: PropTypes.number
    })),
    tableFilters: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string,
      label: PropTypes.string
    }))
  }),
  actions: PropTypes.shape({
    disableAdd: PropTypes.bool,
    disableDelete: PropTypes.bool,
    disableMove: PropTypes.bool
  })
}
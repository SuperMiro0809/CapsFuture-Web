/* eslint-disable import/no-cycle */

import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
// @mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
// i18n
import { useTranslation } from 'react-i18next';
// styles
import { DraggableContainer, HelperText } from '../styles';
// components
import DraggableContent from './draggable-content';

export default function DraggableFormVariant({
  name,
  fieldOptions,
  helperText,
  buttonLabel,
  showElementOrder,
  //
  fields,
  onDragEnd,
  onRemove,
  onAdd,
  onArrowKeyPressed,
  //
  lastItemRef,
  //
  actions
}) {
  const { t } = useTranslation();

  return (
    <>
      <DraggableContainer>
        <Stack spacing={1.5}>
          <Button
            variant="outlined"
            type="button"
            size="large"
            color="primary"
            sx={{ zIndex: 1, backgroundColor: 'background.paper' }}
            onClick={onAdd}
            disabled={actions?.disableAdd || false}
          >

            {buttonLabel || t('add')}
            <AddIcon />
          </Button>

          <DragDropContext onDragEnd={onDragEnd(fields)}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >

                  {fields.map((value, index) => {
                    const { id, draggable_field_key, order, ...keys } = value;

                    return (
                      <Draggable
                        key={draggable_field_key}
                        draggableId={`item-${draggable_field_key}`}
                        index={index}
                        isDragDisabled={actions?.disableMove || false}
                      >
                        {(providedDraggable, snapshotDraggable) => (
                          <DraggableContent
                            fields={keys}
                            fieldOptions={fieldOptions}
                            name={name}
                            showElementOrder={showElementOrder}
                            //
                            index={index}
                            isLast={index === fields.length - 1}
                            //
                            onRemove={onRemove}
                            provided={providedDraggable}
                            snapshot={snapshotDraggable}
                            handleArrowKeyPressed={onArrowKeyPressed}
                            //
                            lastItemRef={lastItemRef}
                            //
                            actions={actions}
                          />
                        )}
                      </Draggable>
                    );
                  })}
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

DraggableFormVariant.propTypes = {
  name: PropTypes.string,
  fieldOptions: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string
  })),
  helperText: PropTypes.object,
  buttonLabel: PropTypes.string,
  showElementOrder: PropTypes.bool,
  //
  fields: PropTypes.array,
  onDragEnd: PropTypes.func,
  onRemove: PropTypes.func,
  onAdd: PropTypes.func,
  onArrowKeyPressed: PropTypes.func,
  actions: PropTypes.shape({
    disableAdd: PropTypes.bool,
    disableDelete: PropTypes.bool,
    disableMove: PropTypes.bool
  })
}
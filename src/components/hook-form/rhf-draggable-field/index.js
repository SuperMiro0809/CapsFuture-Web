/* eslint-disable import/no-cycle */

import { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
// utils
import { formScheme } from 'src/utils/form';
// @mui
import FormHelperText from '@mui/material/FormHelperText';
// components
import DraggableChoiceVariant from './draggable-choice';
import DraggableFormVariant from './draggable-form';

export default function RHFDraggableField({
  variant = 'choice', // choice | form
  name,
  label,
  options = [],
  helperText,
  buttonLabel = '',
  fieldOptions = [],
  choiceDialog = {
    tableColumns: [{ id: 'name', label: 'name' }],
    tableFilters: []
  },
  disableButton = false,
  showElementOrder = false,
  actions = {}
}) {
  const { control, setValue } = useFormContext();

  const { fields, append, remove, move } = useFieldArray({ name, control, keyName: 'draggable_field_key' });

  const [needUpdate, setNeedUpdate] = useState(false);

  const [needScroll, setNeedScroll] = useState(false);

  const lastItemRef = useRef(null);

  const onDragEnd = (values) => ({ destination, source }) => {
    // dropped outside the list
    if (!destination) return;

    move(source.index, destination.index);

    setNeedUpdate(true);
  };

  const onArrowKeyPressed = (sourceIndex, destinationIndex) => {
    move(sourceIndex, destinationIndex);

    setNeedUpdate(true);
  }

  const onRemove = (index) => {
    remove(index);

    setNeedUpdate(true);
  }

  const onAdd = () => {
    const scheme = formScheme(fieldOptions);

    append(scheme);

    setNeedUpdate(true);
    setNeedScroll(true);
  }

  const onSave = useCallback((data) => {
    const value = data.map((el, index) => {
      const obj = {
        id: el.id,
        name: el.name,
        content: el.content,
        order: index + 1
      };

      if (variant === 'form') {
        return {
          ...el,
          order: index + 1
        };
      }

      return obj;
    });

    setValue(name, value, { shouldValidate: true });
  }, [setValue, name, variant])

  useEffect(() => {
    if (needUpdate) {
      onSave(fields)

      setNeedUpdate(false);
    }
  }, [needUpdate, fields, onSave]);

  useEffect(() => {
    if (lastItemRef.current && needScroll) {
      lastItemRef.current.scrollIntoView({ behavior: 'smooth' });

      setNeedScroll(false);
    }
  }, [needScroll]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ fieldState: { error } }) => (
        <>
          {variant === 'choice' ? (
            <DraggableChoiceVariant
              name={name}
              label={label}
              options={options}
              helperText={helperText}
              buttonLabel={buttonLabel}
              disableButton={disableButton}
              //
              fields={fields}
              onDragEnd={onDragEnd}
              onSave={onSave}
              onRemove={onRemove}
              //
              choiceDialog={choiceDialog}
              //
              actions={actions}
            />
          ) : (
            <DraggableFormVariant
              name={name}
              label={label}
              fieldOptions={fieldOptions}
              helperText={helperText}
              buttonLabel={buttonLabel}
              disableButton={disableButton}
              showElementOrder={showElementOrder}
              //
              fields={fields}
              onDragEnd={onDragEnd}
              onRemove={onRemove}
              onAdd={onAdd}
              onArrowKeyPressed={onArrowKeyPressed}
              //
              lastItemRef={lastItemRef}
              //
              actions={actions}
            />
          )}

          <FormHelperText
            error={!!(error?.message || error?.root?.message)}
          >
            {error?.message || error?.root?.message}
          </FormHelperText>
        </>
      )}
    />
  );
}

RHFDraggableField.propTypes = {
  variant: PropTypes.oneOf(['choice', 'form']),
  name: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    content: PropTypes.string
  })),
  fieldOptions: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string
  })),
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
  helperText: PropTypes.string,
  buttonLabel: PropTypes.string,
  disableButton: PropTypes.bool,
  showElementOrder: PropTypes.bool,
  actions: PropTypes.shape({
    disableAdd: PropTypes.bool,
    disableDelete: PropTypes.bool,
    disableMove: PropTypes.bool
  })
};
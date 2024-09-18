// ----------------------------------------------------------------------

export function formScheme(fields) {
  const scheme = {};

  fields.forEach(field => {
    const name = field.key || field.name;

    if (field.type === 'array') {
      scheme[name] = [{}];

      field.fields.forEach((f) => {
        scheme[name][0][f.name] = '';
      })
    } else if (field.type === 'language-field') {
      scheme[name] = {};

      field.langs.forEach((lang) => {
        const langFieldsScheme = formScheme(field.fields);

        scheme[name][lang.slug] = langFieldsScheme;
      });
    } else if (Object.hasOwn(field, 'fields')) {
      scheme[name] = {};

      field.fields.forEach((f) => {
        scheme[name][f.name] = '';
      });
    } else if (field.type === 'date-range') {
      scheme[name] = [null, null];
    } else if (field.type === 'toggle') {
      scheme[name] = false;
    } else if (field.type === 'upload') {
      if (Object.hasOwn(field, 'multiple')) {
        scheme[name] = field.multiple ? [] : null;
      } else {
        scheme[name] = null;
      }
    } else if (field.type === 'time-picker' || field.type === 'autocomplete') {
      scheme[name] = field?.defaultValue || null;
    } else if (field.type === 'image-select') {
      scheme[name] = [];
    } else {
      scheme[name] = '';
    }
  })

  return scheme;
}

export function getItemsForAddDeleteEdit(currentItems, newItems, selector = 'id') {
  const itemsForAdd = newItems.filter((item) => {
    if (selector in item) {
      const item_id = currentItems.find(id => id === item[selector]);

      return !item_id;
    }

    return true;
  });

  const itemsForDelete = currentItems.filter((item_id) => {
    const item = newItems.find(obj => selector in obj && obj[selector] === item_id);

    return !item;
  });

  const itemsForEdit = newItems.filter((item) => {
    if (selector in item) {
      const item_id = currentItems.find(id => id === item[selector]);

      return !!item_id;
    }

    return false;
  });

  return { itemsForAdd, itemsForDelete, itemsForEdit };
}
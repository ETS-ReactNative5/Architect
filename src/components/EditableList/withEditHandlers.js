import { connect } from 'react-redux';
import uuid from 'uuid';
import {
  compose,
  defaultProps,
  withHandlers,
} from 'recompose';
import {
  formValueSelector,
  change,
} from 'redux-form';

const mapStateToProps = (state, { form, fieldName, itemSelector, editField, template }) => {
  const items = formValueSelector(form)(state, fieldName);
  const itemCount = items ? items.length : 0;
  const item = itemSelector(state, { form, editField });
  const initialValues = item || { ...template(), id: uuid() };

  return {
    itemCount,
    initialValues,
  };
};

const mapDispatchToProps = (dispatch, { form }) => ({
  upsert: (fieldId, value) => dispatch(change(form, fieldId, value)),
});

const handlers = withHandlers({
  handleEditField: ({ setEditField }) =>
    fieldId => setEditField(fieldId),
  handleResetEditField: ({ setEditField }) =>
    () => setEditField(),
  handleAddNew: ({
    setEditField,
    itemCount,
    fieldName,
  }) =>
    () => {
      const newItemFieldName = `${fieldName}[${itemCount}]`;
      setEditField(newItemFieldName);
    },
  handleUpdate: ({
    upsert,
    setEditField,
    editField,
    normalize,
    onChange,
  }) =>
    (value) => {
      const newValue = onChange ? normalize(onChange(value)) : normalize(value);
      upsert(editField, newValue);
      setImmediate(() => {
        setEditField();
      });
    },
});

const withEditHandlers = compose(
  defaultProps({
    normalize: value => value,
    template: () => {},
    itemSelector: (state, { form, editField }) =>
      formValueSelector(form)(state, editField),
  }),
  connect(mapStateToProps, mapDispatchToProps),
  handlers,
);

export default withEditHandlers;

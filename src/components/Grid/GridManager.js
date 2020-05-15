import React from 'react';
import {
  compose,
  defaultProps,
  withState,
} from 'recompose';
import { Flipper } from 'react-flip-toolkit';
import PropTypes from 'prop-types';
import { Button } from '@codaco/ui/lib/components';
import { Section } from '@components/EditorLayout';
import InlineEditScreen from '@components/InlineEditScreen';
import { getFieldId, scrollToFirstIssue } from '../../utils/issues';
import ValidatedFieldArray from '../Form/ValidatedFieldArray';
import Grid from './Grid';
import withEditHandlers from './withEditHandlers';

const formName = 'editable-list-form';

const notEmpty = value => (
  value && value.length > 0 ? undefined : 'You must create at least one item'
);

const handleSubmitFail = (issues) => {
  scrollToFirstIssue(issues);
};

const GridManager = ({
  editField,
  disabled,
  contentId,
  children,
  validation,
  handleEditField,
  handleAddNew,
  handleUpdate,
  handleResetEditField,
  hasSpace,
  title,
  fieldName,
  capacity,
  initialValues,
  editComponent: EditComponent,
  previewComponent,
  itemCount,
  dispatch,
  itemSelector,
  items,
  normalize,
  setEditField,
  template,
  upsert,
  windowRoot,
  ...rest
}) => {
  const isEditing = !!editField;

  return (
    <Section disabled={disabled} contentId={contentId}>
      <Flipper
        flipKey={isEditing}
        portalKey="grid-manager"
      >
        <div id={getFieldId(`${fieldName}._error`)} data-name={fieldName} />
        {children}
        <div className="grid-manager">
          <div className="grid-manager__items">
            <ValidatedFieldArray
              name={fieldName}
              component={Grid}
              previewComponent={previewComponent}
              validation={validation}
              onEditItem={handleEditField}
              editField={editField}
              capacity={capacity}
              {...rest}
            />
          </div>
          { hasSpace &&
            <div className="grid-manager__add">
              <Button onClick={handleAddNew} size="small" icon="add">
                Add new item
              </Button>
            </div>
          }
        </div>
        <InlineEditScreen
          show={!!editField}
          initialValues={initialValues}
          flipId={editField}
          title={title}
          onSubmit={handleUpdate}
          onSubmitFail={handleSubmitFail}
          onCancel={handleResetEditField}
          form={formName}
        >
          <EditComponent
            {...rest}
            form={formName}
            fieldId={editField}
            onComplete={handleResetEditField}
          />
        </InlineEditScreen>
      </Flipper>
    </Section>
  );
};

GridManager.propTypes = {
  form: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  fieldName: PropTypes.string.isRequired,
  contentId: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
  previewComponent: PropTypes.any.isRequired,
  editComponent: PropTypes.any.isRequired,
  validation: PropTypes.object,
};

GridManager.defaultProps = {
  disabled: false,
  contentId: null,
  children: null,
  title: null,
  validation: { notEmpty },
};

const withDefaultFieldName = defaultProps({
  fieldName: 'items',
});

const withEditingState = withState('editField', 'setEditField', null);

export { GridManager };

export default compose(
  withDefaultFieldName,
  withEditingState,
  withEditHandlers,
)(GridManager);

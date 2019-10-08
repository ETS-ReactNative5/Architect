import { connect } from 'react-redux';
import { change, formValueSelector } from 'redux-form';
import { compose, withHandlers, lifecycle } from 'recompose';
import { getVariables, getVariableOptions, asOption } from '@selectors/codebook';
import { actionCreators as codebookActions } from '@modules/protocol/codebook';

const mapStateToProps = (state, { form, type, entity }) => {
  const variables = getVariables(state, { subject: { type, entity }, includeDraft: true });
  const variablesAsOptions = variables.map(asOption());
  const variable = formValueSelector(form)(state, 'variable');
  const variableOptions = getVariableOptions(state, { includeDraft: true, id: variable });

  return {
    variable,
    variableOptions: variablesAsOptions,
    optionsForVariable: variableOptions,
  };
};

const mapDispatchToProps = {
  changeForm: change,
  deleteVariable: codebookActions.deleteVariable,
};

const variableOptions = connect(mapStateToProps, mapDispatchToProps);

// Fix to keep redux 'sub-form' fields in sync
const updateFormVariableOptions = lifecycle({
  componentDidUpdate(previousProps) {
    const {
      changeForm,
      form,
      optionsForVariable,
      variable,
    } = this.props;
    if (previousProps.variable === variable) { return; }
    changeForm(form, 'variableOptions', optionsForVariable);
  },
});

const variableHandlers = withHandlers({
  handleCreateNewVariable: ({ closeNewVariableWindow, changeForm, form }) =>
    (variable) => {
      changeForm(form, 'variable', variable);
      closeNewVariableWindow();
    },
  handleDeleteVariable: ({
    entity,
    type,
    deleteVariable,
    changeForm,
    form,
    variable: selectedVariable,
  }) =>
    (variable) => {
      const variableDeleted = deleteVariable(entity, type, variable);
      if (variableDeleted && variable === selectedVariable) {
        changeForm(form, 'variable', null);
      }
    },
});

const withPromptProps = compose(
  variableOptions,
  updateFormVariableOptions,
  variableHandlers,
);

export default withPromptProps;

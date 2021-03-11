import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { omit } from 'lodash';
import { actionCreators as stageActions } from '@modules/protocol/stages';

const mapDispatchToProps = {
  updateStage: stageActions.updateStage,
  createStage: stageActions.createStage,
};

const stageEditorHanders = withHandlers({
  onSubmit: ({
    id, insertAtIndex, updateStage, createStage, onComplete,
  }) => (stage) => {
    const normalizedStage = omit(stage, '_modified');

    if (id) {
      updateStage(id, normalizedStage);
    } else {
      createStage(normalizedStage, insertAtIndex);
    }

    onComplete();
  },
});

const withStageEditorHandlers = compose(
  connect(null, mapDispatchToProps),
  stageEditorHanders,
);

export default withStageEditorHandlers;

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { get } from 'lodash';
import React from 'react';
import window from '../../ui/components/window';
import Stage from '../../network-canvas/src/containers/Stage';

const Preview = ({ stage, promptIndex }) => (
  <div className="preview">
    <div className="protocol">
      <div className="protocol__content">
        { stage &&
          <Stage stage={stage} promptId={promptIndex} />
        }
      </div>
    </div>
  </div>
);

Preview.defaultProps = {
  promptIndex: 0,
};

const mapStateToProps = (state, props) => {
  const stage = get(state, ['protocol', 'stages', 0]); // TODO: get Stage index from state
  const promptIndex = state.sessions[state.session].promptIndex;

  if (!stage) { return {}; }

  return {
    stage,
    promptIndex,
  };
};

export default compose(
  connect(mapStateToProps),
  window,
)(
  Preview,
);
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@codaco/ui/lib/components';
import Codebook from '@components/Codebook/Codebook';
import Screen from '@components/Screen/Screen';
import Layout, { Section } from '@components/EditorLayout';

/**
 * This component acts as an index for types. i.e. Nodes and Edges,
 * and links to the EditType.
 */
class CodebookScreen extends Component {
  handleCancel = this.props.onComplete;

  render() {
    const {
      show,
      transitionState,
      onComplete,
    } = this.props;

    const buttons = [
      <Button
        key="done"
        onClick={onComplete}
        iconPosition="right"
        icon="arrow-right"
      >
        Return to Timeline
      </Button>,
    ];

    return (
      <Screen
        show={show}
        buttons={buttons}
        transitionState={transitionState}
        onAcknowledgeError={this.handleCancel}
      >
        <Layout>
          <Section>
            <h1>
              Codebook
            </h1>
            <p>
              Below you can find an overview of the node and edge types that you have
              defined while creating your interview. Entities that are unused may be deleted.
            </p>
          </Section>
          <Codebook />
        </Layout>
      </Screen>
    );
  }
}

CodebookScreen.propTypes = {
  show: PropTypes.bool,
  transitionState: PropTypes.string,
  onComplete: PropTypes.func,
};

CodebookScreen.defaultProps = {
  show: true,
  transitionState: null,
  onComplete: () => {},
};
// const mapDispatchToProps = dispatch => ({
//   deleteType: bindActionCreators(codebookActions.deleteType, dispatch),
//   openDialog: bindActionCreators(dialogsActions.openDialog, dispatch),
// });

export { CodebookScreen };

export default CodebookScreen;

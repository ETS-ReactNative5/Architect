import React, { PureComponent } from 'react';
import { withState, compose } from 'recompose';
import Guidance from '../Guidance';
import DetachedField from '../DetachedField';
import { Toggle } from '../../ui/components/Fields';
import Form from './Form';
import QuickAdd from './QuickAdd';
import Section from './Section';
import { withSubjectNodeType } from '../EditableList';

class FormWithQuickAdd extends PureComponent {
  render() {
    const {
      quickAddEnabled,
      nodeType,
    } = this.props;

    const disabled = !nodeType;

    return (
      <React.Fragment>
        <Guidance contentId="guidance.editor.quickAdd">
          <Section disabled={disabled} compactNext>
            <h2>Quick Add</h2>
            <p>Should this stage use the quick add function?</p>
            <div className="stage-editor-section-form">
              <DetachedField
                component={Toggle}
                value={quickAddEnabled}
                onChange={() => this.props.setQuickAddEnabled(!quickAddEnabled)}
                label="Enable the quick add function"
              />
            </div>
          </Section>
        </Guidance>
        { quickAddEnabled && <QuickAdd {...this.props} disabled={disabled} /> }
        { !quickAddEnabled && <Form {...this.props} disabled={disabled} /> }
      </React.Fragment>
    );
  }
}

const withQuickAddEnabled = withState('quickAddEnabled', 'setQuickAddEnabled', false);

export { FormWithQuickAdd };

export default compose(
  withSubjectNodeType,
  withQuickAddEnabled,
)(FormWithQuickAdd);

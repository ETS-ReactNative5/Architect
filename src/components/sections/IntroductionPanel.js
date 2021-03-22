import React from 'react';
import { FormSection } from 'redux-form';
import TextField from '@codaco/ui/lib/components/Fields/Text';
import { Field as RichTextField, MODES } from '@components/RichText';
import { Section, Row } from '@components/EditorLayout';
import { ValidatedField } from '../Form';
import IssueAnchor from '../IssueAnchor';

const Name = () => (
  <Section>
    <FormSection name="introductionPanel">
      <h2>Introduction Panel</h2>
      <p>
        This panel is shown prior to completion of the forms,
        and should serve as an introduction to the task.
      </p>
      <Row>
        <IssueAnchor
          fieldName="introductionPanel.title"
          description="Title (Introduction panel)"
        />
        <ValidatedField
          name="title"
          label="Title"
          component={TextField}
          maxLength="50"
          validation={{ required: true }}
        />
      </Row>
      <Row>
        <IssueAnchor
          fieldName="introductionPanel.text"
          description="Text (Introduction panel)"
        />
        <ValidatedField
          name="text"
          label="Introduction text"
          component={RichTextField}
          validation={{ required: true }}
          mode={MODES.full}
        />
      </Row>
    </FormSection>
  </Section>
);

export default Name;

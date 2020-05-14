import React from 'react';
import { FormSection } from 'redux-form';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { Section } from '@components/EditorLayout';
import { getFieldId } from '../../utils/issues';
import { ValidatedField } from '../Form';

const NarrativeBehaviours = () => (
  <Section contentId="guidance.editor.narrative_behaviours">
    <h2>Narrative Behaviours</h2>
    <FormSection name="behaviours">
      <div id={getFieldId('freeDraw')} data-name="Free draw" />
      <h4>Free-draw</h4>
      <ValidatedField
        name="freeDraw"
        label="Allow drawing on the canvas."
        component={Fields.Checkbox}
      />

      <div id={getFieldId('allowRepositioning')} data-name="Allow repositioning" />
      <h4>Allow repositioning</h4>
      <ValidatedField
        name="allowRepositioning"
        label="Allow repositioning of nodes."
        component={Fields.Checkbox}
      />
    </FormSection>
  </Section>
);

export default NarrativeBehaviours;

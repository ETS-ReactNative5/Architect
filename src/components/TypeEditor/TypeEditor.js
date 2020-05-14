import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { Section } from '@components/EditorLayout';
import { getFieldId } from '../../utils/issues';
import * as ArchitectFields from '../Form/Fields';
import { ValidatedField } from '../Form';
import IconOption from './IconOption';
import getPalette from './getPalette';
import Variables from './Variables';

const ICON_OPTIONS = [
  'add-a-person',
  'add-a-place',
];

const TypeEditor = ({
  form,
  entity,
  type,
  displayVariables,
  isNew,
}) => {
  const { name: paletteName, size: paletteSize } = getPalette(entity);

  return (
    <div className="stage-editor">
      <div className="stage-heading">
        <div className="stage-heading__name">
          { type ? `Edit ${entity}` : `Create ${entity}` }
        </div>
        <div className="stage-heading__meta">
          {type}
        </div>
      </div>

      <Section>
        <h3 id={getFieldId('name')}>{entity} Type</h3>
        <p>
          What type of {entity} is this?
          { entity === 'node' && ' Some examples might be "Person", "Place", or "Agency".' }
          { entity === 'edge' && ' Some examples might be "Friend" or "Colleague".' }
        </p>
        <ValidatedField
          component={Fields.Text}
          name="name"
          validation={{ required: true }}
        />
      </Section>

      <Section>
        <h2 id={getFieldId('color')}>Color</h2>
        <p>
          Choose a color for this {entity} type.
        </p>
        <ValidatedField
          component={ArchitectFields.ColorPicker}
          name="color"
          palette={paletteName}
          paletteRange={paletteSize}
          validation={{ required: true }}
        />
      </Section>

      { entity === 'node' &&
        <React.Fragment>
          <Section>
            <h2 id={getFieldId('iconVariant')}>Icon</h2>
            <p>
              Choose an icon to display on interfaces that create this {entity}.
            </p>
            <ValidatedField
              component={Fields.RadioGroup}
              name="iconVariant"
              options={ICON_OPTIONS}
              optionComponent={IconOption}
              validation={{ required: true }}
            />
          </Section>

          {!isNew &&
            <Section>
              <h2>Display Variable</h2>
              <p>
                Select a variable to use as a label when displaying this {entity}.
              </p>
              <Field
                component={ArchitectFields.Select}
                name="displayVariable"
                options={displayVariables}
              >
                <option value="">&mdash; Select display variable &mdash;</option>
              </Field>
            </Section>
          }
        </React.Fragment>
      }

      {!isNew &&
        <Section>
          <Variables
            form={form}
            name="variables"
            sortableProperties={['name', 'type']}
            initialSortOrder={{
              direction: 'asc',
              property: 'name',
            }}
          />
        </Section>
      }
    </div>
  );
};

TypeEditor.propTypes = {
  type: PropTypes.string,
  entity: PropTypes.string.isRequired,
  form: PropTypes.string.isRequired,
  displayVariables: PropTypes.array.isRequired,
  isNew: PropTypes.bool,
};

TypeEditor.defaultProps = {
  type: null,
  colorOptions: { node: [], edge: [] },
  isNew: false,
};

export { TypeEditor };

export default TypeEditor;

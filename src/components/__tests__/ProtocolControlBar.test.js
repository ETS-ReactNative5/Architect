/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import { ProtocolControlBar } from '../ProtocolControlBar';

const mockProps = {
  hasUnsavedChanges: false,
  hasAnyStages: false,
  saveProtocol: () => {},
};

describe('<ProtocolControlBar />', () => {
  it('can render', () => {
    const component = shallow(<ProtocolControlBar {...mockProps} />);

    expect(component).toMatchSnapshot();
  });

  it('Shows protocol bar if there are unsaved changes', () => {
    expect(
      shallow(<ProtocolControlBar {...mockProps} hasUnsavedChanges={false} />)
        .prop('show'),
    ).toBe(false);

    expect(
      shallow(<ProtocolControlBar {...mockProps} hasUnsavedChanges />)
        .prop('show'),
    ).toBe(true);
  });
});

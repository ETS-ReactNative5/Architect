/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import TypeEditor from '../TypeEditor';

const mockProps = {
  dirty: false,
  valid: true,
  handleSubmit: () => {},
  displayVariables: [],
  form: 'TYPE_EDITOR',
  toggleCodeView: () => {},
  showCodeView: true,
};

describe('<TypeEditor />', () => {
  it('can render for node', () => {
    const subject = shallow(<TypeEditor {...mockProps} category="node" />);
    expect(subject).toMatchSnapshot();
  });

  it('can render for edge', () => {
    const subject = shallow(<TypeEditor {...mockProps} category="edge" />);
    expect(subject).toMatchSnapshot();
  });

  it('it renders the correct sections for a node', () => {
    const subject = shallow(<TypeEditor {...mockProps} category="node" />);

    expect(subject.containsAllMatchingElements([
      <h2>Color</h2>,
      <h2>Icon</h2>,
      <h2>Display Variable</h2>,
      <h2>Variables</h2>,
    ])).toBe(true);
  });

  it('it renders the correct sections for an edge', () => {
    const subject = shallow(<TypeEditor {...mockProps} category="edge" />);

    expect(subject.containsAllMatchingElements([
      <h2>Color</h2>,
      <h2>Variables</h2>,
    ])).toBe(true);

    expect(subject.containsAllMatchingElements([
      <h2>Icon</h2>,
      <h2>Display Variable</h2>,
    ])).toBe(false);
  });
});
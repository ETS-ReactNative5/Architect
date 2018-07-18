import React from 'react';
import { Icon } from '../../ui/components';

const NewButton = props => (
  <div className="items-new-button" {...props}>
    <Icon name="add" />
  </div>
);

export { NewButton };

export default NewButton;

import React from 'react';
import { Icon } from '../../ui/components';

const DeleteButton = props => (
  <div className="items-delete-button" {...props}>
    <Icon name="delete" />
  </div>
);

export { DeleteButton };

export default DeleteButton;
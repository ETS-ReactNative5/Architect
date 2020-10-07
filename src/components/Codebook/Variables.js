import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, withHandlers, withStateHandlers, withProps } from 'recompose';
import { get, isString } from 'lodash';
import cx from 'classnames';
import { actionCreators as codebookActionCreators } from '@modules/protocol/codebook';
import { actionCreators as dialogActionCreators } from '@modules/dialogs';
import UsageColumn from './UsageColumn';
import ControlsColumn from './ControlsColumn';

const SortDirection = {
  ASC: Symbol('ASC'),
  DESC: Symbol('DESC'),
};

const reverseSort = direction =>
  (direction === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC);

const rowClassName = (index) => {
  const isEven = index % 2 === 0;
  return cx(
    'codebook__variables-row',
    {
      'codebook__variables-row--even': isEven,
      'codebook__variables-row--odd': !isEven,
    },
  );
};

const Heading = ({ children, name, sortBy, sortDirection, onSort }) => {
  const isSorted = name === sortBy;
  const newSortDirection = !isSorted ? SortDirection.ASC : reverseSort(sortDirection);
  const sortClasses = cx(
    'sort-direction',
    {
      'sort-direction--asc': sortDirection === SortDirection.ASC,
      'sort-direction--desc': sortDirection === SortDirection.DESC,
    },
  );

  return (
    <th
      className="codebook__variables-heading"
      onClick={() => onSort({ sortBy: name, sortDirection: newSortDirection })}
    >
      {children}
      {isSorted && <div className={sortClasses} />}
    </th>
  );
};

Heading.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortDirection: PropTypes.oneOf([SortDirection.ASC, SortDirection.DESC]).isRequired,
  onSort: PropTypes.func.isRequired,
};

const Variables = ({ variables, onDelete, sortBy, sortDirection, sort }) => {
  const headingProps = {
    sortBy,
    sortDirection,
    onSort: sort,
  };

  return (
    <div>
      <table className="codebook__variables">
        <thead>
          <tr className="codebook__variables-row codebook__variables-row--heading">
            <Heading name="name" {...headingProps}>Name</Heading>
            <Heading name="type" {...headingProps}>Type</Heading>
            <Heading name="component" {...headingProps}>Input control</Heading>
            <Heading name="usageString" {...headingProps}>Used In</Heading>
            <th />
          </tr>
        </thead>
        <tbody>
          {variables.map(({ id, name, component, type, inUse, usage }, index) => (
            <tr className={rowClassName(index)} key={id}>
              <td className="codebook__variables-column">{name}</td>
              <td className="codebook__variables-column">{type}</td>
              <td className="codebook__variables-column">{component}</td>
              <td className="codebook__variables-column codebook__variables-column--usage">
                <UsageColumn inUse={inUse} usage={usage} />
              </td>
              <td className="codebook__variables-column codebook__variables-column--controls">
                <ControlsColumn onDelete={onDelete} inUse={inUse} id={id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Variables.propTypes = {
  variables: PropTypes.array,
  onDelete: PropTypes.func,
  sortBy: PropTypes.string.isRequired,
  sortDirection: PropTypes.oneOf([SortDirection.ASC, SortDirection.DESC]).isRequired,
  sort: PropTypes.func.isRequired,
};

Variables.defaultProps = {
  variables: [],
  onDelete: () => {},
};

const withVariableHandlers = compose(
  connect(null, {
    openDialog: dialogActionCreators.openDialog,
    deleteVariable: codebookActionCreators.deleteVariable,
  }),
  withHandlers({
    onDelete: ({ deleteVariable, openDialog, entity, type, variables }) =>
      (id) => {
        const { name } = variables.find(v => v.id === id);

        openDialog({
          type: 'Warning',
          title: `Delete ${name}`,
          message: (
            <p>
              Are you sure you want to delete the variable called {name}? This cannot be undone.
            </p>
          ),
          onConfirm: () => { deleteVariable(entity, type, id); },
          confirmLabel: `Delete ${name}`,
        });
      },
  }),
);

const homogenizedProp = (item, prop) => {
  const v = get(item, prop, '');
  if (!isString(v)) { return v; }
  return v.toUpperCase();
};

const sortByProp = sortBy =>
  (a, b) => {
    const sortPropA = homogenizedProp(a, sortBy);
    const sortPropB = homogenizedProp(b, sortBy);
    if (sortPropA < sortPropB) { return -1; }
    if (sortPropA > sortPropB) { return 1; }
    return 0;
  };

const sort = sortBy =>
  list => list.sort(sortByProp(sortBy));

const reverse = (sortDirection = SortDirection.ASC) =>
  list => (sortDirection === SortDirection.DESC ? [...list].reverse() : list);

const withSort = compose(
  withStateHandlers(
    {
      sortBy: 'name',
      sortDirection: SortDirection.ASC,
    },
    {
      sort: () =>
        ({ sortBy, sortDirection }) => ({
          sortBy,
          sortDirection,
        }),
    },
  ),
  withProps(
    ({ sortBy, sortDirection, variables }) => ({
      variables: compose(
        reverse(sortDirection),
        sort(sortBy),
      )(variables),
    }),
  ),
);

export { Variables, withSort, Heading, rowClassName, SortDirection };

export default compose(
  withVariableHandlers,
  withSort,
)(Variables);

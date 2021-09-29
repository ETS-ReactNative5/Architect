import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import { motion } from 'framer-motion';
// import Fade from '@codaco/ui/lib/components/Transitions/Fade';
import window from '@codaco/ui/lib/components/window';
import { compose } from 'recompose';
import Button from '@codaco/ui/lib/components/Button';
import { Layout } from '@components/EditorLayout';
import Form from './Form';

const InlineEditScreen = ({
  show,
  form,
  submitForm,
  title,
  layoutId,
  onSubmit,
  onCancel,
  children,
  ...rest
}) => {
  const handleSubmit = useCallback(() => {
    submitForm(form);
  }, [form, submitForm]);

  if (!show) { return null; }

  return (
    <div className="inline-edit-screen" onClick={(e) => e.stopPropagation()}>
      <motion.div layoutId={layoutId} className="inline-edit-screen__container">
        <div className="inline-edit-screen__header">
          <h1>{title}</h1>
        </div>
        <div className="inline-edit-screen__content">
          <Layout>
            <Form
              form={form}
              onSubmit={onSubmit}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...rest}
            >
              {children}
            </Form>
          </Layout>
        </div>
        <div className="inline-edit-screen__controls">
          <Button onClick={onCancel} color="platinum">Cancel</Button>
          <Button onClick={handleSubmit} type="submit" icon="arrow-right" iconPosition="right">Save and Close</Button>
        </div>
      </motion.div>
    </div>
  );
};

InlineEditScreen.propTypes = {
  show: PropTypes.bool,
  form: PropTypes.string.isRequired,
  layoutId: PropTypes.string,
  title: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  children: PropTypes.node,
};

InlineEditScreen.defaultProps = {
  title: null,
  show: false,
  layoutId: null,
  children: null,
};

const mapDispatchToProps = {
  submitForm: submit,
};

export default compose(
  window,
  connect(null, mapDispatchToProps),
)(InlineEditScreen);

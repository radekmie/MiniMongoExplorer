import React         from 'react';
import { PropTypes } from 'react';

import shouldComponentUpdate from '../lib/shouldComponentUpdate';

const Textarea = ({ error, title, value, onChange }) =>
    <textarea className={`form-control${error ? ' form-error' : ''}`}
              rows="1"
              title={title}
              value={value}
              spellCheck={false}
              onChange={event => onChange(event.currentTarget.value)}
    />
;

Textarea.propTypes = {
    error:    PropTypes.bool.isRequired,
    value:    PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

export default shouldComponentUpdate((newProps, oldProps) => newProps.value !== oldProps.value)(Textarea);

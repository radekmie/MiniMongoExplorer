import React         from 'react';
import { PropTypes } from 'react';

import Textarea from './Textarea';

import translations from '../assets/translations/en';

const Query = ({ error, query, onQuery }) =>
    <section className="form-group">
        <Textarea error={error}  title={translations.ui.query}  value={query}  onChange={onQuery} />
    </section>
;

Query.propTypes = {
    error: PropTypes.bool.isRequired,
    query: PropTypes.string.isRequired,
    onQuery: PropTypes.func.isRequired
};

export default Query;

import React         from 'react';
import { PropTypes } from 'react';

import Textarea from './Textarea';

import translations from '../assets/translations/en';

const Query = ({ tab, onQuery, onSort }) =>
    <section className="form-group">
        <Textarea error={tab.errorQuery} title={translations.ui.query} value={tab.query} onChange={onQuery} />
        <Textarea error={tab.errorSort}  title={translations.ui.sort}  value={tab.sort}  onChange={onSort}  />
    </section>
;

Query.propTypes = {
    tab: PropTypes.object.isRequired,
    onSort:  PropTypes.func.isRequired,
    onQuery: PropTypes.func.isRequired
};

export default Query;

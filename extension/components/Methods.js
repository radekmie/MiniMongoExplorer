import React         from 'react';
import { PropTypes } from 'react';

import translations from '../assets/translations/en';

const Methods = ({ methods }) =>
    <section className="pane pane-scroll">
        <table className="table-striped">
            <thead>
                <tr>
                    <td className="text-center"><b>{translations.methods.name}</b></td>
                </tr>
            </thead>

            <tbody>
                {methods.map(method =>
                    <tr key={method}>
                        <td>
                            <code>{method}</code>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </section>
;

Methods.propTypes = {
    methods: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default Methods;

import React           from 'react';
import { PropTypes }   from 'react';
import ObjectInspector from 'react-object-inspector';

import translations from '../assets/translations/en';

const Table = ({ data }) =>
    <section className="pane">
        <table className="table-striped">
            <thead>
                <tr>
                    <td className="text-center"><b>{translations.table.name}</b></td>
                    <td className="text-center"><b>{translations.table.ready}</b></td>
                    <td className="text-center"><b>{translations.table.params}</b></td>
                </tr>
            </thead>

            <tbody>
                {Object.keys(data)
                    .sort((a, b) => data[a].name.localeCompare(data[b].name))
                    .map(subscription =>
                        <tr key={subscription}>
                            <td>
                                {data[subscription].name}
                            </td>
                            <td className="text-center">
                                {data[subscription].ready
                                    ? translations.ui.yes
                                    : translations.ui.no
                                }
                            </td>
                            <td>
                                <ObjectInspector data={data[subscription].params} />
                            </td>
                        </tr>
                    )
                }
            </tbody>
        </table>
    </section>
;

Table.propTypes = {
    data: PropTypes.object.isRequired
};

export default Table;

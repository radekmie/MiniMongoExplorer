import React               from 'react';
import { PropTypes }       from 'react';
import { ObjectInspector } from 'react-inspector';

import translations from '../assets/translations/en';

const Subscriptions = ({ data }) =>
    <section className="pane pane-scroll">
        <table className="table-striped">
            <thead>
                <tr>
                    <td className="text-center"><b>{translations.subscriptions.name}</b></td>
                    <td className="text-center"><b>{translations.subscriptions.ready}</b></td>
                    <td className="text-center"><b>{translations.subscriptions.params}</b></td>
                </tr>
            </thead>

            <tbody>
                {Object.keys(data).sort((a, b) => data[a].name.localeCompare(data[b].name)).map(subscription =>
                    <tr key={subscription}>
                        <td>
                            <code>{data[subscription].name}</code>
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
                )}
            </tbody>
        </table>
    </section>
;

Subscriptions.propTypes = {
    data: PropTypes.object.isRequired
};

export default Subscriptions;

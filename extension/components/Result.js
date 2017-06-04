import React               from 'react';
import { PropTypes }       from 'react';
import { TableInspector }  from 'react-inspector';
import { ObjectInspector } from 'react-inspector';

import theme from '../lib/theme';

const columns = data => {
    for (let property in data) {
        return Object.keys(data[property]).filter(column => column !== '_id');
    }
};

const Result = ({ data, mode }) =>
    <section className="pane-scroll">
        {mode === 0 && (
            <ObjectInspector data={data} expandLevel={1} theme={theme} />
        )}

        {mode === 1 && (
            <section>
                <TableInspector data={data} columns={columns(data)} theme={theme} />
            </section>
        )}

        {mode === 2 && (
            <pre>
                {JSON
                    .stringify(data, null, 4)
                    .replace(/[\u00A0-\u9999<>\&]/gim, char => `&#${char.charCodeAt(0)};`)
                }
            </pre>
        )}
    </section>
;

Result.propTypes = {
    data: PropTypes.object.isRequired,
    mode: PropTypes.number.isRequired
};

export default Result;

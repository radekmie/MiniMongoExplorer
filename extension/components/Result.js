import React           from 'react';
import { PropTypes }   from 'react';
import ObjectInspector from 'react-object-inspector';

const Result = ({ data, isTextMode }) =>
    <section className="pane-scroll">
        {isTextMode
            ? <pre>{JSON.stringify(data, null, 4).replace(/[\u00A0-\u9999<>\&]/gim, char => `&#${char.charCodeAt(0)};`)}</pre>
            : <ObjectInspector initialExpandedPaths={['root']} data={data} />
        }
    </section>
;

Result.propTypes = {
    data: PropTypes.object.isRequired,
    isTextMode: PropTypes.bool.isRequired,
};

export default Result;

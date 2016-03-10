import { Component }     from 'react';
import { createElement } from 'react';

export default predicate => component =>
    class _ extends Component {
        static displayName = component.name;

        shouldComponentUpdate (props) {
            return predicate(props, this.props);
        }

        render () {
            return createElement(component, this.props, this.context);
        }
    }
;

import React from 'react';

import translations from '../translations/en';

import shouldComponentUpdate from '../lib/shouldComponentUpdate';

const Help = () =>
    <section className="pane">
        <section className="pane-group">
            <section className="pane pane-center pane-flex">
                <section className="nav-group">
                    <span className="nav-group-item"><i className="icon icon-left" /> {translations.sidebar.hide}</span>
                    <span className="nav-group-item"><i className="icon icon-right" /> {translations.sidebar.show}</span>
                    <span className="nav-group-item"><i className="icon icon-play" /> {translations.reactivity.enable}</span>
                    <span className="nav-group-item"><i className="icon icon-stop" /> {translations.reactivity.disable}</span>
                    <span className="nav-group-item"><i className="icon icon-lifebuoy" /> {translations.help.toggle}</span>
                    <span className="nav-group-item"><i className="icon icon-quote" /> {translations.text.enable}</span>
                    <span className="nav-group-item"><i className="icon icon-newspaper" /> {translations.text.disable}</span>
                    <span className="nav-group-item"><i className="icon icon-arrows-ccw" /> {translations.ui.refresh}</span>
                    <span className="nav-group-item"><i className="icon icon-cancel" /> {translations.ui.close}</span>
                </section>
            </section>
        </section>
    </section>
;

export default shouldComponentUpdate(() => false)(Help);

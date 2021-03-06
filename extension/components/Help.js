import React, { Component } from 'react';

import translations from '../assets/translations/en';

export default class Help extends Component {
    shouldComponentUpdate = () => false;

    render = () =>
        <section className="pane">
            <section className="pane-group">
                <section className="pane pane-center pane-flex">
                    <section className="nav-group">
                        <span className="nav-group-item"><i className="icon icon-left" /> {translations.sidebar.hide}</span>
                        <span className="nav-group-item"><i className="icon icon-right" /> {translations.sidebar.show}</span>
                        <span className="nav-group-item"><i className="icon icon-play" /> {translations.reactivity.enable}</span>
                        <span className="nav-group-item"><i className="icon icon-stop" /> {translations.reactivity.disable}</span>
                        <span className="nav-group-item"><i className="icon icon-lifebuoy" /> {translations.help.toggle}</span>
                        <span className="nav-group-item"><i className="icon icon-cloud-thunder" /> {translations.subscriptions.toggle}</span>
                        <span className="nav-group-item"><i className="icon icon-direction" /> {translations.methods.toggle}</span>
                        <span className="nav-group-item"><i className="icon icon-newspaper" /> {translations.mode[0]}</span>
                        <span className="nav-group-item"><i className="icon icon-menu" /> {translations.mode[1]}</span>
                        <span className="nav-group-item"><i className="icon icon-quote" /> {translations.mode[2]}</span>
                        <span className="nav-group-item"><i className="icon icon-arrows-ccw" /> {translations.ui.refresh}</span>
                        <span className="nav-group-item"><i className="icon icon-cancel" /> {translations.ui.close}</span>
                    </section>
                </section>
            </section>
        </section>
    ;
}

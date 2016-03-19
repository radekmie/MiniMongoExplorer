let panelNeeded = true;
let panelNeededId = -1;
let panelNeededCheck = () =>
    panelNeeded && chrome.devtools.inspectedWindow.eval('!!Meteor.connection.status', isMeteor => {
        if (isMeteor) {
            chrome.devtools.panels.create('MiniMongoExplorer', 'images/icon64.png', 'panel.html', () => {
                clearInterval(panelNeededId);

                panelNeeded   = false;
                panelNeededId = false;
            });
        }
    })
;

panelNeededId = setInterval(panelNeededCheck, 1000);

chrome.devtools.network.onNavigated.addListener(panelNeededCheck);

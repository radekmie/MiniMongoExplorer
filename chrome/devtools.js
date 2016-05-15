let panelNeeded = true;
let panelNeededId = -1;
let panelNeededCheck = () =>
    panelNeeded && chrome.devtools.inspectedWindow.eval('!!Meteor.connection.status', isMeteor => {
        if (isMeteor && panelNeeded) {
            clearInterval(panelNeededId);

            panelNeeded   = false;
            panelNeededId = false;

            chrome.devtools.panels.create('MiniMongoExplorer', 'images/icon64.png', 'panel.html');
        }
    })
;

panelNeededId = setInterval(panelNeededCheck, 100);

chrome.devtools.network.onNavigated.addListener(panelNeededCheck);

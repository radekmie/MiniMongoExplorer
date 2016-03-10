const ISODate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;

export default function (code) {
    return callback => chrome.devtools.inspectedWindow.eval(code, result =>
        callback
            ? callback(JSON.parse(result, (key, value) =>
                typeof value === 'string'
                    ? ISODate.test(value)
                        ? new Date(value)
                        : value
                    : value
            ))
            : undefined
    );
};

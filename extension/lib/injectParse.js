export const ISODate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
export default string =>
    JSON.parse(string, (key, value) =>
        typeof value === 'string'
            ? ISODate.test(value)
                ? new Date(value)
                : value
            : value
    )
;

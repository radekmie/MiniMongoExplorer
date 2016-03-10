import DocumentMatcher from 'marsdb/dist/DocumentMatcher';

const defaultMatch = () => true;

export default query => {
    try {
        const matcher = new DocumentMatcher(eval(`(${query})`));

        return {
            text:  query,
            error: false,
            match: doc => matcher.documentMatches(doc).result
        };
    } catch (_) {
        return {
            text:  query,
            error: true,
            match: defaultMatch
        };
    }
};

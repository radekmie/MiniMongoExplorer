import DocumentSorter from 'marsdb/dist/DocumentSorter';

const defaultMatch = () => 0;

export default sort => {
    try {
        const sorter = new DocumentSorter(eval(`(${sort})`));

        return {
            text:  sort,
            error: false,
            match: sorter.getComparator()
        };
    } catch (_) {
        return {
            text:  sort,
            error: true,
            match: defaultMatch
        };
    }
};

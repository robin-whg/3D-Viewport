export const sortByName = (arr) => {
    function compare(a, b) {
        if (a.name.substring(0, 5) < b.name.substring(0, 5))
            return -1;
        if (a.name.substring(0, 5) > b.name.substring(0, 5))
            return 1;
        return 0;
    }
    arr.sort(compare);
}

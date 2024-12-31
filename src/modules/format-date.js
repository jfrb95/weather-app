export const formatDate = {
    yyyyMmDd(date) {
        const yyyy = date.getFullYear();
        const mm = getCorrectMonth(date);
        const dd = date.getDate();
    
        return `${yyyy}-${mm}-${dd}`;
    
        function getCorrectMonth(date) {
            return date.getMonth() + 1;
        }
    }
}
import router from './router'
import store from './store'

/**
 * Take new parameters and update store.state
 * Then push state to history
 * @param {params} params { view, month, date}
 * @returns {promise}
 */
function pushState(params) {
    return new Promise (resolve => {
        // overwrite current state
        store.state.params = params;

        // push state
        router.push({
            path: `/params`,
            query: params
        });

        resolve(params);
    });
}

/**
 * Switch to a proper view => update state & history
 * @param {number} view integrer representing the view [0-2] 
 * @returns {promise}
 */
function setView(view) {
    return new Promise( resolve => {    
        resolve(pushState(normalizeParams({ ...store.state.params, view})));
    });
}

/**
 * Set month => update state & history
 * @param {number} month integrer representing month [0-11]
 * @returns {promise}
 */
function setMonth(month) {
    return new Promise( resolve => {    
        resolve(pushState(normalizeParams({ ...store.state.params, month })));
    });
}

/**
 * Set date => update state & history
 * @param {number} date integrer representing date [1-31]
 * @returns {promise}
 */
function setDate(date) {
    return new Promise( resolve => {    
        resolve(pushState(normalizeParams({ ...store.state.params, date })));
    });
}

/**
 * Set full date => update state & history
 * @param {number} month integrer representing month [0-11]
 * @param {number} date integrer representing full date [1-31]
 * @returns {promise}
 */
function setFullDate(month, date) {
    return new Promise(resolve => {
        resolve(pushState(normalizeParams({ ...store.state.params, month, date })));
    });
}

/**
 * Normalize query params
 * @param {object} 
 * @return {object} normalized params
 */
function normalizeParams({ view, month, date }) {
    let current = new Date(),
        currentMonth = current.getMonth() + 1,
        currentDate = current.getDate();

    // check if params are Numbers and within sane ranges
    // it's enough to generate a valid date and set a view
    if (Number.isNaN(parseInt(view)) || view < 0) view = 0;
    if (view > store.state.limit || view.length > 1) view = 2;
    if (Number.isNaN(parseInt(month)) || month.length > 2 || month > 11 || month < 1) month = currentMonth;
    if (Number.isNaN(parseInt(date)) || date.length > 2 || date > 31 || date < 1) date = currentDate;

    // generate valid date, aka normalize date params
    // adjusting month to fit Date constructor (moths starts with 0 for Jan)
    let holiday = new Date(2018, month - 1, date);

    // assign valid values back to query params
    month = holiday.getMonth() + 1;
    date = holiday.getDate();

    return { view, month, date };
}

export { pushState, setView, setMonth, setDate, setFullDate, normalizeParams };
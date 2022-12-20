const objToArr = (object) => Object.entries(object).map(item => ({[item[0]]: item[1]}));
export default objToArr;
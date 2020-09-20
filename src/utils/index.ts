export const datetimeTimestamp = () => {
    let timestamp: string = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    return timestamp; 
}

export const validateEmailAddress = s => {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(s); 
}

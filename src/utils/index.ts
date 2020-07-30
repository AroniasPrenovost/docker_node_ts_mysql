export const datetimeTimestamp = () =>{
    let timestamp: string = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    return timestamp; 
}

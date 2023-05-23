export  function converteData (date:any){
    const offsetInMs = date.getTimezoneOffset() * 60 * 1000;
    const adjustedDate = new Date(date.getTime() - offsetInMs);
    return adjustedDate.toISOString().slice(0, -1);
  
}

export function toLocalISOString(date:any, startOfDay = true, addDays = 1) {
    const offsetInMs = date.getTimezoneOffset() * 60 * 1000;
    const adjustedDate = new Date(date.getTime() - offsetInMs);
    
    if (addDays !== 0) {
        adjustedDate.setDate(adjustedDate.getDate() + addDays);
    };

    if (startOfDay) {
        adjustedDate.setUTCHours(0, 0, 0, 0);
    } else {
        adjustedDate.setUTCHours(23, 59, 59, 999);
    };
    
    return adjustedDate.toISOString().slice(0, -1);
}

export function formatDateToDb(date:any) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

};


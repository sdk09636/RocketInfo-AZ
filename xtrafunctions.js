module.exports.convertDate = (date) => {
    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds().toString().padStart(2, '0');;
    const timeZone = date.toString().match(/\((.*?)\)/)[1];
    return [`${day} ${month} ${year}`, `${hours}:${minutes}:${seconds}`, `${timeZone}`]
};


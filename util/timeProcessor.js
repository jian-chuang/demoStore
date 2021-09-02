exports.timeFormat = function (date, format = 'YYYY-MM-DD HH:mm:ss') {
    return moment(date).format(format);
}
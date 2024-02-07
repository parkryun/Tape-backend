const getAlarm = `
    SELECT 
    * 
    FROM 
    tape_alarm 
    WHERE user_id = ?;
`

module.exports = {
    getAlarm: getAlarm
}
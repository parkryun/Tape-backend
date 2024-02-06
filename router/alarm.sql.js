const getAlarm = `
    SELECT 
    * 
    FROM 
    tape_alarm 
    WHERE id = ?;
`

module.exports = getAlarm
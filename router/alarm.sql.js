const getAlarm = `
    SELECT 
    ta.tape_id, ta.type as alarmType, ta.created_at as alarmTime, ta.is_cheked, 
    u1.nickname AS receivedNickname, u2.nickname AS receiverNickname 
    FROM tape_alarm AS ta
    JOIN User AS u1 ON ta.user_id = u1.id 
    JOIN User AS u2 ON ta.receiver_id = u2.id 
    WHERE ta.user_id = ?;
`

module.exports = {
    getAlarm: getAlarm
}
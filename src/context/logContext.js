import React, {createContext} from 'react'
import downloadCsv from 'download-csv';

export const LogContext = createContext();

export default function LogContextProvider(props) {

    const logs = [];

    function addLog(text) {
        const currentDate = new Date();
        const dateTime = '[' + currentDate.getDate() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear() + '@' + currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds() + ']';

        const data = { time: dateTime, log: text};
        console.log(data)

        logs.push(data);
    }

    function downloadLogs() {
        const columns = { time: "time", log: "log"};
        console.log(logs)
        downloadCsv(logs, columns);
    }

    return (
        <LogContext.Provider value={{ addLog, downloadLogs }}>
            {props.children}
        </LogContext.Provider>
    )
}
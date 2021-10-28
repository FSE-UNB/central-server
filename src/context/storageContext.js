import React, {createContext, useEffect, useState} from 'react'

export const StorageContext = createContext();

export default function StorageContextProvider(props) {

    const [devices, setDevices] = useState([])

    useEffect(() => {
        let tmp = localStorage.getItem('devices');
        if (tmp) {
            console.log(tmp)
            tmp = JSON.parse(tmp);
            tmp = Array.isArray(tmp) ? tmp : [tmp];
            setDevices(tmp);
        }
    }, [])

    function addDevice(device) {
        devices.push(device);
        localStorage.setItem('devices', JSON.stringify(devices));
        console.log(devices);
        setDevices(devices);
    }

    function updateDevice(updatedDevice) {
        const deviceIndex = devices.findIndex((device) => device.esp_id === updatedDevice.esp_id);

        if (deviceIndex >= 0) {
            devices[deviceIndex] = updatedDevice;
            localStorage.setItem('devices', JSON.stringify(devices));
            setDevices(devices);
            console.log(devices);
        }
    }

    function updateDeviceTime(esp_id) {
        const deviceIndex = devices.findIndex((device) => device.esp_id === esp_id);

        if (deviceIndex >= 0) {
            devices[deviceIndex].updateDeviceTime();
            localStorage.setItem('devices', JSON.stringify(devices));
            setDevices(devices);
        }
    }

    function getDevices() {
        let tmp = localStorage.getItem('devices');
        if (tmp) {
            tmp = JSON.parse(tmp);
            tmp = Array.isArray(tmp) ? tmp : [tmp];
            return tmp;
        }
        return devices;
    }

    function removeDevice(esp_id) {
        const deviceIndex = devices.findIndex((device) => device.esp_id === esp_id);

        if (deviceIndex >= 0) {
            devices.splice(deviceIndex, 1);
            localStorage.setItem('devices', JSON.stringify(devices));
            setDevices(devices);
        }
    }

    return (
        <StorageContext.Provider value={{ devices, getDevices, addDevice, updateDevice, updateDeviceTime, removeDevice }}>
            {props.children}
        </StorageContext.Provider>
    )
}
import React, {createContext, useEffect} from 'react'
import Device from '../models/device';

export const StorageContext = createContext();

export default function StorageContextProvider(props) {
    useEffect(() => {
        let devices = localStorage.getItem('devices');
        if (devices) {
            devices = JSON.parse(devices);
            devices = Array.isArray(devices) ? devices : [devices];
        }
    }, [])

    function addDevice(device) {
        console.log(device)
        let devices = getDevices();
        const foundIndex = devices.findIndex(devc => devc.esp_id === device.esp_id);
        console.log(foundIndex)

        if (foundIndex >= 0) {
            console.log('ta entrando aqui po')
            updateDevice({
                esp_id: devices[foundIndex].esp_id,
                place: "",
                input_name: "",
                has_alarm: false,
                output_name: "",
                is_dimmable: false
            });
            return;
        }
        devices.push(device);
        localStorage.setItem('devices', JSON.stringify(devices));
    }

    function updateDevice(updatedDevice) {
        let devices = getDevices();
        const deviceIndex = devices.findIndex((device) => device.esp_id === updatedDevice.esp_id);

        if (deviceIndex >= 0) {
            console.log('entrou aqui tmb')
            devices[deviceIndex] = updatedDevice;
            localStorage.setItem('devices', JSON.stringify(devices));
        }
    }

    function updateDeviceTime(esp_id) {
        let devices = getDevices();
        const deviceIndex = devices.findIndex((device) => device.esp_id === esp_id);

        if (deviceIndex >= 0) {
            const device = Object.assign(new Device(), devices[deviceIndex]);
            device.updateDeviceTime();
            devices[deviceIndex] = device.getBody();
            localStorage.setItem('devices', JSON.stringify(devices));
        }
    }

    function updateDeviceValue(esp_id, value) {
        let devices = getDevices();
        const deviceIndex = devices.findIndex((device) => device.esp_id === esp_id);

        if (deviceIndex >= 0) {
            const device = Object.assign(new Device(), devices[deviceIndex]);
            device.updateValue(value);
            devices[deviceIndex] = device.getBody();
            localStorage.setItem('devices', JSON.stringify(devices));
        }
    }

    function updateDeviceTemp(esp_id, temp) {
        let devices = getDevices();
        const deviceIndex = devices.findIndex((device) => device.esp_id === esp_id);

        if (deviceIndex >= 0) {
            const device = Object.assign(new Device(), devices[deviceIndex]);
            device.updateTemp(temp);
            devices[deviceIndex] = device.getBody();
            localStorage.setItem('devices', JSON.stringify(devices));
        }
    }

    function updateDeviceHumidity(esp_id, humidity) {
        let devices = getDevices();
        const deviceIndex = devices.findIndex((device) => device.esp_id === esp_id);

        if (deviceIndex >= 0) {
            const device = Object.assign(new Device(), devices[deviceIndex]);
            device.updateHumidity(humidity);
            devices[deviceIndex] = device.getBody();
            localStorage.setItem('devices', JSON.stringify(devices));
        }
    }

    function updateDeviceState(esp_id, state) {
        let devices = getDevices();
        const deviceIndex = devices.findIndex((device) => device.esp_id === esp_id);

        if (deviceIndex >= 0) {
            const device = Object.assign(new Device(), devices[deviceIndex]);
            device.updateState(state);
            devices[deviceIndex] = device.getBody();
            localStorage.setItem('devices', JSON.stringify(devices));
        }
    }

    function getDevices() {
        let devices = localStorage.getItem('devices');
        if (devices) {
            devices = JSON.parse(devices);
            devices = Array.isArray(devices) ? devices : [devices];
            return devices;
        }
        return [];
    }

    function findDevice(esp_id) {
        const devcs = getDevices();
        const devcIndex = devcs.findIndex(devc => devc.esp_id === esp_id);

        if (devcIndex >= 0) {
            const device = Object.assign(new Device(), devcs[devcIndex]);
            return device;
        }
        return -1;
    }

    function removeDevice(esp_id) {
        let devices = getDevices();
        const deviceIndex = devices.findIndex((device) => device.esp_id === esp_id);

        if (deviceIndex >= 0) {
            devices.splice(deviceIndex, 1);
            localStorage.setItem('devices', JSON.stringify(devices));
        }
    }

    return (
        <StorageContext.Provider value={{ findDevice, getDevices, addDevice, updateDevice, updateDeviceTime, removeDevice, updateDeviceTemp, updateDeviceHumidity, updateDeviceState, updateDeviceValue }}>
            {props.children}
        </StorageContext.Provider>
    )
}
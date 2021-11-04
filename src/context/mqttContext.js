import React, {createContext, useEffect, useContext, useState} from 'react'
import mqtt from 'mqtt'
import MqttBody from '../models/mqttBody';
import Device from '../models/device';
import EspInfo from '../models/espInfo';

import { StorageContext } from './storageContext';

export const MqttContext = createContext();

export default function MqttContextProvider(props) {

    const { getDevices, addDevice, updateDeviceTime, removeDevice, updateDeviceTemp, updateDeviceHumidity, updateDeviceState } = useContext(StorageContext);
    let client= mqtt.connect('mqtt://broker.hivemq.com:8000/mqtt');

    function publishMessage(topic, content) {
        client.publish(topic, content);
    }

    function subscribe(topic) {
        client.subscribe(topic);
    }

    useEffect(() => {

        client.subscribe('fse2021/0461/dispositivos/+');

        client.on('message', (topic, message) => {
            console.log(topic);
            if (message.includes('config') || message.includes('output')) return;

            const splitTopic = topic.split('/');

            if (splitTopic[2] === 'dispositivos') {
                const device = new Device(splitTopic[3]);
                addDevice(device.getBody());
            } else {
                const parsedMessage = JSON.parse(message.toString());
                const espInfo = new EspInfo(parsedMessage.esp_id, parsedMessage.value, splitTopic[3]);
                
                if (espInfo.type === "umidade") {
                    updateDeviceHumidity(espInfo.esp_id, espInfo.value);
                } else if (espInfo.type === "temperatura") {
                    updateDeviceTemp(espInfo.esp_id, espInfo.value);
                } else if (espInfo.type === "estado") {
                    updateDeviceState(espInfo.esp_id, espInfo.value);
                }
                updateDeviceTime(espInfo.esp_id);
            }
        });

        const interval = setInterval(() => {
            let devices = getDevices();
            devices = devices.filter(device => device.place.length);

            devices.forEach(device => {
                const now = new Date();

                const timeDifference = now - new Date(device.last_message);

                if (timeDifference >= 50000) {
                    console.log('deve desconectar device ' + device.esp_id);
                    const resetMsg = {
                        type: 'unconfig'
                    }
                    publishMessage('fse2021/0461/dispositivos/' + device.esp_id, JSON.stringify(resetMsg));
                    removeDevice(device.esp_id);
                }
            })
        }, 10000)

        return () => {
            clearInterval(interval);
        }

    }, [])

    return (
        <MqttContext.Provider value={{publishMessage, subscribe}}>
            {props.children}
        </MqttContext.Provider>
    )
}
import React from 'react';
import './index.css';
import Box from '../Box';
import alarmIcon from '../../assets/icons/alarm.svg'

export default function DeviceCard({ device }) {
    return (
        <Box style={{cursor: 'pointer', padding: 16}} className="lift-up">
            <p className="default-text">
                {device.output_name}
            </p>
            <p className="default-text">
                {device.input_name}
                {" "}
                {
                    device.state ? "On" : "Off"
                }
                {
                    device.has_alarm ? (
                        <img className="alarm-icon" src={alarmIcon} alt="Alarm Icon" />
                    ) : null
                }
            </p>
            {
                device.temp ? (
                    <p className="default-text">Temperatura: {device.temp} C</p>
                ) : null
            }
            {
                device.humidity ? (
                    <p className="default-text">Umidade: {device.humidity} %</p>
                ) : null
            }
        </Box>
    )
}
import React, {useContext, useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import { MqttContext } from '../../context/mqttContext';
import { StorageContext } from '../../context/storageContext';
import MqttBody from '../../models/mqttBody';
import Device from '../../models/device';
import Sidenav from '../Sidenav';
import Box from '../Box';
import './index.css';
import Button from '../Button';

export default function Page() {
    const {publishMessage, subscribe} = useContext(MqttContext);
    const [alarmState, setAlarmState] = useState(false);
    const {getDevices, updateDevice, devices} = useContext(StorageContext);
    const location = useLocation();
  
    useEffect(() => {
        let tmp = localStorage.getItem('alarmState');
        if (tmp) {
          setAlarmState(tmp);
        }

        const loc = location.pathname.substring(1);
        subscribe(`fse2021/0461/${loc}/+`);
    }, [])

    function handleAlarmButton() {
      localStorage.setItem('alarmState', !alarmState);
      setAlarmState(!alarmState);
    }
  
    function config() {
      const mqttBody = new MqttBody('config', 'quarto', undefined);
  
      console.log(mqttBody.getBody())
      console.log(JSON.stringify(mqttBody.getBody()))
  
      let device = getDevices()[0];
  
      device = Object.assign(new Device(), device);
  
      device.updateDevice({
        place: "quarto",
        input_name: "botao",
        has_alarm: false,
        output_name: "led",
        is_dimmable: true
      });
  
      updateDevice(device);
  
      publishMessage('fse2021/0461/dispositivos/' + device.esp_id, JSON.stringify(mqttBody.getBody()));
      subscribe('fse2021/0461/quarto/+');
    }
  
    return (
      <div className="page">
        <Sidenav/>
        <div className="use-section">
          <div className="buttons-section">
            <Button isSelected={alarmState} onClick={handleAlarmButton}>
              {
                alarmState ? 
                'Desligar sistema de alarme' :
                'Acionar sistema de alarme'
              }
            </Button>
            <Button>
              Novo dispositivo
            </Button>
          </div>
          <Box style={{height: "100%"}}>
            <div className="devices-section">

            </div>
          </Box>
        </div>
          {
            /*
            <Button isSelected onClick={() => config()} >config</Button>
            <Button onClick={() => publishMessage('fse2021/0461/dispositivos/' + getDevices()[0].esp_id, JSON.stringify({ type: 'output', value: 1.0 }))} >ligar led</Button>
            <Button onClick={() => publishMessage('fse2021/0461/dispositivos/'  + getDevices()[0].esp_id, JSON.stringify({ type: 'output', value: 0.5 }))} >ligar meio led</Button>
            <Button onClick={() => publishMessage('fse2021/0461/dispositivos/'  + getDevices()[0].esp_id, JSON.stringify({ type: 'output', value: 0.0 }))} >desligar led</Button>
            */
          }
      </div>
    );
}
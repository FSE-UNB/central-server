import React, {useContext, useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import { MqttContext } from '../../context/mqttContext';
import { StorageContext } from '../../context/storageContext';
import MqttBody from '../../models/mqttBody';
import Device from '../../models/device';
import Sidenav from '../Sidenav';
import Modal from '../Modal';
import Box from '../Box';
import Input from '../Input';
import Select from '../Select';
import Checkbox from '../Checkbox';
import places from '../../config/places.json';
import './index.css';
import Button from '../Button';
import DeviceCard from '../DeviceCard';

export default function Page() {
    const {publishMessage, subscribe} = useContext(MqttContext);
    const [alarmState, setAlarmState] = useState(false);
    const [newDevices, setNewDevices] = useState(false);
    const [configDeviceModal, setconfigDeviceModal] = useState(false);
    const {getDevices, updateDevice, findDevice} = useContext(StorageContext);
    const [availableDevices, setAvailableDevices] = useState([]);
    const location = useLocation();

    const [selectedDevice, setSelectedDevice] = useState(null);
    const [inputName, setInputName] = useState("");
    const [isDimmable, setIsDimmable] = useState(false);
    const [outputName, setOutputName] = useState("");
    const [startsAlarm, setStartsAlarm] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(places[0].code);

    const [error, setError] = useState("");

    const [configedDevices, setConfigedDevices] = useState([]);
    const [stateChange, setStateChange] = useState(false);
  
    useEffect(() => {
        let tmp = localStorage.getItem('alarmState');
        if (tmp) {
          setAlarmState(tmp);
        }

        const loc = location.pathname.substring(1);
        subscribe(`fse2021/0461/${loc}/+`);

        const interval = setInterval(() => {
          const devices = getDevices();
          const loc = location.pathname.substring(1);
          const configDevices = devices.filter(device => device.place === loc);
          console.log(configDevices)
          setConfigedDevices(configDevices);
        }, 1000);

        return () => {
          clearInterval(interval);
        }
    }, [])

    useEffect(() => {
      if (newDevices) {
        const devices = getDevices();
        const available = devices.filter(device => !device.place);
        setAvailableDevices(available);
      }
    }, [newDevices])

    useEffect(() => {
      const devices = getDevices();
      const loc = location.pathname.substring(1);
      const configDevices = devices.filter(device => device.place === loc);
      setConfigedDevices(configDevices);
    }, [stateChange])

    function handleAlarmButton() {
      localStorage.setItem('alarmState', !alarmState);
      setAlarmState(!alarmState);
    }

    function handleDeviceButton(esp_id) {
      setNewDevices(false);
      setconfigDeviceModal(true);
      setSelectedDevice(esp_id);
    }

    function closeConfig() {
      setInputName("");
      setIsDimmable(false);
      setOutputName("");
      setStartsAlarm(false);
      setSelectedPlace(places[0].code);
      setError("");
      setSelectedDevice(null);
      setconfigDeviceModal(false);
    }

    function configDevice() {
      if (!inputName.length || !outputName.length) {
        setError("Preencha todos os campos!");
        return;
      }
      const mqttBody = new MqttBody('config', selectedPlace, undefined);

      let device = findDevice(selectedDevice);

      if (device < 0) {
        setError("Erro ao configurar dispositivo!");
        return;
      }

      device = Object.assign(new Device(), device);

      device.updateDevice({
        place: selectedPlace,
        input_name: inputName,
        has_alarm: startsAlarm,
        output_name: outputName,
        is_dimmable: isDimmable
      })

      updateDevice(device);

      publishMessage(`fse2021/0461/dispositivos/${device.esp_id}`, JSON.stringify(mqttBody.getBody()));
      closeConfig();
      setStateChange();
    }
  
    return (
      <div className="page">
        <Modal show={newDevices} modalClose={() => setNewDevices(false)}>
          <h2>Dispositivos disponíveis</h2>
          {
            !availableDevices.length && (
              <p>Nenhum dispositivo está disponível para ser conectado</p>
            )
          }
          {
            availableDevices.map(device => (
              <Button key={device.esp_id} style={{ width: "100%", marginBottom: 20 }} onClick={() => handleDeviceButton(device.esp_id)}>
                {device.esp_id}
              </Button>
            ))
          }
        </Modal>
        <Modal show={configDeviceModal} modalClose={() => closeConfig()}>
          <div className="config-modal">
            <h2>Novo dispositivo</h2>
            <Input placeholder="Nome da entrada" value={inputName} setValue={setInputName} />
            <Checkbox label="Aciona alarme?" isSelected={startsAlarm} setSelected={() => setStartsAlarm(!startsAlarm)} />
            <Input placeholder="Nome da saída" value={outputName} setValue={setOutputName} />
            <Checkbox label="É dimerizável?" isSelected={isDimmable} setSelected={() => setIsDimmable(!isDimmable)} />
            <Select options={places} value={selectedPlace} setValue={setSelectedPlace} />
            <Button isSelected style={{marginTop: 24}} onClick={configDevice} >
              Salvar dispositivo
            </Button>
            {
              error.length ? (
                <span className="error-msg">{error}</span>
              ) : null
            }
          </div>
        </Modal>
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
            <Button onClick={() => setNewDevices(true)}>
              Adicionar dispositivo
            </Button>
          </div>
          <Box style={{height: "100%"}}>
            <div className="devices-section">
              {
                configedDevices.map(device => (
                  <DeviceCard key={device.esp_ip} device={device} />
                ))
              }
            </div>
          </Box>
        </div>
      </div>
    );
}
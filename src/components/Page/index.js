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
import Slider from '../Slider';
import { LogContext } from '../../context/logContext';

export default function Page() {
    const {publishMessage, subscribe} = useContext(MqttContext);
    const {getDevices, updateDevice, findDevice, updateDeviceValue, removeDevice} = useContext(StorageContext);
    const {downloadLogs, addLog} = useContext(LogContext);
 
    const [alarmState, setAlarmState] = useState(false);
    const [newDevices, setNewDevices] = useState(false);
    const [configDeviceModal, setconfigDeviceModal] = useState(false);
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

    const [deviceModal, setDeviceModal] = useState(false);
    const [deviceValueSlider, setdeviceValueSlider] = useState(0);
    const [deviceValueButton, setdeviceValueButton] = useState(0);
  
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

    function handleDeviceButton(device) {
      setNewDevices(false);
      setconfigDeviceModal(true);
      setSelectedDevice(device);
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
      if (!inputName.length || (!outputName.length && !selectedDevice.low_power)) {
        setError("Preencha todos os campos!");
        return;
      }
      const mqttBody = new MqttBody('config', selectedPlace, undefined);

      let device = findDevice(selectedDevice.esp_id);

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

    function selectDevice(device) {
      const foundDevice = findDevice(device.esp_id);
      setdeviceValueSlider(foundDevice.value * 100);
      setdeviceValueButton(foundDevice.value);
      setSelectedDevice(device);
      setDeviceModal(true);
    }

    function closeDeviceModal() {
      setSelectedDevice(null);
      setDeviceModal(false);
    }

    function updateSlider() {
      const value = deviceValueSlider / 100;
      const mqttBody = new MqttBody('output', undefined, value);

      updateDeviceValue(selectedDevice.esp_id, value);

      publishMessage(`fse2021/0461/dispositivos/${selectedDevice.esp_id}`, JSON.stringify(mqttBody.getBody()));
    }

    function updateButton() {
      const value = !deviceValueButton;
      setdeviceValueButton(value);
      const mqttBody = new MqttBody('output', undefined, value ? 1 : 0);

      updateDeviceValue(selectedDevice.esp_id, value ? 1 : 0);

      publishMessage(`fse2021/0461/dispositivos/${selectedDevice.esp_id}`, JSON.stringify(mqttBody.getBody()));
    }

    function resetDevice() {
      const resetMsg = {
        type: 'unconfig'
      }
      publishMessage('fse2021/0461/dispositivos/' + selectedDevice.esp_id, JSON.stringify(resetMsg));
      removeDevice(selectedDevice.esp_id);
      addLog(`Removing device ${selectedDevice.esp_id}`);
      setDeviceModal(false);
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
              <Button key={device.esp_id} style={{ width: "100%", marginBottom: 20 }} onClick={() => handleDeviceButton(device)}>
                {device.esp_id}
              </Button>
            ))
          }
        </Modal>
        <Modal show={configDeviceModal} modalClose={() => closeConfig()}>
          <div className="config-modal">
            <h2>Novo dispositivo</h2>
            <Input placeholder="Nome da entrada" value={inputName} setValue={setInputName} />
            <Checkbox  label="Aciona alarme?" isSelected={startsAlarm} setSelected={() => setStartsAlarm(!startsAlarm)} />
            { selectedDevice?.low_power ? null : <Input placeholder="Nome da saída" value={outputName} setValue={setOutputName} /> }
            { selectedDevice?.low_power ? null : <Checkbox label="É dimerizável?" isSelected={isDimmable} setSelected={() => setIsDimmable(!isDimmable)} /> }
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
        <Modal show={deviceModal} modalClose={() => closeDeviceModal()}>
          {
            selectDevice ? (
              <div style={{minWidth: 240}}>
                <h2>{selectedDevice?.output_name ? selectedDevice?.output_name : selectedDevice?.input_name }</h2>
                {
                  !selectedDevice?.low_power ?
                    selectedDevice?.is_dimmable ? (
                      <>
                        <Slider value={deviceValueSlider} onChange={setdeviceValueSlider} />
                        <Button style={{width: '100%', marginTop: 24}} onClick={updateSlider} isSelected >Atualizar</Button>
                      </>
                    ) : (
                      <Button style={{width: '100%'}} onClick={updateButton} isSelected={deviceValueButton}>{deviceValueButton ? 'Desligar' : 'Ligar'}</Button>
                    )
                  : null
                }
                <Button style={{width: '100%', marginTop: 10}} onClick={resetDevice}>Desconfigurar</Button>
              </div>
            ) : null
          }
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
            <div>
              <Button style={{marginRight: 12}} onClick={() => downloadLogs()}>
                Baixar logs
              </Button>
              <Button onClick={() => setNewDevices(true)}>
                Adicionar dispositivo
              </Button>
            </div>
          </div>
          <Box style={{height: "100%"}}>
            <div className="devices-section">
              {
                configedDevices.map(device => (
                  <DeviceCard key={device.esp_id} device={device} onClick={() => selectDevice(device)} />
                ))
              }
            </div>
          </Box>
        </div>
      </div>
    );
}
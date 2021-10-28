import React, {useContext, useEffect} from 'react'
import { MqttContext } from './context/mqttContext';
import { StorageContext } from './context/storageContext';
import logo from './logo.svg';
import MqttBody from './models/mqttBody';
import Device from './models/device';
import Button from './components/Button'
import './App.css';

function App() {
  const {publishMessage, subscribe} = useContext(MqttContext);
  const {getDevices, updateDevice} = useContext(StorageContext);

  useEffect(() => {
    const devices = getDevices();
    console.log(devices)
    devices.forEach(device => {
      if (device.place) {
        subscribe('fse2021/0461/' + device.place + '/+');
      }
    })
  }, [])

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
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Button isSelected onClick={() => config()} >config</Button>
        <Button onClick={() => publishMessage('fse2021/0461/dispositivos/' + getDevices()[0].esp_id, JSON.stringify({ type: 'output', value: 1.0 }))} >ligar led</Button>
        <Button onClick={() => publishMessage('fse2021/0461/dispositivos/'  + getDevices()[0].esp_id, JSON.stringify({ type: 'output', value: 0.5 }))} >ligar meio led</Button>
        <Button onClick={() => publishMessage('fse2021/0461/dispositivos/'  + getDevices()[0].esp_id, JSON.stringify({ type: 'output', value: 0.0 }))} >desligar led</Button>
      </header>
    </div>
  );
}

export default App;

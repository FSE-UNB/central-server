export default class Device {
    constructor(esp_id, low_power) {
        this.esp_id = esp_id;
        this.place = "";
        this.input_name = "";
        this.has_alarm = false;
        this.output_name = "";
        this.is_dimmable = false;
        this.last_message = new Date();
        this.low_power = low_power;

        this.temp = -1;
        this.humidity = -1;
        this.state = false;

        this.value = 0;
    }

    updateDevice({ place, input_name, has_alarm, output_name, is_dimmable }) {
        this.place = place;
        this.input_name = input_name;
        this.has_alarm = has_alarm;
        this.output_name = output_name;
        this.is_dimmable = is_dimmable;
        this.last_message = new Date();
    }

    updateDeviceTime() {
        this.last_message = new Date();
    }

    updateTemp(temp) {
        this.temp = temp;
    }

    updateHumidity(humidity) {
        this.humidity = humidity;
    }

    updateState() {
        this.state = !this.state;
    }

    updateValue(value) {
        this.value = value;
    }

    getBody() {
        return {
            esp_id: this.esp_id,
            place: this.place,
            input_name: this.input_name,
            has_alarm: this.has_alarm,
            output_name: this.output_name,
            is_dimmable: this.is_dimmable,
            last_message: this.last_message,
            low_power: this.low_power,
            temp: this.temp,
            humidity: this.humidity,
            state: this.state,
            value: this.value
        }
    }
}
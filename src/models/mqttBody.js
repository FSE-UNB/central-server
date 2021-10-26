export default class MqttBody {
    constructor(type, place, value) {
        this.type = type;
        this.place = place;
        this.value = value;
    }

    getBody() {
        return {
            type: this.type,
            place: this.place,
            value: this.value
        }
    }
}
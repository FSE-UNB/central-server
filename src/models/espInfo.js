export default class EspInfo {
    constructor(esp_id, value, type) {
        this.esp_id = esp_id;
        this.value = value;
        this.type = type;
    }

    getBody() {
        return {
            esp_id: this.esp_id,
            value: this.value,
            type: this.type
        }
    }
}
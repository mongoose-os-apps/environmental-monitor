/*
 *                                                 MONGOOSE ENVIRONMENTAL MONITOR
 * Ben Rockwood <benr@cuddletech.com>                                    12/25/17
 * 
 * DON'T FORGET TO SET YOUR I2C PINS IN THE MONGOOSE CONFIG!
 * Example:  `mos config-set i2c.scl_gpio=22 i2c.sda_gpio=23`
 * 
 * Please examine the README for helpful details on using this example.
 */

load('api_timer.js');
load('api_arduino_bme280.js');
load('api_arduino_ssd1306.js');

print(" ------------ Starting ENVIRONMENTAL MONITOR ----------------");

let bme_addr  = 0x77;		// I2C Address for BME280
let oled_addr = 0x3C;		// I2C Address for SSD1306

let temp_offset = 1;		// Degrees C to reduce temp value to correct for heating


let bme  = Adafruit_BME280.createI2C(bme_addr);
let oled = Adafruit_SSD1306.create_i2c(4 /* RST GPIO */, Adafruit_SSD1306.RES_128_64);

// Initialize the display. 
oled.begin(Adafruit_SSD1306.SWITCHCAPVCC, oled_addr, true /* reset */);
oled.display();

let showStr = function(d, str) {
  d.clearDisplay();
  d.setTextSize(2);
  d.setTextColor(Adafruit_SSD1306.WHITE);
  d.setCursor(d.width() / 4, d.height() / 4);
  d.write(str);
  d.display();
};

if (bme.begin() === 0) {
  showStr(oled, "NO SENSOR");
  print('ERROR: Cant find a sensor');
} else {

  Timer.set(5000 /* milliseconds */, true /* repeat */, function() {
    let tc = bme.readTemperature() - temp_offset;
    let tf = tc * 1.8 + 32;
    let o  = JSON.stringify(Math.round(tf)) + ' F';
    showStr(oled, o);
    print('Temp:', tc, '*C', 
          '(', tf, 'F)', 
          'H:', bme.readHumidity(), '%RH',
          'P:', bme.readPressure(), 'hPa');
  }, null);
}

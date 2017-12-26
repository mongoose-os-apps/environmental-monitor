#!/bin/bash

echo "----------------------------------------------------------------"
echo "Building:"
mos build --platform esp32 

echo "----------------------------------------------------------------"
echo "Flashing:"
mos flash 

echo "----------------------------------------------------------------"
echo "Setting I2C Pins:"
sleep 10 
mos config-set i2c.scl_gpio=22 i2c.sda_gpio=23 

echo "----------------------------------------------------------------"
echo "Starting Console:"
mos console


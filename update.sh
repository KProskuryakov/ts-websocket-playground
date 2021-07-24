#!/bin/bash
git pull
sudo cp saunterdev.service /etc/systemd/system/saunterdev.service
sudo systemctl daemon-reload
sudo systemctl restart saunterdev
sudo systemctl enable saunterdev
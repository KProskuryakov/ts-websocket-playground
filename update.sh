#!/bin/bash
git pull
sudo cp saunterdev.service /etc/systemd/system/saunterdev.service
sudo chown root:root /etc/systemd/system/saunterdev.service
sudo chmod 644 /etc/systemd/system/saunterdev.service
sudo systemctl daemon-reload
sudo systemctl restart saunterdev
sudo systemctl enable saunterdev
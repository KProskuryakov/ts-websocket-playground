#!/bin/bash
cd ..
nohup npm start > log.txt 2>&1 &
echo $! > pid

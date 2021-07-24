#!/bin/bash
nohup npm start > log.txt 2>&1 &
echo $! > pid

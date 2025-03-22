#!/bin/bash

# Activate your conda environment.
source activate verbi  #Important to source not activate

# Start your process with pm2.
# fastapi run ~/verbi/FastWhisperAPI/main.py --port 8091 --host 0.0.0.0 

uvicorn FastWhisperAPI.main:app --host 0.0.0.0 --port 5001 --log-level debug

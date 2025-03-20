#!/bin/bash

# Activate your conda environment.
source activate verbi  #Important to source not activate

# Start your process with pm2.
fastapi run ~/verbi/FastWhisperAPI/main.py --port 5001
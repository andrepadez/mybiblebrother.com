#!/bin/bash

# Activate your conda environment.
source activate mlx  #Important to source not activate

# Start your process with pm2.
mlx_audio.server --host 0.0.0.0 --port 3333
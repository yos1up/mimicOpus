#!/bin/bash

sox -v 0.75 Piano.mf.C2.aiff C2.wav silence -l 1 0.01 -60d trim 0 4
sox Piano.mf.E2.aiff E2.wav silence -l 1 0.01 -60d trim 0 4
sox Piano.mf.Ab2.aiff Ab2.wav silence -l 1 0.01 -60d trim 0 4
sox Piano.mf.C3.aiff C3.wav silence -l 1 0.01 -60d trim 0 4
sox -v 0.75 Piano.mf.E3.aiff E3.wav silence -l 1 0.01 -60d trim 0 4
sox Piano.mf.Ab3.aiff Ab3.wav silence -l 1 0.01 -60d trim 0 4
sox Piano.mf.C4.aiff C4.wav silence -l 1 0.01 -60d trim 0 4
sox Piano.mf.E4.aiff E4.wav silence -l 1 0.01 -60d trim 0 4
sox -v 0.6 Piano.mf.Ab4.aiff Ab4.wav silence -l 1 0.01 -60d trim 0 4
sox -v 1.2 Piano.mf.C5.aiff C5.wav gain -h silence -l 1 0.01 -60d trim 0 4
sox -v 0.95 Piano.mf.E5.aiff E5.wav silence -l 1 0.01 -60d trim 0 4
sox -v 1.6 Piano.mf.Ab5.aiff Ab5.wav gain -h silence -l 1 0.01 -60d trim 0 4
sox -v 1.6 Piano.mf.C6.aiff C6.wav gain -h silence -l 1 0.01 -60d trim 0 4

#!/bin/bash
ffmpeg -i in.jpg -vf scale=320:-1 out.png

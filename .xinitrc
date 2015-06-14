# for urxvt, this sources the .Xresources file which is used to customize urxvt and some other x windows programs
xrdb ~/.Xresources

# for swaping left ctrl and caps lock
xmodmap ~/.xmodmaprc

# remove the annoying bell sound
xset -b

# clipboard manager
parcellite -d -n &

# Randomly rotating wallpapers in every 15 minutes
~/startup_scripts/wallpaper.sh &

# Battery low notification
~/startup_scripts/batteryd.sh &

# Eye fitness
~/startup_scripts/eye_notify.sh &


# For unicode characters
export LC_ALL=en_US.UTF-8
export LANG="$LC_ALL" 

# Starting PulseAudio
/usr/bin/start-pulseaudio-x11 &

# this is to start i3 at login
i3

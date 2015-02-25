# Path to your oh-my-zsh installation.
export ZSH=$HOME/.oh-my-zsh

# Set name of the theme to load.
# Look in ~/.oh-my-zsh/themes/
# Optionally, if you set this to "random", it'll load a random theme each
# time that oh-my-zsh is loaded.
ZSH_THEME="ys"

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to disable bi-weekly auto-update checks.
DISABLE_AUTO_UPDATE="true"

# Uncomment the following line to change how often to auto-update (in days).
# export UPDATE_ZSH_DAYS=13

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# The optional three formats: "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
#plugins=(git)
plugins=(git zsh-syntax-highlighting)

source $ZSH/oh-my-zsh.sh

# User configuration

export PATH="/usr/local/sbin:/usr/local/bin:/usr/bin:/usr/bin/core_perl"
# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='mvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# ssh
# export SSH_KEY_PATH="~/.ssh/dsa_id"

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.
#
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"

# Using zsh in vi mode
bindkey -v

bindkey -M viins 'jk' vi-cmd-mode

bindkey '^R' history-incremental-search-backward

function zle-line-init zle-keymap-select {
    VIM_NORMAL_PROMPT="%{$fg_bold[red]%} [% NORMAL]% %{$reset_color%}"
    VIM_INSERT_PROMPT="%{$fg[magenta]%} [% INSERT]% %{$reset_color%}"
    RPS1="${${KEYMAP/vicmd/$VIM_NORMAL_PROMPT}/(main|viins)/$VIM_INSERT_PROMPT} $EPS1"
    zle reset-prompt
}

zle -N zle-line-init
zle -N zle-keymap-select

alias ssv="cmatrix -abl -u 2"

# Sets the Mail Environment Variable
MAIL=/var/spool/mail/shubham && export MAIL

# Ruby gems path
PATH=$PATH:/home/shubham/.gem/ruby/2.2.0/bin

PATH=$PATH:/home/shubham/.meteor

alias shnw="shutdown now"


ZSH_HIGHLIGHT_HIGHLIGHTERS=(main brackets pattern cursor line)

# Override highlighter colors
#ZSH_HIGHLIGHT_STYLES[default]=none
#ZSH_HIGHLIGHT_STYLES[unknown-token]=fg=009
#ZSH_HIGHLIGHT_STYLES[reserved-word]=fg=009,standout
#ZSH_HIGHLIGHT_STYLES[alias]=fg=white,bold
#ZSH_HIGHLIGHT_STYLES[builtin]=fg=white,bold
#ZSH_HIGHLIGHT_STYLES[function]=fg=white,bold
#ZSH_HIGHLIGHT_STYLES[command]=fg=white,bold
#ZSH_HIGHLIGHT_STYLES[precommand]=fg=white,underline
#ZSH_HIGHLIGHT_STYLES[commandseparator]=none
#ZSH_HIGHLIGHT_STYLES[hashed-command]=fg=009
#ZSH_HIGHLIGHT_STYLES[path]=fg=214,underline
#ZSH_HIGHLIGHT_STYLES[globbing]=fg=063
#ZSH_HIGHLIGHT_STYLES[history-expansion]=fg=white,underline
#ZSH_HIGHLIGHT_STYLES[single-hyphen-option]=none
#ZSH_HIGHLIGHT_STYLES[double-hyphen-option]=none
#ZSH_HIGHLIGHT_STYLES[back-quoted-argument]=none
#ZSH_HIGHLIGHT_STYLES[single-quoted-argument]=fg=063
#ZSH_HIGHLIGHT_STYLES[double-quoted-argument]=fg=063
#ZSH_HIGHLIGHT_STYLES[dollar-double-quoted-argument]=fg=009
#ZSH_HIGHLIGHT_STYLES[back-double-quoted-argument]=fg=009
#ZSH_HIGHLIGHT_STYLES[assign]=none

#Nice LS COLORS
export LS_COLORS="*.textile=38;5;106:ln=target:*.hs=38;5;159:*.ini=38;5;122:*.part=38;5;240:*.pid=38;5;160:*.pod=38;5;106:*.vim=1:*.git=38;5;197:*.urlview=38;5;85:*.dump=38;5;119:*.conf=1:*.md=38;5;184:*.markdown=38;5;184:*.h=38;5;81:*.rb=38;5;192:*.c=38;5;110:*.diff=42;38:*.yml=38;5;208:*.PL=38;5;160:*.csv=38;5;78:tw=33;1;38;5;208:*.chm=38;5;144:*.bin=38;5;249:*.sms=38;5;33:*.pdf=38;5;203:*.cbz=38;5;140:*.cbr=38;5;140:*.nes=38;5;160:*.mpg=38;5;38:*.ts=38;5;39:*.sfv=38;5;197:*.m3u=38;5;172:*.txt=38;5;192:*.log=38;5;190:*.bash=38;5;173:*.swp=38;5;241:*.swo=38;5;236:*.theme=38;5;109:*.zsh=38;5;173:*.nfo=38;5;220:mi=38;5;124:or=38;5;160:ex=33;1;38;5;148:ln=target:pi=38;5;126:ow=33;1;38;5;208:di=38;5;30:*.pm=33;1;38;5;197:*.pl=38;5;214:*.sh=38;5;113:*.patch=45;37:*.tar=38;5;118:*.tar.gz=38;5;119:*.zip=38;5;11:*.rar=38;5;160:*.tgz=38;5;11:*.7z=38;5;11:*.mp3=38;5;191:*.flac=33;1;38;5;166:*.mkv=33;1;38;5;115:*.avi=38;5;114:*.wmv=38;5;113:*.jpg=38;5;66:*.JPG=38;5;66:*.jpeg=38;5;67:*.png=38;5;68:*.pacnew=38;5;33:*.xz=38;5;118:*.iso=38;5;124:*.css=38;5;91:*.php=38;5;93:*.gitignore=38;5;240:*.tmp=38;5;244:*.py=38;5;41:*.rmvb=38;5;112:*.arj=38;5;11:*.a=38;5;59:*.a00=38;5;11:*.A64=38;5;82:*.pc=38;5;100:*.a52=38;5;112:*.gel=38;5;83:*.ggl=38;5;83:*.directory=38;5;83:*.a78=38;5;112:*.atr=38;5;213:*.j64=38;5;102:st=1;38;5;208:*.st=38;5;208:*.dat=38;5;165:*.db=38;5;60:*.xml=38;5;23:*.cdi=38;5;124:*.nrg=38;5;124:*.32x=38;5;137:*.gg=38;5;138:*.cue=38;5;112:*.adf=38;5;35:*.nds=38;5;193:*.gb=38;5;203:*.gbc=38;5;204:*.gba=38;5;205:*.sav=38;5;220:*.r00=38;5;233:*.r01=38;5;234:*.r02=38;5;235:*.r03=38;5;236:*.r04=38;5;237:*.r05=38;5;238:*.r06=38;5;239:*.r07=38;5;240:*.r08=38;5;241:*.r09=38;5;242:*.r10=38;5;243:*.r11=38;5;244:*.r12=38;5;245:*.r13=38;5;246:*.r14=38;5;247:*.r15=38;5;248:*.r16=38;5;249:*.r17=38;5;250:*.r18=38;5;251:*.r19=38;5;252:*.r20=38;5;253:*.r21=38;5;254:*.r22=38;5;255:*.r47=38;5;255:*.r47=38;5;233:*.r46=38;5;234:*.r45=38;5;235:*.r44=38;5;236:*.r43=38;5;237:*.r42=38;5;238:*.r41=38;5;239:*.r40=38;5;240:*.r39=38;5;241:*.r38=38;5;242:*.r37=38;5;243:*.r36=38;5;244:*.r35=38;5;245:*.r34=38;5;246:*.r33=38;5;247:*.r32=38;5;248:*.r31=38;5;249:*.r30=38;5;250:*.r29=38;5;251:*.r28=38;5;252:*.r27=38;5;253:*.r26=38;5;254:*.r25=38;5;255:*.json=38;5;199:*.SKIP=38;5;244:*.1p=38;5;160:*.3p=38;5;160"

# Replicating above LS_COLORS for zsh autocompletion
zstyle ':completion:*' list-colors ${(s.:.)LS_COLORS}

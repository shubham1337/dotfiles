set nocompatible

" for Pathogen
execute pathogen#infect()

filetype plugin indent on

set background=dark
colorscheme jellybeans

set tabstop=4 "sets tabwidth to 4 spaces
set shiftwidth=4 "sets tabwidth for indentation to 4 spaces

set laststatus=2 "Shows status bar for all files, using for Airline plugin

set autoindent
set smartindent

set ignorecase
set smartcase

set cursorline

set incsearch
set showcmd

set expandtab
set smarttab

set number "to show line numbers

syntax on "for syntax highlighting

"nnoremap ,, :noh<return><esc>

" for Auto complete plugin NeoComplCache
let g:neocomplcache_enable_at_startup = 1


" my Leader key
let mapleader = ','

" Code folding options
"nmap <leader>f0 :set foldlevel=0<CR>
"nmap <leader>f1 :set foldlevel=1<CR>
"nmap <leader>f2 :set foldlevel=2<CR>
"nmap <leader>f3 :set foldlevel=3<CR>
"nmap <leader>f4 :set foldlevel=4<CR>

"nmap <leader>f5 :set foldlevel=5<CR>
"nmap <leader>f6 :set foldlevel=6<CR>
"nmap <leader>f7 :set foldlevel=7<CR>
"nmap <leader>f8 :set foldlevel=8<CR>
"nmap <leader>f9 :set foldlevel=9<CR>

" For when you forget to sudo.. Really Write the file.
cmap w!! w !sudo tee % >/dev/null
"cmap x!! x !sudo tee % >/dev/null

" Visual shifting (does not exit Visual mode)
" vnoremap < <gv
" vnoremap > >gv

" Adding lines above and below
nmap <leader>o mzo<esc>`z
nmap <leader>O mzO<esc>`z
nmap <leader>J mzi<enter><esc>`z

nnoremap <leader>ev :vsplit $MYVIMRC<cr>
nnoremap <leader>sv :source $MYVIMRC<cr>

" add semicolon at the end of line
nnoremap <leader>; mzA;<esc>`z

" Block Wrapping Mappings
nnoremap dif "fyymfg_%kmgj"Fdd'fddmf='g'f
nnoremap yif "fyyg_%"Fyy%
nnoremap <leader>f g_%mf%"fpjdd'fP]}=%
nnoremap <leader>F g_%mf%"fPjdd'fp=%

nnoremap <leader>w :w<cr>
nnoremap <leader>x :x<cr>
nnoremap <leader>q :q<cr>
nnoremap <leader>e :w<cr>:!xdotool key Alt+Tab<cr><cr>


" experimental mapping register prefix
"nnoremap <expr> \p '$"'.v:register.v:count1.'p'
"nnoremap <expr> \P '0"'.v:register.v:count1.'P'


" Nifty changes to default vim
noremap j gj
noremap k gk
noremap 0 g0
noremap $ g$
noremap ^ g^
noremap U :redo<cr>
noremap Y y$
nnoremap R ebPldeb

inoremap jk <esc>

function! EnterCurly()
	if getline('.')[col('.')-1] == '}'
		execute "normal! O	"
	endif
endfunction
inoremap <Enter> <Enter><c-o>:<c-u>call EnterCurly()<cr>

noremap <leader><tab> <C-w><C-w>
noremap <C-k> <esc>:bprevious<cr>
noremap <C-j> <esc>:bnext<cr>

noremap <C-h> <esc>:tabprevious<cr>
noremap <C-l> <esc>:tabnext<cr>

" This will load a session if a session file exists in the project folder
" silent source! Session.vim

" source "C:/Program\ Files\ (x86)/Vim/vimfiles/vimCSSClassAdder.vim"
nnoremap <leader>c :call PutClassInCSS()<cr>



" Frequent Typos
iabbrev tehn then
iabbrev waht what
iabbrev teh the
iabbrev adn and
iabbrev si is



" Custom text objects
" :onoremap ih :<c-u>execute "normal! ?^==\\+$\r:nohlsearch\rkvg_"<cr>


" ParamTextObjects
onoremap i, :<c-u>execute "normal! ?\[({\\[,]\rlv/\[)}\\],]\rh"<cr>

function! ParamTextObject()
	execute "normal! ?\[({\\[,]\rlv/\[)}\\],]\r"
	if getline('.')[col('.')-1] == ','
		"execute "normal! l"
	elseif getline('.')[col('.')-1] == ')' || getline('.')[col('.')-1] == '}' || getline('.')[col('.')-1] == ']'
		execute "normal! oh"
	endif
endfunction
onoremap a, :<c-u>call ParamTextObject()<cr>

" text object for a code block INCLUDING the function/class Name and params
onoremap af :<c-u>execute "normal! $]}V%^"<cr>

"Function: Fuckk
"Desc: description
"
"Arguments:
"
function! Fuckk(hi, hhaha, josdf)
    
endfunction

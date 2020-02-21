

let mapleader=","
inoremap jk <esc>
nnoremap Y y$
nnoremap R de"rPb
nnoremap <leader>v :vs<cr>
nnoremap <leader>h :sp<cr>
nnoremap <tab> <C-W><C-W>
nnoremap <C-h> <C-W><Left>
nnoremap <C-l> <C-W><Right>
nnoremap <C-j> <C-W><Down>
nnoremap <C-k> <C-W><Up>
nnoremap <C-n> :bn<cr>
nnoremap <C-p> :bp<cr>
nnoremap <leader>n :NERDTreeToggle<cr>
nnoremap <leader>x :x<cr>
nnoremap <leader>q :q<cr>
nnoremap <leader>Q :q!<cr>
nnoremap <leader>w :w<cr>
nnoremap <leader>ev :e ~/.vimrc<cr>
nnoremap <leader>sv :source ~/.vimrc<cr>
nnoremap <leader>p :PlugInstall<cr>

nnoremap <leader>o :only<cr>
nnoremap <leader>b :buffers<cr>:b<space>
nnoremap <leader>g :Gstatus<cr>
nnoremap <leader>r :Rg<cr>
nnoremap <leader>f :Files<cr>

vnoremap * y/<C-r>"<cr>
vnoremap # y?<C-r>"<cr>
set ignorecase
set shiftwidth=2
set tabstop=2
set expandtab

syntax enable
set background=dark
"colorscheme solarized


"autocmd BufWritePost *.py call flake8#Flake8()

let g:ale_fixers = {
      \ 'javascript': ['eslint']
      \ }
let g:ale_fix_on_save = 1


" Specify a directory for plugins
" - For Neovim: stdpath('data') . '/plugged'
" - Avoid using standard Vim directory names like 'plugin'
call plug#begin('~/.vim/plugged')

" Make sure you use single quotes

" Shorthand notation; fetches https://github.com/junegunn/vim-easy-align
Plug 'junegunn/vim-easy-align'

" Any valid git URL is allowed
"Plug 'https://github.com/junegunn/vim-github-dashboard.git'

" Multiple Plug commands can be written in a single line using | separators
"Plug 'SirVer/ultisnips' | Plug 'honza/vim-snippets'

" On-demand loading
Plug 'scrooloose/nerdtree', { 'on':  'NERDTreeToggle' }
"Plug 'tpope/vim-fireplace', { 'for': 'clojure' }

" Using a non-master branch
Plug 'rdnetto/YCM-Generator', { 'branch': 'stable' }

" Using a tagged release; wildcard allowed (requires git 1.9.2 or above)
"Plug 'fatih/vim-go', { 'tag': '*' }

" Plugin options
"Plug 'nsf/gocode', { 'tag': 'v.20150303', 'rtp': 'vim' }

" Plugin outside ~/.vim/plugged with post-update hook
Plug 'junegunn/fzf', { 'dir': '~/.fzf', 'do': './install --all' }
Plug 'junegunn/fzf.vim'

Plug 'tpope/vim-sensible'
Plug 'tpope/vim-fugitive'
"Plug 'nvie/vim-flake8'
Plug 'w0rp/ale'

"Plug 'mcchrish/nnn.vim'

" Unmanaged plugin (manually installed and updated)
"Plug '~/my-prototype-plugin'

" Initialize plugin system
call plug#end()

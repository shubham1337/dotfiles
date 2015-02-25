
let g:CSSfile="css/style.css"
function! PutClassInCSS()
	let l:currentLine=getline(".")

	let l:currentClassString=matchstr(l:currentLine, "class=\"..*\"")
	let l:currentIdString=matchstr(l:currentLine, "id=\"..*\"")

	if l:currentClassString == "" && l:currentIdString == ""
		echo "Nothing to process"
	endif

	if l:currentIdString == ""
		let l:currentClassName=strpart(l:currentClassString, 7)
		let l:currentClassName=strpart(l:currentClassName, 0, strlen(l:currentClassName) - 1)
		let l:currentClassName=".".l:currentClassName
		call writefile([l:currentClassName, "{", "", "}"], g:CSSfile, "a")
		echo l:currentClassName." Written to ".g:CSSfile
	endif

	if l:currentClassString == ""
		let l:currentIdName=strpart(l:currentIdString, 4)
		let l:currentIdName=strpart(l:currentIdName, 0, strlen(l:currentIdName) - 1)
		let l:currentIdName="#".l:currentIdName
		call writefile([l:currentIdName, "{", "", "}"], g:CSSfile, "a")
		echo l:currentIdName." Written to ".g:CSSfile
	endif
endfunction

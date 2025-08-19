---
title: Linux
cover: /images/Linux.jpg
tags:
  - Berkeley
  - Study
  - CS198-008
categories:
  - Study
  - Berkeley
  - Notes
abbrlink: 15691
toc: true
---
# Shell
A command line-interface (CLI) to interact with the computer.
## Basic Commands
- `man`: Followed by a command, it shows the manual page for that command.
- `mv`: Move a file or directory.
- `rm`: Remove a file or directory.
- `cat`: Concatenate and **display** the content of a file.
- `fg`: resume a paused process.
- `bg`: run a process in the background.
- `jobs`: list all running processes.
## Tips
- When processing files, use `*` or `?` to represent multiple characters or a single character, respectively. (like `cat`, `rm`, `mv`, etc.)
- `Ctrl + D`: exit the shell.
- `Ctrl + Z`: to pause a process.
- `chmod +x filename`: make a file executable.

# Editors Usage
## Vim
  See the link [Vim](44303) for more details.
## Nano
- `Ctrl + X`: exit the editor.
- `Ctrl + G`: show the help menu.
- `Ctrl + K`: cut a line.
- `Ctrl + U`: paste a line.
- `Ctrl + W`: search a word.
- `Ctrl + Y`: move the cursor to the previous page. `Ctrl + V`: move the cursor to the next page. `Ctrl + A`: move the cursor to the beginning of the line. `Ctrl + E`: move the cursor to the end of the line.

# Shell Scripting
### Variables
- `$VAR` to output the value of VAR (Replace VAR with an expr is also allowed).
- `expr $VAR1 + $VAR2` to evaluate the expressions
- `read VAR` to read the input from the user and assign it to VAR
### Conditional Statements
- `if [ condition ]; then ... else ... fi`
### Loops
- `for VAR in $LIST; do ... done`
### File Operations
- `touch filename`: create a file.
- `echo "content" > filename`: write content to a file.
- `echo "content" >> filename`: append content to a file.
- `sed -i "/$VAR/d" filename`: delete a line containing VAR in the file.
- `grep "pattern" filename`: search for a pattern in a file and display it

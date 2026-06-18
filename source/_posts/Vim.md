---
title: Vim
cover: /images/Vim.jpeg
tags:
  - Vim
  - Editor
  - Linux
  - Command
categories:
  - Tools
  - Editor
abbrlink: 44303
date: 2024-09-22 01:06:44
---
## Mode Switching
- `i/a/o`: Enter insert mode (insert before, after, or on a new line).
- `Esc`: Exit insert mode and return to normal mode.
- `v`: Enter visual mode (highlight text).
- `V`: Enter visual line mode (highlight entire lines).
- `Ctrl + v`: Enter visual block mode (highlight blocks of text).
## File Operations
- `:w`: Save the file.
- `:wq`: Save and quit.
- `:q`: Quit the editor.
- `:q!`: Force quit without saving.
- `:set number`: Show line numbers.
- `:set nonumber`: Hide line numbers.
- `:e filename`: Open a file in Vim.
- `:r filename`: Insert the content of another file into the current file.
- `:! command`: Execute an external command (e.g., :!ls to list files).
## Cursor Movement
- `h/j/k/l`: Move the cursor left, down, up, and right.
- `b`: Move to the beginning of the current/previous word.
- `e`: Move to the end of the current/next word.
- `w`: Move to the beginning of the next word.
- `0`: Move to the beginning of the line.
- `$:` Move to the end of the line.
- `G`: Move to the end of the file.
- `gg`: Move to the beginning of the file.
- `Ctrl + f`: Scroll forward one page.
- `Ctrl + b`: Scroll backward one page.
- `H`: Move to the top of the screen.
- `M`: Move to the middle of the screen.
- `L`: Move to the bottom of the screen.
- `Ctrl + o`: Jump back to the previous cursor position.
- `Ctrl + i`: Jump forward to the next cursor position.
## Editing Operations
- `dd`: Delete a line.
- `d` motion: Delete text following a movement (e.g., dw to delete a word).
- `x`: Delete a character.
- `u`: Undo the last operation.
- `Ctrl + r`: Redo the last undone operation.
- `yy`: Copy (yank) a line.
- `y` motion: Copy text following a movement (e.g., yw to copy a word).
- `p`: Paste the copied or deleted text.
- `r`: Replace a single character under the cursor.
- `cw`: Change (delete and enter insert mode) a word.
- `ci`: Change inside quotes.
- `>>`: Indent a line.
- `<<:` Un-indent a line.
## Search and Replace
- `/pattern`: Search for a pattern.
- `?pattern`: Search for a pattern in reverse.
- `n`: Repeat the search in the same direction.
- `N`: Repeat the search in the opposite direction.
- `:%s/old/new/g`: Replace all occurrences of "old" with "new" in the file.
- `:noh`: Clear search highlighting.
## Buffer and Window Management
- `:bn`: Go to the next buffer.
- `:bp`: Go to the previous buffer.
- `:bd`: Close the current buffer.
- `:split`: Split the window horizontally.
- `:vsplit`: Split the window vertically.
- `Ctrl + w w`: Switch between windows.

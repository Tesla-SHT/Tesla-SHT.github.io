---
title: Hexo Wiki
abbrlink: 12c56117
date: 2025-02-14 23:34:45
tags: 
- Wiki
- Hexo
categories:
- Wiki
top: true
toc: true

---

# Prefix

- **abbrlink**: Automatically generated when the post is created. You can jump to another post like this: ```[Prefix in Hexo Blog](12c56117)``` to get the link of this post [Hexo Wiki](12c56117).

- **mathjax**: If you want to apply equations in your post, please add `mathjax: true` in the front.

- **cover**: The cover image of the post. You can add it by `cover: /images/xxx.jpg`.

- **toc**: Table of Contents. If you want to add a TOC in your post, please add `toc: true` in the front.

- **top**: If you want to make this post stay on the top of the blog, please add `top: true` in the front.

# Usage

- `hexo new [post/draft] [title]`: Create a new post or draft. The title should be enclosed in quotes if it contains spaces.

- `hexo clean`: Clean the cache files (db.json) and generated files (public).

- `hexo generate`: Can be simplified to `hexo g`. Generate static files.

- `hexo server`: Can be simplified to `hexo s`. Start the server (usually at `http://localhost:4000/`).

- Deploy the blog on Github Page: 
    - Configure the info in `_config.yml`:

        ```yaml
        deploy:
            type: git
            repo: [example: https://github.com/hexojs/hexojs.github.io]
            branch: main
            token: [Your Github Token]
            message: [Your commit message]
        ```

    - Type `hexo deploy` or `hexo d` in CLI and wait for several minutes.

# DIY

## Add Math Formula
To use math formulas in your Hexo blog, you can install the `hexo-renderer-markdown-it` package and configure it accordingly. Make sure to follow the installation instructions in the documentation [here](https://github.com/hexojs/hexo-renderer-markdown-it). 

In my own blog, the formula appears twice in different types, so I check `f12` and hide the `.katex-html` class. Hope it can help.
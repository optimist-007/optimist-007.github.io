# Simran Sainand Revankar — personal website

This repository contains the source for my research portfolio and Creative Side at https://optimist-007.github.io/.

## Site structure

- `index.html` — research homepage
- `projects.html` and `project.html` — research projects and case studies
- `blogs.html` — research journal and writing
- `publications.html` — publications
- `media.html` — research media
- `creative.html` — film, book and personal creative notes
- `collaborate.html` — collaboration information

## Content

Most page content is kept separately from the layouts so it can be updated without rebuilding the site structure:

- `content/home.json`
- `content/projects-site.json`
- `content/projects.json`
- `content/blogs.json`
- `content/publications.json`
- `content/creative-content.json`
- `content/creative-site.json`
- `content/media-library.json`
- `content/main-site.json`
- `content/site-theme.json`

## Styles and interactions

- `assets/home.css` — homepage styling
- `assets/research-readable.css` — shared research-page styling
- `assets/site-interactions.js` — shared interactions
- `media/` and `content/images/` — public media used by the site

The site is intentionally plain HTML, CSS and JavaScript so it remains easy to inspect, maintain and move between hosts.

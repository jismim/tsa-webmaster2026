# CareMap Morris

CareMap Morris is a community resource website for Morris County, New Jersey. It helps residents find local support services and helps community members discover ways to donate, volunteer, and give back.

## Main Pages

- `index.html` - Home page with map/search entry points and featured resources
- `directory.html` - Community resource directory
- `donate-volunteer.html` - Give Back page for donation and volunteer opportunities
- `submit.html` - Resource submission/contact page
- `bookmarks.html` - Saved resources page
- `about.html`, `highlights.html`, `works-cited.html` - Supporting content pages
- `admin/` - Admin-facing pages for reviewing submissions and site data

## Project Structure

```text
.
+-- admin/                  # Admin pages
+-- caremap-submissions-api/ # AWS Lambda/S3 submission API
+-- css/                    # Site stylesheets
+-- data/                   # JSON data used by the site
+-- images/                 # Site images and logo assets
+-- js/                     # Frontend JavaScript
+-- pdfs/                   # PDF documents
`-- *.html                  # Static site pages
```

## Running Locally

Most pages are static HTML/CSS/JS and can be opened directly in a browser.

For a local server, run one of these from the project root:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Editing Data

- Directory resources live in `data/directory.json` and are loaded through `js/resources.js`.
- Give Back opportunities are currently defined in `js/donate-volunteer.js`.
- Submission-related data appears in `data/resource-submissions.json` and admin scripts.

## Submission API

The `caremap-submissions-api/` folder contains a small Node/AWS Lambda API using the AWS SDK for S3.

```bash
cd caremap-submissions-api
npm install
```

The Lambda entry file is `index.mjs`.

## Notes

- The site uses shared global styling from `css/style.css`, with page-specific CSS files layered on top.
- Bookmark behavior is handled by `js/bookmarks.js`.
- Always confirm local nonprofit information before publishing updates, especially phone numbers, addresses, hours, and website links.

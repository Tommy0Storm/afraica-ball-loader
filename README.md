# afrAIca HubSpot Theme

Interactive ball loader and main website for afrAIca.co.za

## Structure

```
afrAIcaWeb-hubspot/
├── templates/
│   ├── ball-loader-page.html    # Landing page with ball loader
│   └── main-page.html           # Main website template
├── modules/
│   └── ball-loader/             # Interactive ball loader module
│       ├── module.html
│       └── meta.json
├── css/
│   ├── ball-loader.css          # Ball loader styles
│   └── styles/                  # Main website styles
├── js/
│   ├── ball-loader.js           # Ball animation logic
│   └── scripts/                 # Main website scripts
├── assets/                      # Images and other assets
├── hubspot.config.yml           # HubSpot configuration
└── package.json                 # Project configuration
```

## Ball Loader Features

- 25% smaller ball size
- Rigidity = 1 (perfect sphere)
- 5-second spin animation
- 3-second explosion effect
- Automatic redirect to main page
- Session storage integration

## Deploy to HubSpot

1. Configure your HubSpot credentials in `hubspot.config.yml`
2. Install HubSpot CLI: `npm install -g @hubspot/cli`
3. Upload to HubSpot: `hs upload --src . --dest /`

## Usage

1. Set ball-loader-page.html as your landing page
2. Set main-page.html as your main website template
3. Ball loader will automatically redirect to main page after sequence

Created for afrAIca PTY LTD
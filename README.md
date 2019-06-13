# TFS Monitor
A tool to monitor builds of a TFS instance.

This is a desktop application which monitors a Team Foundation Server and displays a list of recent builds.
The builds can be sorted and filtered, and you can open builds on the TFS's web UI, and open the drop location of builds.

## Why do I need this?
So, you have your TFS running with a some Team Projects on it. IMHO its very cumbersome to monitor the builds and releases
of all Team Projects in once place, since the web ui of TFS will only show one Team Project.

## Planned features
- Run in background as tray icon
- Display notifications when builds start or finish.
- Filter by age or outcome
- Display releases related to each build
- more to come...

# Technical stuff
This is a rewrite of https://github.com/praschl/TeamBuildMonitor which used the WCF api of TFS. The new REST api is much more
flexible, easier to use and has much more functionality, which will let me create more exciting features.

## Boilerplate used
https://github.com/electron-userland/electron-webpack + react + typescript

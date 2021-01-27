# ecs2console

Convert logs in ECS format to console readable output. 

## Install

``` bash
npm install
npm link
```

On MacOS the folder  `/usr/local` might not be writeable for the current user. You ccan change this by executing:
``` bash
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

## Usage

See if it works by running:
``` bash
more test/log.json | ecs2console
```

Only output logs with log level INFO or less:
``` bash
more test/log.json | ecs2console -l info
```

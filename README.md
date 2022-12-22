# ecs2console

Convert JSON log output in ECS (Elastic Common Schema) format to pretty console readable output. 

## Install

``` bash
npm install -g @sendungverpasst/ecs2console
```

On MacOS the folder  `/usr/local` might not be writeable for the current user. You can change this by executing:
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

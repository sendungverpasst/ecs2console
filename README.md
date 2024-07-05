# ecs2console

Convert JSON log output in ECS (Elastic Common Schema) format to pretty console readable output. 

## Install

Install `ecs2console` from npmjs:
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

## Development

Test if the package is installed from the local git repo or from the npm registry:
``` bash
npm ls --global
```
If the output contains a line like that says that your version of `ecs2console` is linked to your local git folder then you are fine:
``` bash
├── @sendungverpasst/ecs2console@1.0.0 -> ./../../../../../git/ecs2console
```

Otherwise delete the package installed from the npm registry and link you local version:
``` bash
npm uninstall -g @sendungverpasst/ecs2console
# link the current bin folder 
npm link . 
```

- if you have difficulties installing `emcc` compiler, just use docker image in `compiler` directory
```
$ cd compiler
$ docker build -t compiler .
$ cd ..
$ docker run --rm -v ${PWD}:/app -it compiler /bin/bash
app# yarn compile
app# exit
```
or simply call `yarn compile` otherwise

- to install npm dependencies: `yarn install`
- to start the app: `yarn start`

FROM ubuntu

RUN apt update
RUN apt install -y git python2.7 nodejs cmake default-jre xz-utils gnupg

RUN ln -s /usr/bin/python2.7 /usr/bin/python

RUN git clone https://github.com/juj/emsdk.git

WORKDIR emsdk

RUN git pull

# Download and install the latest SDK tools.
RUN ./emsdk install latest

# Make the "latest" SDK "active" for the current user. (writes ~/.emscripten file)
RUN ./emsdk activate latest

RUN apt-get install curl apt-transport-https
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ rc main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt update && apt-get install yarn

# RUN /bin/bash -c "source /emsdk/emsdk_env.sh"
RUN echo "source /emsdk/emsdk_env.sh" >> /etc/bash.bashrc

RUN mkdir -p /app
WORKDIR /app

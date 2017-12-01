FROM php:7.0-fpm

ENV WORKDIR "/var/www/app"
ENV USER "dev"

RUN apt-get update && apt-get install sudo

RUN apt-get update && apt-get install -qq -y \
    apt-transport-https \
    apt-utils

RUN apt-get update && apt-get install -qq -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl

RUN docker-php-ext-install pdo pdo_pgsql pgsql zip

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get update && apt-get install -qq -y --no-install-recommends nodejs yarn

RUN curl -sS https://getcomposer.org/installer | \
    php -- --install-dir=/usr/local/bin --filename=composer

RUN mkdir -p ${WORKDIR}

RUN groupadd -r ${USER} -g 1000 && \
    useradd -u 1000 -r -g ${USER} -m -d ${WORKDIR} -s /sbin/nologin -c "Dev user" ${USER} && \
    chmod 755 ${WORKDIR}

WORKDIR ${WORKDIR}

EXPOSE 9000

USER ${USER}

CMD ["php-fpm"]

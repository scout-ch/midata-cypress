FROM ruby:2.5 as base
ENV RAILS_ENV=development
ENTRYPOINT [ "/bin/entrypoint" ]
COPY ./app/waitfortcp /bin
WORKDIR /app

RUN apt-get update && apt-get install -y \
    graphviz \
    imagemagick \
 && rm -rf /var/lib/apt/lists/*

ARG hitobito_branch=master
ARG hitobito_youth_branch=master
ARG hitobito_pbs_branch=master

RUN git clone https://github.com/hitobito/hitobito.git && \
  git clone https://github.com/hitobito/hitobito_youth.git && \
  git clone https://github.com/hitobito/hitobito_pbs.git && \
  cd hitobito && git checkout $hitobito_branch && cd ../ && \
  cd hitobito_youth && git checkout $hitobito_youth_branch && cd ../ && \
  cd hitobito_pbs && git checkout $hitobito_pbs_branch


WORKDIR /app/hitobito
COPY ./app/database.yml config/database.yml
COPY ./cypress/config/initializers/cypress_on_rails.rb config/initializers/cypress_on_rails.rb
RUN cp Wagonfile.ci Wagonfile && bundle install && bundle add cypress-on-rails -v 1.5


####################################################################
FROM base as app
COPY ./app/entrypoint /bin/entrypoint
CMD [ "puma", "-e", "test", "-t", "0:1", "-p", "3000" ]

####################################################################
FROM base as worker
COPY ./worker/entrypoint /bin/entrypoint
CMD [ "rake", "jobs:work" ]

FROM ghcr.io/hitobito/development/rails:latest

COPY ./cypress/config/initializers/cypress_on_rails.rb config/initializers/cypress_on_rails.rb
COPY rails/cypress-entrypoint /usr/local/bin

ENTRYPOINT ["cypress-entrypoint"]
# Supprimez les lignes COPY deploy.sh et RUN chmod
# Mettez uniquement cette commande CMD tout à la fin :
CMD php artisan migrate:fresh --seed --force && php artisan serve --host=0.0.0.0 --port=10000
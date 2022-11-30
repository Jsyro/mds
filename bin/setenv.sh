#!/bin/bash
#========================================================================#
# MDS Dev Environment boilerplate setup
# Synopsis: Script used to deploy collection of boilerplate .env files for development on MDS
#========================================================================#
# Global config
# These values are checked for in validation
SERVICES_PATH="./services"
SERVICES="
core-web
core-api
nris-api/backend
document-manager/backend
filesystem-provider
minespace-web
tusd
"
if [ -z "$INPUT" ];
    then
        echo "This command can be destructive if you have valid .env's in place and run this multiple times!"
        echo "Continue? (only accepts 'yes')"
        read INPUT
fi

if [ "$INPUT" = "yes" ];
then
    for S in $SERVICES
    do
        echo "$SERVICES_PATH/$S/.env"
        [ ! -f "$SERVICES_PATH/$S/.env" ] || cp $SERVICES_PATH/$S/.env $SERVICES_PATH/$S/.env-last-backup
        cp $SERVICES_PATH/$S/.env-example $SERVICES_PATH/$S/.env

        # Replace localhost in env files with codespace name in generated env files
        # if running within github codespaces
        if [[ -n "$CODESPACE_NAME" ]]; then
            sed -i 's/http\:\/\/localhost/https\:\/\/'$CODESPACE_NAME'/g' $SERVICES_PATH/$S/.env
        fi
    done
    echo ".env files setup!"
else
    echo "Cancelled!"
fi

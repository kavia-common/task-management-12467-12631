#!/bin/bash
cd /home/kavia/workspace/code-generation/task-management-12467-12631/UIComponentsContainer
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi


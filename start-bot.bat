@echo off
:loop
node index.js
echo Le bot s'est arrêté. Redemarrage dans 5s...
timeout /t 5
goto loop

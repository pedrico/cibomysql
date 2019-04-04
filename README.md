# cibomysql
# crear un nuevo repositorio en github, luego ejecutar lo siguiente
# echo "# cibomysql" >> README.md
# git init
# git add README.md
# git commit -m "first commit"
# git remote add origin https://github.com/pedrico/cibomysql.git
# git push -u origin master
# ejecutar: npm init
# sudo npm install mysql --save
# sudo npm install express --save
# sudo npm install multer --save
# sudo npm install ng-file-upload --save
# sudo npm install body-parser --save
# sudo npm install express-session --save
# sudo npm install file-saver --save


# Instalar impresora
# Instalar el driver https://www.vichaunter.org/como-se-hace/instalar-epson-tm-t20ii-en-linux-mint-o-ubuntu
# Conceder permisos https://mike42.me/blog/2015-03-getting-a-usb-receipt-printer-working-on-linux
# Para lista el puerto que esta utilizando el dispositivo: ls /dev/usb
# Imprimir con el dispositivo, sustituir lp1 por el resultado del comando anterior: echo "Hello" >> /dev/usb/lp1
# Mostrar información del archivo, el cual nos muestra el id del grupo propietario (normalmente es lp): stat /dev/usb/lp1
# Agregar el usuario bob al grupo propietario lp: sudo usermod -a -G lp bob
# Ejecutar de nuevo: echo "Hello" >> /dev/usb/lp1

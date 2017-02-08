#fire up
cd server
npm install

cd ..
cd client
sudo npm install -g bower
bower install

cd ..
Install Mongobox 
https://github.com/bobthecow/vagrant-mongobox

cd ..
cd server

//start server
node server.js

npm install gulp --save
sudo npm install -g gulp
npm install --save-dev gulp-nodemon

cd ..
cd client
npm install gulp --save
npm install browser-sync --save-dev
sudo npm install -g browser-sync
npm install --save del
npm install --save gulp-uglify
npm install --save gulp-concat
npm install --save gulp-ng-annotate
npm install --save gulp-less gulp-minify-css
npm install main-bower-files
npm install --save gulp-sourcemaps

//start client
gulp

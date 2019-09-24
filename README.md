# BlobToolKit Viewer (v0.9)

 [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.1134794.svg)](https://doi.org/10.5281/zenodo.1134794)

BlobToolKit Viewer is a genome-scale dataset visualistion tool developed as part of the [blobtoolkit](http://blobtoolkit.genomehubs.org) project to allow browser-based identification and filtering of target and non-target data in genome assemblies.

We are running the BlobToolKit [insdc-pipeline](https://github.com/blobtoolkit/insdc-pipeline) on all public (INSDC registered) eukaryote genome assemblies and making the results available in an instance of this viewer at [blobtoolkit.genomehubs.org](http://blobtoolkit.genomehubs.org/view/).

## Quick start guide:

1. Install node/npm
```
conda create -n btk_viewer_env git nodejs
conda activate btk_viewer_env
```
Visit [conda.io](https://conda.io/docs/user-guide/install/index.html) for instructions on how to install/run conda on your system. For other ways to install node, search your preferred package manager or visit [nodejs.org](https://nodejs.org).

2. Install BlobToolKit Viewer
```
git clone https://github.com/blobtoolkit/viewer
cd viewer
npm install
```

If individual npm packages fail to install, you may be able to install a different version by installing the package directly, then continuing with the rest of the install, e.g.:

```
npm install fsevents
npm install
```

The installer will highlight known vulnerabilities in the dependencies, these are generally harmless when run on a local machine or private cluster but please note that the included dev server should not be used to host a public instance (see Production Build below).

3. Start BlobToolKit Viewer
- on Linux/OS X (start in a detached screen session)
```
cp .env.dist .env
screen -dmS btk_api npm run api
screen -dmS btk_client npm run client
```
- on Windows (start in separate anaconda prompts)
```
xcopy .env.dist .env
# select option to copy as file
npm start
```
In a new Anaconda prompt:
```
conda activate btk_viewer_env
npm run client
```

4. Visit site
```
http://localhost:8080/view/
```

5. If you have started BlobToolKit in a detached screen session, attach to the screen session and use `ctrl-c` to quit:
```
screen -r btk_api
# (press ctrl-c)
screen -r btk_client
# (press ctrl-c)
```

## Customisation
To run blobtoolkit on alternate ports, change the hostname or use a different data directory, change settings in the `.env` file:

```
NODE_ENV=local
BTK_CLIENT_PORT=8080
BTK_API_PORT=8000
BTK_API_URL=http://localhost:8000/api/v1
BTK_BASENAME=/view
BTK_HTTPS=false
BTK_ORIGINS='http://localhost:8080 http://localhost null'
BTK_HOST=localhost
BTK_FILE_PATH=
BTK_OUT_FILE_PATH=/dev/null
```

### Use Local data

If you have an assembly you would like to visualise, use [BlobTools2](https://github.com/blobtoolkit/blobtools2), to import the assembly, read mapping and BLAST hits ready for visualisation.

To analyse a public assembly, the [BlobToolKit pipeline](https://github.com/blobtoolkit/insdc-pipeline) can take an assembly and reads as input and automate all steps through to generating a dataset ready to load in the Viewer.

## Production build

The exact settings will depend on your system, use the following as a guide for what may need changing:

1. Modify your `.env` file for a production setting
```
NODE_ENV=production
BTK_CLIENT_PORT=8081
BTK_API_PORT=8002
BTK_API_URL=http://example.com/api/v1
BTK_BASENAME=/viewer
BTK_HTTPS=false
BTK_ORIGINS='http://example.com null'
BTK_HOST=example.com
BTK_FILE_PATH=/path/to/data
BTK_OUT_FILE_PATH=/dev/null
```

2. Build and minify the client code
```
npm run build
```

3. Move the contents of dist/public to a subdirectory of your webroot

4. Configure your web server to redirect non-file requests to index.html to allow BlobToolKit Viewer to run as a single page app
 - e.g. for apache
 - activate mod_rewrite
 - set allowoverride to all
 - restart apache
 - add a `.htaccess` file to the subdirectoy containing the minified code
 ```
 <ifModule mod_rewrite.c>
   RewriteEngine on
   RewriteCond %{REQUEST_FILENAME} -s [OR]
   RewriteCond %{REQUEST_FILENAME} -l [OR]
   RewriteCond %{REQUEST_FILENAME} -d
   RewriteRule ^.*$ - [NC,L]
   RewriteRule ^(.*) index.html [NC,L]
 </ifModule>
 ```

5. Start the api as in the quick start guide

6. Visit site
```
http://example.com/viewer/
```

## Command line interface

A command line tool to generate plots via the web code is available in the `utils` directory. This runs a Firefox browser in headless mode and can be used to pass any query string parameters to a non-interactive version of the viewer to generate `svg` or `png` images of any of the main plot types. Firefox must be installed locally and both the `firefox` executable and the `geckodriver` Node module must be in your `$PATH` environment variable.

For example, to generate a png image of a cumulative distribution plot for a dataset filtered by minimum length:
```
PATH=viewer/node_modules/geckodriver:/path/to/firefox/directory:$PATH
viewer/utils/cli dataset_id --view cumulative --format png --param length--Min=5000 --out ./
```

## Query string/list parameters:

Most settings can be altered directly using the url, the list below provides an overview of most available settings:

- xField=gc
- yField=SRR000000_cov
- zField=length
- catField=bestsumorder_phylum
- color0=gold
- color1=purple
- color2=rgb(255,0,0)
- palette=user
- gc--Min=0.32
- gc--Max=0.58
- gc--LimitMin=0
- gc--LimitMax=1
- gc--Inv=true|false
- bestsumorder_phylum--Keys=3,7,12
- bestsumorder_phylum--Order=Arthropoda,Echinodermata,no-hit
- bestsumorder_superkingdom--Active=true
- plotShape=square|hex|circle
- plotResolution=30 (range: 5-50)
- zReducer=sum|min|max|count|mean
- zScale=scaleLog|scaleLinear|scaleSqrt

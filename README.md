# BlobToolKit Viewer (v0.5)

 [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.1134794.svg)](https://doi.org/10.5281/zenodo.1134794)

BlobToolKit Viewer is a genome-scale dataset visualistion tool developed as part of the [blobtoolkit](http://blobtoolkit.genomehubs.org) project to allow browser-based identification and filtering of target and non-target data in genome assemblies.

We are running the BlobToolKit [insdc-pipeline](https://github.com/blobtoolkit/insdc-pipeline) on all public (INSDC registered) eukaryote genome assemblies and making the results available in an instance of this viewer at [blobtoolkit.genomehubs.org](http://blobtoolkit.genomehubs.org/view/).



## Query string/list parameters:

#### Plot parameters
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
- plotShape=square|hex|circle
- plotResolution=30 (range: 5-50)
- zReducer=sum|min|max|count|mean
- zScale=scaleLog|scaleLinear|scaleSqrt

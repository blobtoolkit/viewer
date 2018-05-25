# BlobToolKit Viewer (v0.3)

 [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.1134794.svg)](https://doi.org/10.5281/zenodo.1134794)

This is an alpha release of a visualistion tool developed as part of
the [blobtoolkit](http://blobtoolkit.genomehubs.org) project to allow browser-based
identification and filtering of target/non-target data in genome-scale datasets.

View a live demo at [blobtoolkit.genomehubs.org](http://blobtoolkit.genomehubs.org/demo).


## Query string/list parameters:

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

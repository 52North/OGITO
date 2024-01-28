# street names
this tool creates a `.geojson` file of street geometries using [OSM](https://www.openstreetmap.org/) data.

## workflow
- getting OSM-ids of `way` for a certain area using [overpass-api](https://overpass-api.de) - only entities with a name are considered
- filter to get rid of certain entries (e.g. `plattform`)
- getting each geometry using [nominatim-api](https://nominatim.openstreetmap.org) 
- dissolving street geometries by name
- clipping by the extend of the desired area 
- exporting as `.geojson`

## hot to use
### install venv
```commandline
python -m venv ogito_streets
```
- on Windows: 
```commandline
ogito_streets\Scripts\activate
```
- on Linux/Mac
```commandline
source ogito_streets/bin/activate
```
### install requirements
```commandline
pip install -r requirements.txt
```
### edit main.py and run it 
edit in the [last block](https://github.com/52North/OGITO/blob/case_study/enschede/tools/street_names/main.py#L96) of `main.py`
- city: the _casesensitive_ name of the city you want the streets from
- admin_id: the OSM id of the administrative unit (see below)
- outfile: the name of the file _without_ the file ending
```python
OGITO_streetnames(city, admin_id, outfile)
```
### how to get admin_id
- go to https://www.openstreetmap.org/ 
- enter your city name in the search field e.g. `Enschede` <br>
![1](https://github.com/52North/OGITO/blob/case_study/enschede/tools/street_names/img/admin_id_step1.png)
- pick the correct area <br>
![2](https://github.com/52North/OGITO/blob/case_study/enschede/tools/street_names/img/admin_id_step2.png)
- note the highlighted number in the picture <br>
![3](https://github.com/52North/OGITO/blob/case_study/enschede/tools/street_names/img/admin_id_step3.png)
- use it in the function

### Docker
If you don't want to install GDAL dependencies - which can be tricky on windows - you can run the script inside a docker container.  
Build the image:
```commandline
docker build -t street-names .
```
Run the container:  
  
Windows (Powershell):  
```commandline
docker run -v ${PWD}:/usr/src/app/ street_names
```
Windows (CMD)  
```commandline
docker run -v %cd%:/usr/src/app/ street_names
```
Linux/Max:  
```commandline
docker run -v $(pwd):/usr/src/app/ street_names
```


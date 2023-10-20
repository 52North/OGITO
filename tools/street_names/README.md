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
- city: the _casesensitive_ name of the city you want the streets from
- admin_id: the OSM id of the administrative unit (see below)
- outfile: the name of the file _without_ the file ending
```python
OGITO_streetnames(city, admin_id, outfile)
```
### how to get admin_id
- go to https://www.openstreetmap.org/ 
- enter your city name in the search field e.g. `Enschede`
![1](/img/admin_id_step1.png)
- pick the correct area
![2](/img/admin_id_step2.png)
- note the highlighted number in the picture
![3](/img/admin_id_step3.png)
- use it in the function
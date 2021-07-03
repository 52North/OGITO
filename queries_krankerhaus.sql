
create or replace function public.Krankenhaus_Bezirke_Gesamtlarm_LDEN
(
 dblow integer,
 dbhigh integer)
returns setof OrgInDbLevel as
$$
select distinct "Krankenhaus".id, "Krankenhaus".geom, "Statistische_Bezirke".id as Bezirke
from "Krankenhaus" JOIN "Statistische_Bezirke" on ST_Intersects ("Krankenhaus".geom,"Statistische_Bezirke".geom)
join "Gesamtlarm_LDEN" 
on ST_Intersects("Krankenhaus".geom,"Gesamtlarm_LDEN".geom) and
"Gesamtlarm_LDEN"."ISOV2" >= dblow and "Gesamtlarm_LDEN"."ISOV2" < dbhigh
order by Bezirke asc
$$ language sql stable;

create or replace function public.Krankenhaus_Bezirke_Industrielaerm_LDEN
(
 dblow integer,
 dbhigh integer)
returns setof OrgInDbLevel as
$$
select distinct "Krankenhaus".id, "Krankenhaus".geom, "Statistische_Bezirke".id as Bezirke
from "Krankenhaus" JOIN "Statistische_Bezirke" on ST_Intersects ("Krankenhaus".geom,"Statistische_Bezirke".geom)
join "Industrielaerm_LDEN" 
on ST_Intersects("Krankenhaus".geom,"Industrielaerm_LDEN".geom) and
"Industrielaerm_LDEN"."ISOV2" >= dblow and "Industrielaerm_LDEN"."ISOV2" < dbhigh
order by Bezirke asc
$$ language sql stable;

create or replace function public.Krankenhaus_Bezirke_Industrielaerm_LNight
(
 dblow integer,
 dbhigh integer)
returns setof OrgInDbLevel as
$$
select distinct "Krankenhaus".id, "Krankenhaus".geom, "Statistische_Bezirke".id as Bezirke
from "Krankenhaus" JOIN "Statistische_Bezirke" on ST_Intersects ("Krankenhaus".geom,"Statistische_Bezirke".geom)
join "Industrielaerm_LNight" 
on ST_Intersects("Krankenhaus".geom,"Industrielaerm_LNight".geom) and
"Industrielaerm_LNight"."ISOV2" >= dblow and "Industrielaerm_LNight"."ISOV2" < dbhigh
order by Bezirke asc
$$ language sql stable;

create function public.Krankenhaus_Bezirke_Straassenlaerm_LDEN
(
 dblow integer,
 dbhigh integer)
returns setof OrgInDbLevel as
$$
select distinct "Krankenhaus".id, "Krankenhaus".geom, "Statistische_Bezirke".id as Bezirke 
from "Krankenhaus" JOIN "Statistische_Bezirke" on ST_Intersects ("Krankenhaus".geom,"Statistische_Bezirke".geom)
join "Straassenlaerm_LDEN" 
on ST_Intersects("Krankenhaus".geom,"Straassenlaerm_LDEN".geom) and
"Straassenlaerm_LDEN"."ISOV2" >= dblow and "Straassenlaerm_LDEN"."ISOV2" < dbhigh
order by Bezirke asc
$$ language sql stable;

create function public.Krankenhaus_Bezirke_Straassenlaerm_LNight
(
 dblow integer,
 dbhigh integer)
returns setof OrgInDbLevel as
$$
select distinct "Krankenhaus".id, "Krankenhaus".geom, "Statistische_Bezirke".id as Bezirke
from "Krankenhaus" JOIN "Statistische_Bezirke" on ST_Intersects ("Krankenhaus".geom,"Statistische_Bezirke".geom)
join "Straassenlaerm_LNight" 
on ST_Intersects("Krankenhaus".geom,"Straassenlaerm_LNight".geom) and
"Straassenlaerm_LNight"."ISOV2" >= dblow and "Straassenlaerm_LNight"."ISOV2" < dbhigh
order by Bezirke asc
$$ language sql stable;


create or replace function public.Krankenhaus_Zuglaerm_Bogestra_LDEN
(
 dblow integer,
 dbhigh integer)
returns setof OrgInDbLevel as
$$
select distinct "Krankenhaus".id, "Krankenhaus".geom, "Zuglaerm_Bogestra_LDEN".id as Bezirke
from "Krankenhaus" JOIN "Statistische_Bezirke" on ST_Intersects ("Krankenhaus".geom,"Statistische_Bezirke".geom)
join "Zuglaerm_Bogestra_LDEN" 
on ST_Intersects("Krankenhaus".geom,"Zuglaerm_Bogestra_LDEN".geom) and
"Zuglaerm_Bogestra_LDEN"."ISOV2" >= dblow and "Zuglaerm_Bogestra_LDEN"."ISOV2" < dbhigh
order by Bezirke asc
$$ language sql stable;


create or replace function public.Krankenhaus_Zuglaerm_Bogestra_LNight
(
 dblow integer,
 dbhigh integer)
returns setof OrgInDbLevel as
$$
select distinct "Krankenhaus".id, "Krankenhaus".geom, "Zuglaerm_Bogestra_LNight".id as Bezirke
from "Krankenhaus" JOIN "Statistische_Bezirke" on ST_Intersects ("Krankenhaus".geom,"Statistische_Bezirke".geom)
join "Zuglaerm_Bogestra_LNight" 
on ST_Intersects("Krankenhaus".geom,"Zuglaerm_Bogestra_LNight".geom) and
"Zuglaerm_Bogestra_LNight"."ISOV2" >= dblow and "Zuglaerm_Bogestra_LNight"."ISOV2" < dbhigh
order by Bezirke asc
$$ language sql stable;
 
create or replace function public.Krankenhaus_Zuglaerm_DB_LDEN
(
 dblow integer,
 dbhigh integer)
returns setof OrgInDbLevel as
$$
select distinct "Krankenhaus".id, "Krankenhaus".geom, "Zuglaerm_DB_LDEN".id as Bezirke
from "Krankenhaus" JOIN "Statistische_Bezirke" on ST_Intersects ("Krankenhaus".geom,"Statistische_Bezirke".geom)
join "Zuglaerm_DB_LDEN" 
on ST_Intersects("Krankenhaus".geom,"Zuglaerm_DB_LDEN".geom) and
"Zuglaerm_DB_LDEN"."ISOV2" >= dblow and "Zuglaerm_DB_LDEN"."ISOV2" < dbhigh
order by Bezirke asc
$$ language sql stable;
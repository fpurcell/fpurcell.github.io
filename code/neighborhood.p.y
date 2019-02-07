#
# Example GeoAlchemy query from existing PostGIS table 
# Frank Purcell
# June 1, 2010
#
import sys
from sqlalchemy     import *
from sqlalchemy.orm import *
from geoalchemy     import *
from sqlalchemy.sql import func

#
# DB connection
# NOTE: set echo=True to see all that *Alchemy is doing to talk to the database
#
database = "postgresql://postgres@localhost:5432/postgres"
engine   = create_engine(database, echo=False)
metadata = MetaData()


#
# define relational object, mapping to db table
# tell sqlalchemy about the special type of the PostGIS geom column
# other columns will be mapped automatically from the table's metadata
#
source = Table('neighborhood', 
               metadata,
               GeometryExtensionColumn('the_geom', Geometry(2)),
               autoload=True,
               autoload_with=engine
         )
# NOTE that the Did not recognize type 'geometry' of column 'the_geom' warning is happening here...not sure why
# sys.exit(1)


#
# open a bound session on the database
#
Session = sessionmaker(bind=engine)
session = Session()


#
# query for the largest polygon by doing an order_by on the st_area(geom), 
# then choosing the first row from the result set
#
# NOTE: The order_by content is simply a string that gets appended to geoalchemy's sql query being 
#       sent to the db.  The contents of the order_by (as shown here), is any valid sql applicable to the  
#       given (postgis) db.  The negative to this approach would be lack of portability (eg: sqllite).
#
q = session.query(source)
#row = q..first()
#row = q.order_by(desc("name")).first()
#row = q.order_by("st_area(the_geom)").first()         # smallest polygon
row = q.order_by(desc("st_area(the_geom)")).first()   # largest polygon


#
# print out information about our table
#
print "DB Columns", source.columns
print "GeoColumn Type", session.scalar(functions.geometry_type(row.the_geom))


#
# Call an ST_ function on our geom column, and print out information about the first row in the table  
#
center = DBSpatialElement(row.the_geom.centroid())
area   = session.scalar(DBSpatialElement(row.the_geom.area()))
lon    = session.scalar(center.y)
lat    = session.scalar(center.x)
print row.name, "centriod is at:", lon, ",", lat, "and this big",area 

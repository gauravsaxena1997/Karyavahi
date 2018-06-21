import tweepy
import gmplot
import twython
import pyrebase
from urlopen import *
import pyrebase
from geopy.geocoders import Nominatim
geolocator=Nominatim()
location=geolocator.reverse("18.527999,73.851301")
print(location.address)
# gm=gmplot.GoogleMapPlotter(location)
# gm.draw('map.html')
config = {
    'apiKey': "AIzaSyDGK56iTBDYvIr50oigjublVXnSn972wbo",
    'authDomain': "karyavahire.firebaseapp.com",
    'databaseURL': "https://karyavahire.firebaseio.com",
    'projectId': "karyavahire",
    'storageBucket': "karyavahire.appspot.com",
    'messagingSenderId': "881672782733"
}

firebase = pyrebase.initialize_app (config)
auth1 = firebase.auth ()
database = firebase.database()
storage=firebase.storage()
twitter = twython.Twython(
"p22oNE1UFpcayEZQTj3PL9rGy",
"3nbIKZz8DHhgP0CKO95xXu0AMpAuRLutY9QmU1420hB0K0dENt",
"979709228146294784-1AEpvmWelU1nRBeaEgkqGzPmEXmWuaC",
"VD5ZSTkayFcNTc2B1WqGrADdMJBXJvlmNPdHPE41FdYLo"
)

# update the status
# f = urlopen("https://firebasestorage.googleapis.com/v0/b/karyavahire.appspot.com/o/images%2Fpostss%2Fstorage%2Femulated%2F0%2Fatulmodi.am%40gmail.com_1522395563521?alt=media&token=98d1af0d-f419-4a9a-8c1f-45a5ef162671")
# f = urlopen("http://www.weather.com/sunny.jpg")
f = open("hospital.png", 'rb')
status1="Good work karyavahian1"
twitter.update_status_with_media(media=f,status=status1+" #karyavahi")
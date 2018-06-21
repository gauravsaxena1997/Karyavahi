from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib import auth
from django.views.generic import View
from .forms import UserForm
from .forms import userinput
from django.template import loader
from django.http import HttpResponse
# extra
import tweepy
from TwitterAPI import TwitterAPI
import urllib
from textblob import TextBlob
from tweepy.streaming import json
import pyrebase
from secrets import Oauth_Secrets
from .sentimeter import primary
from django.http import HttpResponseRedirect

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

def home (request):
	print ('Welcome....')
	return render (request, 'home/home.html')

def signin (request):
	return render (request, 'home/signin.html')

def signup (request):
	return render (request, 'home/signup.html')

def portal (request):
	email = request.POST.get ('email')
	password = request.POST.get ('password')
	# For checking Invalid Credentials
	try:
		user = auth1.sign_in_with_email_and_password ( email, password )
	except:
		print ('Invalid Credentials')
		message = 'Invalid Credentials'
		return render (request, 'home/signin.html', {'message': message})
	# Session
	# print (user['idToken'])
	print('Welcome to the portal......')
	session_id = user['idToken']
	request.session['uid'] = str(session_id)
	
	# To check conditions
	if email== 'gaurav@karyavahi.com':
		return render (request,'hospital_portal/hospital_portal.html',{'email':email,'post_details_lis':post_details_lis})

	if email== 'shubham@karyavahi.com':
		return render (request,'corruption_portal/corruption_portal.html',{'email':email})

	if email== 'abhishek@karyavahi.com':
		return render (request,'nagar_nigam/nagar_nigam.html',{'email':email})

	# if email== 'kavya@karyavahi.com':
	# 	return render (request,'nagar_nigam/nagar_nigam.html',{'email':email,'post_details_lis':post_details_lis})


def postsignup (request):
	name = request.POST.get ('name')
	email = request.POST.get ('email')
	password = request.POST.get ('password')
	user = auth1.create_user_with_email_and_password ( email, password )
	uid = user['localId']
	print ("localId" +str(uid))
	data = {
		'email':email,
		'name': name
	}
	database.child('Admin').child(uid).child('details').set(data)
	return render (request,'home/signin.html',{
	'email':email,
	'name': name,
	})

def logout (request):
	auth.logout (request)
	return render (request, 'home/signin.html')

# ....................For portals...........................

def hospital_portal (request):
	post=database.child('Post').shallow().get().val()
	post_lis=[]
	counter_lis=['1','2','3','4']
	for i in post:
		post_lis.append(i)
	post_lis.sort(reverse=True)
	Title=[]
	Description=[]
	Location=[]
	ImageUrl=[]
	for i in counter_lis:
		a=post_lis[int(i)]
		Title.append( database.child('Post').child(a).child('Title').shallow().get().val() )
		Description.append( database.child('Post').child(a).child('Description').shallow().get().val() )
		Location.append( database.child('Post').child(a).child('Location').shallow().get().val() )
		ImageUrl.append( database.child('Post').child(a).child('ImageUrl').shallow().get().val() )
	post_details_lis=zip(counter_lis,ImageUrl,Title,Location,Description)
	return render (request,'hospital_portal/hospital_portal.html',{'post_details_lis':post_details_lis})

def nagar_nigam (request):
	post=database.child('Post').shallow().get().val()
	post_lis=[]
	counter_lis=['1','2']
	for i in post:
		post_lis.append(i)
	post_lis.sort(reverse=True)
	Title=[]
	Description=[]
	Location=[]
	ImageUrl=[]
	for i in counter_lis:
		a=post_lis[int(i)]
		Title.append( database.child('Post').child(a).child('Title').shallow().get().val() )
		Description.append( database.child('Post').child(a).child('Description').shallow().get().val() )
		Location.append( database.child('Post').child(a).child('Location').shallow().get().val() )
		ImageUrl.append( database.child('Post').child(a).child('ImageUrl').shallow().get().val() )
	post_details_lis=zip(counter_lis,ImageUrl,Title,Location,Description)
	return render (request,'nagar_nigam/nagar_nigam.html',{'post_details_lis':post_details_lis})

def status (request):
		idtoken = request.session['uid']
		s = auth1.get_account_info(idtoken)
		s = s['users']
		s = s[0]
		s = s['localId']
		email  = database.child('Admin').child(s).child('details').child('email').get().val()
		print (email)
		post=database.child('Post').shallow().get().val()
		post_lis=[]
		counter_lis=[]
		total_post=0
		for i in post:
			post_lis.append(i)
			total_post=total_post+1
			counter_lis.append(total_post)
		post_lis.sort(reverse=True)
		Title=[]
		Description=[]
		Location=[]
		ImageUrl=[]
		Category=[]
		Id=[]
		for i in range(0,total_post):
			a=post_lis[i]
			Category=database.child('Post').child(a).child('Category').shallow().get().val()
			print (Category)
			if ( email == 'abhishek@karyavahi.com' and Category == 'Waste Disposal'):
				Title.append( database.child('Post').child(a).child('Title').shallow().get().val() )
				Description.append( database.child('Post').child(a).child('Description').shallow().get().val() )
				Location.append( database.child('Post').child(a).child('Location').shallow().get().val() )
				ImageUrl.append( database.child('Post').child(a).child('ImageUrl').shallow().get().val() )
				Id.append( database.child('Post').child(a).child('Rendom id').shallow().get().val() )
				print (Id)
					
			if ( email == 'shubham@karyavahi.com' and Category == 'Waste Disposal'):
				Title.append( database.child('Post').child(a).child('Title').shallow().get().val() )
				Description.append( database.child('Post').child(a).child('Description').shallow().get().val() )
				Location.append( database.child('Post').child(a).child('Location').shallow().get().val() )
				ImageUrl.append( database.child('Post').child(a).child('ImageUrl').shallow().get().val() )
				Id.append( database.child('Post').child(a).child('Rendom id').shallow().get().val() )

		post_details_lis=zip(Id,ImageUrl,Title,Location,Description)

		return render (request,'portal/inactive.html',{'post_details_lis':post_details_lis,'email':email})
		# if email== 'gaurav@karyavahi.com':
		# if email== 'kavya@karyavahi.com':
		# 	return render (request,'nagar_nigam/status.html',{'post_details_lis':post_details_lis})

def take_action():
	database.child('Post').child(a).update( { 'Status':'True' } )
	return render (request,'nagar_nigam/status.html')


def active_cases():
		return render (request,'nagar_nigam/status.html')
def complete_cases():
		return render (request,'nagar_nigam/status.html')

def profile (request):
	idtoken = request.session['uid']
	a = auth1.get_account_info(idtoken)
	a = a['users']
	a = a[0]
	a = a['localId']
	other_details = database.child('Admin').child(a).child('other_details').shallow().get().val()
	address = database.child('Admin').child(a).child('other_details').child('address').get().val()
	mobile  = database.child('Admin').child(a).child('other_details').child('mobile').get().val()
	name = database.child('Admin').child(a).child('details').child('name').get().val()	
	email  = database.child('Admin').child(a).child('details').child('email').get().val()
	if email== 'gaurav@karyavahi.com':
		return render (request,'hospital_portal/profile.html',{ 
			'address':address, 
			'mobile':mobile, 
			'name': name,
			'email':email
		})
	if email== 'abhishek@karyavahi.com':
		return render (request,'hospital_portal/profile.html',{ 
			'address':address, 
			'mobile':mobile, 
			'name': name,
			'email':email
		})

def update_profile (request):
	return render (request,'portal/update_profile.html')

def post_update (request):
	mobile = request.POST.get ('mobile')
	address = request.POST.get ('address')
	idtoken = request.session['uid']
	a = auth1.get_account_info(idtoken)
	a = a['users']
	a = a[0]
	a = a['localId']
	print(str(a))
	data = {
	'mobile': mobile,
	'address': address
	}
	database.child('Admin').child(a).child('other_details').set(data)
	return render (request,'portal/profile.html')

def analyze(request):
    user_input = userinput()
    return render(request, "portal/analyze.html", {'input_hastag': user_input})


def postanalyze(request):
	user_input = userinput(request.GET)
	if ( request.GET and user_input.is_valid() ):
		input_hastag = user_input.cleaned_data['q']
		print (input_hastag)
		data = primary(input_hastag)
		print (data)
		return render(request, "portal/result.html",{'data': data})
	return render(request, "portal/analyze.html", {'input_hastag': user_input})

def twitter(request):
	idtoken = request.session['uid']
	s = auth1.get_account_info(idtoken)
	s = s['users']
	s = s[0]
	s = s['localId']
	email  = database.child('Admin').child(s).child('details').child('email').get().val()
	print (email)
	consumer_key =  'h9L0J24kPY8vh7cfLY0RaxVKL'
	consumer_secret = 'ACf4hfHWnDAZ3UHSaN5fk3S9BqOTYClSneP2IOgOVrz7vLQNHE'
	access_token = '979709228146294784-mkyrzH8uZ3M4lQcDq4cO3edHxKK00Fz'
	access_token_secret = 'JuaoVdHyFtg6oZVhGmF7zrx2W9ngUyw4Ls9f27gtmEGwW'
	
	post=database.child('Post').shallow().get().val()
	post_lis=[]
	for i in post:
		Category=database.child('Post').child(i).child('Category').shallow().get().val()
		print(Category)
		Legal = database.child('Post').child(i).child('Legal').shallow().get().val()
		print(Legal)
		if ( Category == 'Waste Disposal' and Legal == 'false'):
			post_lis.append(i)

	post_lis.sort(reverse=True)
	print (post_lis)

	for twi in range (0,len(post_lis)):
		a = post_lis[twi]
		print ('INside..................')
		Title=database.child('Post').child(a).child('Title').shallow().get().val()
		Description=database.child('Post').child(a).child('Description').shallow().get().val()
		Category=database.child('Post').child(a).child('Category').shallow().get().val()
		ImageUrl=database.child('Post').child(a).child('ImageUrl').shallow().get().val()

		content=urllib.request.urlopen(ImageUrl)
		#generating the API
		api = TwitterAPI(consumer_key,
		                 consumer_secret,
		                 access_token,
		                 access_token_secret)

		#reading the image data
		data = content.read()
		#uploading the image
		r = api.request('media/upload', None, {'media': data})

		tweet="Title: "+str(Title[0])+"\n"+"Description: "+str(Description[0])+"\n"+"Category: "+str(Category[0])
		#posting tweet with reference to uploaded image
		if r.status_code == 200:
			media_id = r.json()['media_id']
			r = api.request('statuses/update', {'status':tweet, 'media_ids':media_id})
			print("Status uploaded")
			database.child('Post').child(a).update( { 'Legal':'True' } )

		else:
			print("Failure in uploading status")

	return render (request,'nagar_nigam/nagar_nigam.html')
		# return HttpResponseRedirect(request.path_info)

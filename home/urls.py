from django.conf.urls import url
from . import views

app_name = 'home'

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'signin/$', views.signin, name='signin'),
    url(r'^portal/', views.portal, name='portal'),
    url(r'^signup/$', views.signup , name='signup'),
    url(r'^logout/',views.logout, name='logout' ),
    url(r'^postsignup/$', views.postsignup, name='postsignup'),
    # portal
    url(r'^hospital_portal/$', views.hospital_portal, name='hospital_portal'),
    url(r'^nagar_nigam/$', views.nagar_nigam, name='nagar_nigam'),
    url(r'^status/$', views.status, name='status'),
    url(r'^profile/$', views.profile, name='profile'),
    url(r'^update_profile/', views.update_profile, name='update_profile'),
    url(r'^post_update/', views.post_update, name='post_update'),
    url(r'^twitter/', views.twitter, name='twitter'),
    url(r'^analyze/', views.analyze, name='analyze'),
    url(r'^postanalyze/', views.postanalyze, name='postanalyze'),
    url(r'^active_cases/', views.active_cases, name='active_cases'),
    url(r'^complete_cases/', views.complete_cases, name='complete_cases'),
    url(r'^take_action/', views.take_action, name='take_action'),

    
]
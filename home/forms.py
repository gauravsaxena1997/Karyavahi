from django.contrib.auth.models import User
from django import forms

class userinput(forms.Form):
    q=forms.CharField(required=True,max_length=25,label='Input #hashtag')



class UserForm (forms.ModelForm):
	password = forms.CharField (widget=forms.PasswordInput)

	class Meta:
		model = User
		fields = [ 'username', 'email', 'password' ] 

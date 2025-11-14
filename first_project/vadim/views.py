from django.shortcuts import render, HttpResponse
from .models import *

# Create your views here.

def index(request):
    return render(request,'index.html')

def index(request):
    return render(request,'main.html')

def home(request):
    tours = Tour.objects.all()[:6]
    hotels = Hotel.objects.all()[:3]
    reviews = Reviews.objects.all()[:3]
    
    context = {
        'tours': tours,
        'hotels': hotels,
        'reviews': reviews,
    }
    return render(request, 'home.html', context)

from django.shortcuts import render, get_object_or_404
from .models import Tour, Hotel, Reviews

def home(request):
    tours = Tour.objects.select_related('hotel', 'flight', 'hotel__room_class')[:6]
    hotels = Hotel.objects.select_related('room_class')[:6]
    
    context = {
        'tours': tours,
        'hotels': hotels,
    }
    return render(request, 'home.html', context)

def tours(request):
    tours = Tour.objects.select_related('hotel', 'flight', 'hotel__room_class').all()
    
    context = {
        'tours': tours,
    }
    return render(request, 'tours.html', context)

def hotels(request):
    hotels = Hotel.objects.select_related('room_class').all()
    
    context = {
        'hotels': hotels,
    }
    return render(request, 'hotels.html', context)

def tour_detail(request, tour_id):
    tour = get_object_or_404(
        Tour.objects.select_related('hotel', 'flight', 'hotel__room_class'),
        id=tour_id
    )
    reviews = Reviews.objects.filter(tour=tour).select_related('client')
    
    context = {
        'tour': tour,
        'reviews': reviews,
    }
    return render(request, 'tour_detail.html', context)

def hotel_detail(request, hotel_id):
    hotel = get_object_or_404(
        Hotel.objects.select_related('room_class'),
        id=hotel_id
    )
    tours = Tour.objects.filter(hotel=hotel)
    
    context = {
        'hotel': hotel,
        'tours': tours,
    }
    return render(request, 'hotel_detail.html', context)
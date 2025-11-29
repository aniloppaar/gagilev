from django.shortcuts import render, get_object_or_404
from django.db.models import Q
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
    search_query = request.GET.get('q', '')
    price_min = request.GET.get('price_min', '')
    price_max = request.GET.get('price_max', '')
    
    tours = Tour.objects.select_related('hotel', 'flight', 'hotel__room_class')
    
    if search_query:
        tours = tours.filter(
            Q(name__icontains=search_query) |
            Q(hotel__name__icontains=search_query) |
            Q(hotel__place__icontains=search_query)
        )
    
    if price_min:
        tours = tours.filter(price__gte=price_min)
    
    if price_max:
        tours = tours.filter(price__lte=price_max)
    
    context = {
        'tours': tours,
        'search_query': search_query,
        'price_min': price_min,
        'price_max': price_max,
        'is_search': bool(search_query or price_min or price_max),
    }
    return render(request, 'tours.html', context)

def hotels(request):
    search_query = request.GET.get('q', '')
    
    if search_query:
        hotels = Hotel.objects.filter(
            Q(name__icontains=search_query) |
            Q(place__icontains=search_query)
        ).select_related('room_class')
    else:
        hotels = Hotel.objects.select_related('room_class').all()
    
    context = {
        'hotels': hotels,
        'search_query': search_query,
        'is_search': bool(search_query),
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
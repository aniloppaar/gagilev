from django.shortcuts import render, get_object_or_404
from django.db.models import Q
from .models import Tour, Hotel, Reviews

def home(request):
    # Показываем только популярные туры и отели на главной
    tours = Tour.objects.select_related('hotel', 'flight', 'hotel__room_class')[:6]
    hotels = Hotel.objects.select_related('room_class')[:6]
    reviews = Reviews.objects.select_related('client', 'tour')[:8]
    
    context = {
        'tours': tours,
        'hotels': hotels,
        'reviews': reviews,
    }
    return render(request, 'home.html', context)

def tour_list(request):
    # Поиск туров
    search_query = request.GET.get('q', '')
    
    if search_query:
        tours = Tour.objects.filter(
            Q(name__icontains=search_query) |
            Q(hotel__name__icontains=search_query) |
            Q(hotel__place__icontains=search_query)
        ).select_related('hotel', 'flight', 'hotel__room_class')
    else:
        tours = Tour.objects.select_related('hotel', 'flight', 'hotel__room_class').all()
    
    context = {
        'tours': tours,
        'search_query': search_query,
        'is_search': bool(search_query),
    }
    return render(request, 'tours.html', context)

def tour_detail(request, tour_id):
    tour = get_object_or_404(
        Tour.objects.select_related('hotel', 'flight', 'hotel__room_class'),
        id=tour_id
    )
    return render(request, 'tours.html', {'tour': tour})

def hotel_list(request):
    # Поиск отелей
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

def hotel_detail(request, hotel_id):
    hotel = get_object_or_404(
        Hotel.objects.select_related('room_class'),
        id=hotel_id
    )
    return render(request, 'hotels.html', {'hotel': hotel})

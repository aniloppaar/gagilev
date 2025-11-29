from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('tours/', views.tours, name='tours'),
    path('tour/<int:tour_id>/', views.tour_detail, name='tour_detail'),
    path('hotels/', views.hotels, name='hotels'),
    path('hotel/<int:hotel_id>/', views.hotel_detail, name='hotel_detail'),
]
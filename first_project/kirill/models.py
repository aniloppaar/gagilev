from django.db import models

class Flight(models.Model):
    date = models.DateField(verbose_name='Дата')
    price = models.DecimalField(verbose_name='Цена', max_digits=10, decimal_places=2)  
    flight_time = models.TimeField(verbose_name='Время в пути')

    class Meta:
        verbose_name = "Полет"
        verbose_name_plural = "Полеты"
        ordering = ["date", "price"]
        indexes = [
            models.Index(fields=["date"]),
            models.Index(fields=["flight_time"])
        ]
    
    def str(self):  
        return f"{self.date} - {self.price}"  

class Hotel(models.Model):
    name = models.CharField(verbose_name='Название', max_length=100)
    place = models.TextField(verbose_name='Местоположение')
    price = models.DecimalField(verbose_name='Цена', max_digits=10, decimal_places=2)  

    class Meta:
        verbose_name = "Отель"
        verbose_name_plural = "Отели"
        ordering = ["price"]
        indexes = [
            models.Index(fields=["place"]),
            models.Index(fields=["price"])
        ]
    
    def str(self):  
        return f"{self.name}"

class Client(models.Model):
    name = models.CharField('Имя', max_length=25)
    last_name = models.CharField('Фамилия', max_length=25)
    father_name = models.CharField('Отчество', max_length=25)
    phone_number = models.CharField('Номер телефона', max_length=11)
    mail = models.EmailField('Почта', max_length=100) 

    class Meta:
        verbose_name = "Клиент"
        verbose_name_plural = "Клиенты"
        ordering = ["name", "last_name", "father_name"]
        indexes = [
            models.Index(fields=["name"]),
            models.Index(fields=["last_name"])
        ]
    
    def str(self):  
        return f"{self.last_name} {self.name}"
class Tour(models.Model):
    name = models.CharField(verbose_name='Название тура', max_length=100) 
    price = models.DecimalField(verbose_name='Цена', max_digits=10, decimal_places=2)
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, verbose_name='Отель')  
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE, verbose_name='Перелет')  

    class Meta:
        verbose_name = "Тур"
        verbose_name_plural = "Туры"
        ordering = ["name", "price"]  
    
    def str(self):  
        return f"{self.name} - {self.price}"

class Reviews(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, verbose_name='клиент') 
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, verbose_name='тур') 
    text = models.TextField(verbose_name='Текст отзыва', blank=True) 
    rating = models.IntegerField(verbose_name='Рейтинг', )  
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')

    class Meta:
        verbose_name = "Отзыв"
        verbose_name_plural = "Отзывы"
    
    def str(self):  
        return f"Отзыв от {self.client.last_name} на тур {self.tour.name}"
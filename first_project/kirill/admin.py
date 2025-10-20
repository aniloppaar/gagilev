from django.contrib import admin
from .models import *

# Register your models here.


admin.site.register(Users)
admin.site.register(Items)
admin.site.register(Cases)
admin.site.register(Contract)
admin.site.register(Upgrade)
admin.site.register(case_contents)
admin.site.register(Chance)
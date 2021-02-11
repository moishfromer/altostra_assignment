from django.urls import include, path

from github.views import repos, licenses

urlpatterns = [
    path('repos/', repos),
    path('licenses/', licenses)
]
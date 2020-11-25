from django.shortcuts import render


def index(request):
    context = {}
    return render(request, 'covid/index.html', context)

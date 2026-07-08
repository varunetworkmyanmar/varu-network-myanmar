from django.shortcuts import render
from .models import OverallSummary,Donation, Expense
from django.http import JsonResponse

def healthz(request):
    return JsonResponse({"status": "ok"})

def homepage(request):
    return render(request, 'varu/home.html')


def mission(request):
    return render(request, 'varu/mission.html')


def education(request):
    return render(request, 'varu/education.html')


def health(request):
    return render(request, 'varu/health.html')


def transportation(request):
    return render(request, 'varu/transportation.html')


def donate(request):
    return render(request, 'varu/donate.html')


def contactus(request):
    return render(request, 'varu/contactus.html')

def team(request):
    return render(request, 'varu/team.html')


def transparency(request):
    """
    Transparency view:
    - Shows overall totals (donations, expenses, balance)
    - Displays all donations in a table
    """
    summary = OverallSummary.objects.get_or_create(name="Overall Summary")[0]

    donations = Donation.objects.all()

    context = {
        "total_donations": summary.total_donations,
        "total_expenses": summary.total_expenses,
        "remaining_balance": summary.remaining_balance,
        "donations": donations,
    }
    return render(request, "varu/transparency.html", context)


def expenses(request):
    """
    Expenses view:
    - Shows overall totals (expenses, projects funded, completed projects)
    - Displays all expenses in a table
    """
    summary = OverallSummary.objects.get_or_create(name="Overall Summary")[0]

    expenses = Expense.objects.all()

    context = {
        "total_expenses": summary.total_expenses,
        "projects_funded": summary.projects_funded,
        "completed_projects": summary.completed_projects,
        "expenses": expenses,
    }
    return render(request, "varu/expenses.html", context)
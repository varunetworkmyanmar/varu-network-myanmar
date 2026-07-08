from django.contrib import admin
from .models import Donation, Project, Expense, OverallSummary

@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ("donor_name", "amount_mmk", "date", "receiver")
    list_filter=("donor_name","date")
    search_fields = ("donor_name", "receiver")


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title","category","is_completed")
    list_filter = ("is_completed",)
    search_fields = ("title","category")


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ("description", "amount_mmk", "date", "approved_by", "project", "proof")
    list_filter = ("project", "date")
    search_fields = ("description", "approved_by")


@admin.register(OverallSummary)
class OverallSummaryAdmin(admin.ModelAdmin):
    list_display = ("name", "total_donations", "total_expenses", "remaining_balance", "projects_funded", "completed_projects")

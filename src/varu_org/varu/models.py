from django.db import models
from django.db.models import Sum
from django.core.exceptions import ValidationError


class Donation(models.Model):
    """
    Stores information about an individual donation.
    All fields are required and validated together.
    """

    donor_name = models.CharField(max_length=100, blank=False, null=False)
    amount_mmk = models.PositiveIntegerField(blank=False, null=False)
    date = models.DateField(blank=False, null=False)
    receiver = models.CharField(max_length=100, blank=False, null=False)

    def clean(self):
        """
        Extra validation to ensure all fields are filled.
        """
        if not self.donor_name or not self.amount_mmk or not self.date or not self.receiver:
            raise ValidationError("All donation fields (donor_name, amount_mmk, date, receiver) are required.")

    def __str__(self):
        return f"{self.donor_name} donated {self.amount_mmk} MMK to {self.receiver} on {self.date}"


class Project(models.Model):
    """
    Represents a project funded by donations.
    """

    title = models.CharField(max_length=200, blank=False, null=False)
    is_completed = models.BooleanField(default=False)
    category = models.CharField(max_length=100, default="General", blank=False, null=False)


    def clean(self):
        if not self.title:
            raise ValidationError("Project must have a valid title.")

    def __str__(self):
        return self.title


class Expense(models.Model):
    """
    Stores expense records associated with funded projects.
    Proof and project are mandatory.
    """

    description = models.CharField(max_length=200, blank=False, null=False)
    amount_mmk = models.PositiveIntegerField(blank=False, null=False)
    date = models.DateField(blank=False, null=False)
    approved_by = models.CharField(max_length=100, blank=False, null=False)

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="expenses", blank=False, null=False)
    proof = models.URLField(blank=False, null=False, help_text="Proof document URL is required (receipt, invoice, etc.)")

    def clean(self):
        """
        Extra validation to enforce proof and project requirements.
        """
        if not self.proof:
            raise ValidationError("Proof URL is required for every expense.")
        if not self.project or not self.project.title:
            raise ValidationError("Expense must be linked to a valid project with a title.")

    def __str__(self):
        return f"{self.description} - {self.amount_mmk} MMK"


class OverallSummary(models.Model):
    """
    Provides dynamically calculated statistics for donations,
    expenses, and funded projects.
    """

    name = models.CharField(max_length=50, default="Overall Summary", unique=True)

    @property
    def total_donations(self):
        return Donation.objects.aggregate(total=Sum("amount_mmk"))["total"] or 0

    @property
    def total_expenses(self):
        return Expense.objects.aggregate(total=Sum("amount_mmk"))["total"] or 0

    @property
    def remaining_balance(self):
        return self.total_donations - self.total_expenses

    @property
    def projects_funded(self):
        return Project.objects.count()

    @property
    def completed_projects(self):
        return Project.objects.filter(is_completed=True).count()

    def __str__(self):
        return self.name

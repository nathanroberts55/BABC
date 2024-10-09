# your_app/templatetags/custom_filters.py

from django import template

register = template.Library()


@register.filter
def format_authors(authors):
    if not authors:
        return ""
    authors_list = authors.split(",")
    if len(authors_list) == 1:
        return authors_list[0]
    elif len(authors_list) == 2:
        return " and ".join(authors_list)
    else:
        return ", ".join(authors_list[:-1]) + " and " + authors_list[-1]

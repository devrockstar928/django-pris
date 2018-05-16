from django import template
import HTMLParser

register = template.Library()


@register.filter(name='to_html')
def to_html(value):
    value = value.replace('<td class="field-description">', '', 1)
    value = value.replace('</td>', '', 1)
    html_parser = HTMLParser.HTMLParser()
    unescaped = html_parser.unescape(value)
    return unescaped

@register.filter(name='to_html1')
def to_html1(value):
    value = value.replace('<td class="field-image">', '', 1)
    value = value.replace('</td>', '', 1)
    html_parser = HTMLParser.HTMLParser()
    unescaped = html_parser.unescape(value)
    return unescaped
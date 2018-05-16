from organizations.models import Organization


def user_organization(backend, response, details, user=None, *args, **kwargs):
    if user and response and user.organization.count() == 0:
        title = None

        if backend.name == 'slack':
            title = response['team']
        elif backend.name == 'google-oauth2':
            if 'organizations' in response:
                org = filter(lambda o: o['type'] == 'work' and o['primary'],
                        response.get('organizations', []))
                if org:
                    title = org[0]['name']
                else:
                    title = details['email'].rsplit('@', 1)[-1]
            else:
                title = details['email'].rsplit('@', 1)[-1]

        if title:
            org, created = Organization.objects.get_or_create(title=title)
            org.users.add(user)

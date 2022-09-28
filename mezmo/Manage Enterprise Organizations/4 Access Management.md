---
type: page
title: Access Management
listed: true
slug: access-management
description: 
index_title: Access Management
hidden: 
---published

$plugin[{
    "type": "synced-block",
    "data": {
        "syncedBlockId": "enteprisebanner"
    }
}]$

On the [Access Management](https://app.Mezmo.com/enterprise/access-management)  page you can configure the type of method that your child organizations will use to log in to the Mezmo Web App.

## Sign In Policy

- **Local Sign-in** - Use the credentials they've created in Mezmo.
- **Google Sign-in** - Log in with Google credentials.
- **Other OAuth Sign-in** - Log in with credentials from other providers like GitHub or Heroku.
- **SAML Sign-in** - Set a Security Access Markup Language (SAML) configuration for child organizations within the enterprise. See, [Enterprise SAML SSO](https://docs.mezmo.com/docs/saml-sso)
- **Idle Logout** - Set a time to log out account holders after they've been inactive.
- **Redirect after logout** - Set a page to redirect account holders to after they've been logged out

## Discoverability

[auto$](/docs/add-child-organization) discoverability lets users find and join child organizations on the same domain. If you have a Mezmo Enterprise Organization account, you can enable SSO Discoverability for your child domains. Discoverability lets users logging in using SAML, see all child accounts present in the Enterprise Organization that have discoverability enabled.

Discoverability is disabled by default. This means users cannot discover child accounts, regardless of the settings made within the child accounts.

To enable SSO Discoverability, navigate to the Enterprise dashboard in the Mezmo web app, then toggle the Child organization discoverability setting to the On position.

$plugin[{
    "type": "image",
    "data": {
        "url": "https:\/\/uploads.developerhub.io\/prod\/2KW7\/j80pl27kpcrj1rrb7l3wlfsrcby8hqlzkfhuu5vlq5zer1a74lnvwa5s1kxv88ru.png",
        "mode": "responsive",
        "width": 936,
        "height": 237,
        "caption": "The control to enable child organization discoverability in the Enterprise dashboard"
    }
}]$

After enabling SSO Discoverability, you can enable discoverability settings within each child account, which will let you control how users can find and join your organization.

- **Discover**  - Members on the same domain can find and ask to join the organization. Discover is enabled by default.
- **Join** - Members on the same domain can join the organization without a request.

Your domain is determined by the email address you used when creating your Mezmo account. If you would like to add domains, please contact Mezmo support.

## SAML Configuration

Use SSO for all child organizations. Learn more about [Enterprise SAML SSO](https://docs.mezmo.com/docs/saml-sso).


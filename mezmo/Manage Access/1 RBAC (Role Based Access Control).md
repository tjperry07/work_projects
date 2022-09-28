---
type: page
title: RBAC (Role Based Access Control)
listed: true
slug: rbac
description: 
index_title: RBAC (Role Based Access Control)
hidden: 
---published



Members are users who have signed up for your Organization. [Members](https://docs.mezmo.com/docs/how-to-manage-users) can be assigned roles that give them certain privileges. Members can also be assigned to [groups](https://docs.mezmo.com/docs/groups) to give them access to certain logs.

## Roles

Roles have default privileges. Mezmo supports four types of roles:

- **Owner** - The Mezmo organization has one owner who can't be restricted. They have the most access and can view all logs, add and remove admins and members.
- **Admin** - Each Mezmo organization can have more than one admin. Admins have the second highest level of access on the platform. They can view all logs and their access can not be restricted.
- **Member**- Standard members of your Mezmo organization. Members will be subject to access as defined by your access rules based on groups.
- **Read** - Read-only roles have access to view logs, perform searches, view boards, and export lines with no access to change.

Review the [Feature Access Matrix](https://docs.mezmo.com/docs/feature-access-matrix) for a breakdown of each roles privileges.

## Groups

Groups contain Members who have access to logs based on a query. Only users with the role of `Member` can be added to a group. Owners, Admins and Read roles aren't able to be added to a group. By default members who aren't part of a group have access to everything. Learn more in [Manage Groups](https://docs.mezmo.com/docs/groups).

## When to Use Roles and Groups

Groups are useful for limiting access to certain types of log data for specific users on your team. For example, if your SREs only need access to a specific source, you can define a group with a query that allows access to that specific source and add all the SREs to the group.

Users with the role of Member can also be a part of multiple groups. This means that they would have access to all the information in each of the groups.

When a member joins a group, they won't know what data they can see. If they search for something they can't access, they won't get a warning.

## Feature Notes

- Only Members can be added to Groups. Owner and Admins cannot be added to Groups.
- Only Owner and Admins can manage Groups.
- Owner and Admins can access all log data without any restrictions.






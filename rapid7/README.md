# Rapid7

My job duties at Rapid7 are much different than they were at BigCommerce. While I still write documentation and help maintain API documentation, I find myself being able to help with training, processes and helping to make overarching decisions about documentation. Some of the work I am involved in includes:

-   Creating metrics around the help documentation
-   Advising on what an API and SDK MVP is
-   What does a developer portal need to succeed
-   Creating a plan to have open-source documentation for Metasploit.com
-   Working with my teammates to close the content gap on tCell
-   Researching and introduce new tools to make the documentation better
-   Training my teammates on the more developer focused portions of our job
-   Add tooling around our docs-as-code workflow
    -   For those not famaliar with the command line use GitHub desktop
    -   Create a branch with the ticket label and short description
    -   Work on your changes with frequent commits to save your work
    -   Make a final commit with a short summary of changes
    -   Push branch to documentation repo.
    -   In the pull request description - go into detail on any changes made with a link back to the original ticket.
    -   Add any labels needed
    -   Assign the PR to the reviewers for that week
    -   Setup codeowners to make sure all PRs were reviewed by someone on the docs team before publishing
    -   No one can publish to master. Not even the codeowners
    -   To filter out all the spam by being codeowners, integrated GitHub into a dedicated Slack channel and setup keywords so we could know when we were tagged as a reviewer or a review was re-requested
    -   Create a Gmail filter to remove the “noise” since we have Slack notifications
    -   Add in GitHub actions for Vale, First time committers and link checkers
    -   Only create branches from master
    -   Start every day by pulling from master
    -   We don’t care about the commit history
    -   No need to squash. IF you want to squash use the button in the GitHub Repo, don’t do it locally (its confusing locally)
-   Leading weekly sessions on making the most of the new tools and figure out the process
-   Converting the [style guide](https://github.com/tjperry07/ux-writing-linter-r7-old) to Vale
-   Added [plugins](https://tatianaperry.com/current-writing-setup-june-2020) to help check for broken links and format the markdown
-   Convert the [InsightIDR reference documentation](https://docs.rapid7.com/insightidr/log-search-api/) from Markdown to OpenAPI 3.0

## Metasploit Pro

Metasploit Pro is the first project I tackled.

The documentation needed an audit for gaps and a new site Information Architecture. I started by interviewing support, the engineering team that manages the product, and the previous writer. All of the information allowed me to create a plan to organize the site by a standard pen-testing workflow, along with user interface walkthroughs. I also organized the information by importance to the customer.

## Training

I am tasked with creating training around the more developer focused parts my job. 

The first significant piece of training was a crash course around documenting APIs.The team needed to get up to speed and quickly. I used Stoplight [https://stoplight.io/](https://stoplight.io/)as the basis for the course because it provides a simple user interface you can use to compare to the Swagger.

The class is built using Hugo. [https://github.com/tjperry07/ux-writing-training](https://github.com/tjperry07/ux-writing-training)
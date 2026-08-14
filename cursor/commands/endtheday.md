# End the Day

## Description

1. Check for uncommited changes. If there are uncommited changes, ask if want to commit the changes or discard the changes.
2. If they commit the changes do this:
   1. Ask if they want to make a pull request.
   2. The commit message should be an abbreviated list of changed files.
   3. Check for an existing pull request.
      1. If there is one, push the changes.
      2. If there isn't one, create a pull request and push the changes.
      3. Stop the server running at localhost:3000.
3. If they don't commit the changes, discard them.
4. Stop the server running at localhost:3000.
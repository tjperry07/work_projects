# Start the day

## Description

1. Check for uncommited changes. If there are uncommited changes, ask if want to commit the changes or discard the changes.
2. If they commit the changes do this:
   1. Ask if they want to make a pull request.
   2. The commit message should be an abbreviated list of changed files.
   3. Check for an existing pull request.
      1. If there is one, push the changes. Then jump to step 4.
      2. If there isn't one, create a pull request and push the changes. Then jump to step 4.
   4. Ask if they want to start new changes or stay on the current branch.
      1. If they want to stay on the current branch, the instructions end here.
      2. If they want to start new changes:
         1. Check to see if its the develop branch. If not, it switch to the develop branch.
         2. Pull down the most recent changes to develop.
         3. Create and switch to the new branch with the format "random-text-yyyy-mm-dd-githubusername"
         4. Start the local host using npm start.
3. If they discard the changes do this:
   1. Check to see if its the develop branch. If not, it switch to the develop branch.
   2. Pull down the most recent changes to develop.
   3. Create and switch to the new branch with the format "docs-upate-yyyy-mm-dd-githubusername"
   4.  Start the local host using npm start.
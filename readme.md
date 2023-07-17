# DaSS

# Assignment 1

> Name - Manuj Garg

> Roll No - 2021101047

#### FOR THE USER THE USERNAME IS TREATED AS UNIQUE IDENTIFIER FOR THAT USER ####

#### IF A USER ENTERS AN INVALID ADDRESS HE/SHE WILL BE REDIRECTED TO NOT FOUND PAGE WHERE THE USER CAN GO BACK TO LOGIN OR PROFILE PAGE ####

#### DIRECT API CALLS ARE ALSO HANDELED WHEREVER MENTIONED ####

### LOGIN AND REG ###
- A user can register with valid EMIALID ( should be of the format string@domain where domain includes gmail.co/gmail.com) , VALID AGE (should be a number and between 8 and 100) , VALID CONTACT NUMBER (should be a 10-digit number) 
- If any of the above conditions are not met , the register button will be disabled (also handeled in direct api call) . Once registered the user will be redirected to login page where he/she can login into the website
- A token is generated on login and the user is only redirected to profile page iff the token is not changed 

### PROFILE ###
- Once logged in the user is redirected to profile page where links to subgreddit , his/her subgreddit page , saved post page
- Here the user can edit the profile except the username with input validation done in frontend only 

### MY SUB ###
- We can create , view(also open them) and delete subgreddits here where the moderator is the current user
- Only the moderator of that subgreddit will be able to view the users , requests , reports of that subgred (handeled also when we directly try to go to dedicated links and in the backend) --> has not handeled if the any user takes an action on the feature if the user is not the moderator in the backend 
- The users , requests , reports links are rendered conditionally where each feature has a dedicated page when we click on it.
- The no of people that is displayed in subgred is the no of joined users
- If a user is rejected he/she can req to join again after 7 days
- In the reported page the ignore button is a toggling switch between enabling and disabling other two buttons
- Once a user is blocked , he/she is permanently blocked (can't request to join the subgred)
- The variable for not handling a report is set to 10 days

### SUB GRED ###
- Here searching and filtering is implemented that can be applied one after another
- But once the sorting is applied can't apply search or filter again on the reslutant (have to default to none if we want to do any of that action).
- Basically the sort and search should be applied separately and should not be mixed 
- For moderators the leave button is disabled whereas a user if not blocked or haven't requested earlier or haven't been rejected within 7 days time period of rejection and pressing of join button now can request to join the subgred
- Only the joined users can view the posts in the subgred
- Also the tags will be defaulted to lower case only when the user creates a subgred

### POST ###
- Here any joined user of that subgreddit can view the posts posted by the users once joined in that subgred
- All the posts can be seen by scrolling the area where the posts are there
- The image is fixed 
- Any user can upvoted / downvote , save the post , add a comment , report the post , follow the user who posted the post
- The upvote / downvote button is built as a user can once choose to upvote or downvote once and can toggle between upvote and downvote
- A user can add a comment or see the full comment section by clicking on "COMMENT" text on webpage
- A user can save a particular post only once
- A user can follow the user who posted the post if he/she is not following that user
- A user can't report himself or moderator of subgred
- When a user adds a post and if the post has the banned keywords as defined the keywords will be replaced by "*". Also this keyword should be proper like if the banned keyword is hey then hey? won't be considered.
- If the moderator blocks a user other joined user (other than the mods) will see the name replaced by BLOCKED USER as mentioned
- Also a user can't follow a blocked user or himself/herself

<br>

### TO RUN EXECUTE COMMAND ###

```
sudo docker-compose up 
```

### TO STOP RUN ###

```
sudo docker-compose down
```
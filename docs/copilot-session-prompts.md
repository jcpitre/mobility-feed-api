# My prompts - Copilot CLI session (2026-03-27 to 2026-03-30)


14. Can you examine the mobility-feed-api project and tell me how you would separate it in 2 projects. One project would contain the API itself, that any contributor could fully build and test, and the other project would use the api and contain everything about deployment that is specific to MobitlityData. For the API part the user could provide his/her own postgres DB.
15. Decisions: 1 - include liquibase in both repos. Web app is already separated in the mobilitydatabase-web project. We just have not removed the old web code from mobility-feed-api. Give me a more detailed migration plan.
17. Create a fork of mobility-feed-api in my account. Do the changes from the plan on the fork (you can create mobility-feed-platform). Under no circumstances can you modify any project already existing, particulary do not modify mobility-feed-api. Work on the fork. In the end, if I delete the fork and any new project created I want to go back the current state exactly.


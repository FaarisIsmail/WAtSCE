read -p "Enter your dev branch: " devBranch

git checkout main
git pull origin main
git checkout ${devBranch}
git merge main
git push origin ${devBranch}
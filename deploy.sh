read -p "Enter your dev branch: " devBranch
read -p "Enter your commit message: " commitMessage

git add .
git commit -m "${commitMessage}"
git checkout main
git pull origin main
git merge ${devBranch}
git add .
git commit -m "${commitMessage}"
git push origin main
git checkout ${devBranch}
git merge main
git push origin ${devBranch}
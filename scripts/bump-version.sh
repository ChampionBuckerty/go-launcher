#!/bin/bash

echo "Bumping version from ${1} to ${2}"
echo "Replacing version in selfupdate.go"
sed -i '' s/$1/$2/g ./internal/update.go
echo "Replacing version in launcher.exe.manifest"
sed -i '' s/$1\.0/$2\.0/g ./build/windows/launcher.exe.manifest
echo "Replacing version in package.json"
sed -i '' s/$1/$2/g ./frontend/package.json
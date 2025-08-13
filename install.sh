echo setting up folders...
for folder_name in "extracted" "por_files" "sheets"; do mkdir -p "data/${folder_name}"; done
echo done. installing packages...
corepack yarn
echo done. setting up config enviroment.
node first-setup.mjs
echo done. removing.
echo done. exitting.
rm install.sh first-setup.mjs
exit 0
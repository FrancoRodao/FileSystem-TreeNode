import { treeNodeFolder } from "./systemfile.js"

treeNodeFolder.addFile("/a.txt")
treeNodeFolder.addFile("/a.txt")

treeNodeFolder.addFile("/b.txt")
treeNodeFolder.addFile("/folder")

treeNodeFolder.addFile("/folder/folder2/folder3/algo.txt")
treeNodeFolder.addFile("/folder/folder2/folder4/folder5/algo2.txt")
treeNodeFolder.addFile("/folder/folder2/folder4/folder5/algo2.txt")

treeNodeFolder.addFolder("/folder_raiz")
treeNodeFolder.addFolder("/folder_raiz")
treeNodeFolder.addFolder("/folder/folder_random")
treeNodeFolder.addFolder("/folder/folder_random")

const initialPath = "/"

const addFolderBtn = document.querySelector(".btn-add-folder")
addFolderBtn.addEventListener("click", e => {
	const folderName = prompt("Nombre de la nueva carpeta")
	treeNodeFolder.addFolder(`${initialPath}${folderName}`)
})

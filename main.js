import { treeNodeFolder } from "./filesystem.js"

const initialPath = "/"

const addFolderBtn = document.querySelector(".btn-add-folder")
const addFileBtn = document.querySelector(".btn-add-file")

addFolderBtn.addEventListener("click", e => {
	const folderName = prompt("Nombre de la nueva carpeta")
	treeNodeFolder.addFolder(initialPath, folderName)
	console.log(treeNodeFolder)
})

addFileBtn.addEventListener("click", e => {
	const fileName = prompt("Nombre del archivo nuevo")
	treeNodeFolder.addFile(initialPath, fileName)
	console.log(treeNodeFolder)
})
